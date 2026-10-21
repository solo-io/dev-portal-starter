package main

import (
	"bytes"
	"cmp"
	"os"
	"strings"
)

const (
	dir    = "public/dist"
	gzipOn = false
)

var (
	addr    = ":" + cmp.Or(os.Getenv("PORT"), "4000")
	headers map[string]string
)

// placeholder is the empty config in index.html, replaced with every VITE_* env var.
const placeholder = "const insertedEnvironmentVariables = {};"

func extraFiles() map[string][]byte { return nil }

func rewrite(name string, body []byte) []byte {
	if name != "index.html" {
		return body
	}
	var pairs [][2]string
	for _, kv := range os.Environ() {
		if k, v, _ := strings.Cut(kv, "="); strings.HasPrefix(k, "VITE_") {
			pairs = append(pairs, [2]string{k, v})
		}
	}
	script := "\nconst insertedEnvironmentVariables = " + string(jsonObject(pairs)) + ";\n"
	return bytes.Replace(body, []byte(placeholder), []byte(script), 1)
}

func cacheControl(string) string { return "public, max-age=0" }
