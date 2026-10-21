// Command server serves the built UI as a single-page app, with runtime config
// from env vars. main.go is shared as-is between repos; config.go holds what differs.
package main

import (
	"bytes"
	"cmp"
	"compress/gzip"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io/fs"
	"log"
	"maps"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"path"
	"slices"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type file struct {
	body, gz    []byte
	ctype, etag string
}

var types = map[string]string{
	".html":        "text/html; charset=utf-8",
	".js":          "application/javascript; charset=utf-8",
	".css":         "text/css; charset=utf-8",
	".json":        "application/json; charset=utf-8",
	".svg":         "image/svg+xml",
	".png":         "image/png",
	".jpg":         "image/jpeg",
	".jpeg":        "image/jpeg",
	".gif":         "image/gif",
	".ico":         "image/x-icon",
	".woff":        "font/woff",
	".woff2":       "font/woff2",
	".ttf":         "font/ttf",
	".otf":         "font/otf",
	".webp":        "image/webp",
	".md":          "text/markdown; charset=utf-8",
	".yaml":        "text/yaml; charset=utf-8",
	".yml":         "text/yaml; charset=utf-8",
	".txt":         "text/plain; charset=utf-8",
	".webmanifest": "application/manifest+json",
}

var gzipExts = []string{".js", ".css", ".html", ".json", ".svg"}

func main() {
	files, err := load(os.DirFS(dir))
	if err != nil {
		log.Fatal(err)
	}
	srv := &http.Server{Addr: addr, Handler: handler(files), ReadHeaderTimeout: 10 * time.Second}
	go func() {
		if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	}()
	log.Printf("Server listening on %s", addr)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
	defer stop()
	<-ctx.Done()
	if err := srv.Shutdown(context.Background()); err != nil {
		log.Fatal(err)
	}
}

// load reads every file into memory once, so the server needs no writable directory.
func load(fsys fs.FS) (map[string]*file, error) {
	bodies := map[string][]byte{}
	err := fs.WalkDir(fsys, ".", func(name string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return err
		}
		bodies[name], err = fs.ReadFile(fsys, name)
		return err
	})
	if err != nil {
		return nil, err
	}
	maps.Copy(bodies, extraFiles())
	if bodies["index.html"] == nil {
		return nil, errors.New("index.html not found")
	}

	files := make(map[string]*file, len(bodies))
	for name, body := range bodies {
		body = rewrite(name, body)
		ext := strings.ToLower(path.Ext(name))
		sum := sha256.Sum256(body)
		f := &file{
			body:  body,
			ctype: cmp.Or(types[ext], mime.TypeByExtension(ext), "application/octet-stream"),
			etag:  `W/"` + hex.EncodeToString(sum[:8]) + `"`,
		}
		if gzipOn && slices.Contains(gzipExts, ext) {
			var buf bytes.Buffer
			zw := gzip.NewWriter(&buf)
			_, _ = zw.Write(body)
			_ = zw.Close()
			f.gz = buf.Bytes()
		}
		files[name] = f
	}
	return files, nil
}

// handler serves a file, a directory's index.html, or index.html for any other path.
func handler(files map[string]*file) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		f, ok := files[name]
		if !ok {
			name = path.Join(name, "index.html")
			if f, ok = files[name]; !ok {
				name = "index.html"
				f = files[name]
			}
		}

		h := w.Header()
		for k, v := range headers {
			h.Set(k, v)
		}
		h.Set("Content-Type", f.ctype)
		h.Set("Cache-Control", cacheControl(name))
		h.Set("ETag", f.etag)
		if gzipOn {
			h.Set("Vary", "Accept-Encoding")
		}
		status := http.StatusOK
		body := f.body
		if r.Header.Get("If-None-Match") == f.etag {
			status, body = http.StatusNotModified, nil
		} else if f.gz != nil && strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			h.Set("Content-Encoding", "gzip")
			body = f.gz
		}
		if body != nil {
			h.Set("Content-Length", strconv.Itoa(len(body)))
		}
		w.WriteHeader(status)
		_, _ = w.Write(body)
		log.Printf(`%s - "%s %s" %d`, cmp.Or(r.Header.Get("X-Forwarded-For"), r.RemoteAddr), r.Method, r.URL, status)
	})
}

// jsonObject encodes pairs as a JSON object in the given order, without HTML escaping.
func jsonObject(pairs [][2]string) []byte {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	buf.WriteByte('{')
	for i, p := range pairs {
		if i > 0 {
			buf.WriteByte(',')
		}
		_ = enc.Encode(p[0])
		buf.Truncate(buf.Len() - 1)
		buf.WriteByte(':')
		_ = enc.Encode(p[1])
		buf.Truncate(buf.Len() - 1)
	}
	buf.WriteByte('}')
	return buf.Bytes()
}
