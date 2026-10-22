package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"testing/fstest"
)

func TestServer(t *testing.T) {
	t.Setenv("VITE_PORTAL_SERVER_URL", "/v1")
	t.Setenv("OTHER", "hidden")
	files, err := load(fstest.MapFS{
		"index.html":       {Data: []byte(`<script>const insertedEnvironmentVariables = {};</script>`)},
		"assets/app-1a.js": {Data: []byte(`console.log(1)`)},
	})
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(handler(files))
	defer srv.Close()

	index := "<script>\nconst insertedEnvironmentVariables = {\"VITE_PORTAL_SERVER_URL\":\"/v1\"};\n</script>"
	tests := []struct{ path, body string }{
		{"/", index},
		{"/apis/my-api/schema", index},
		{"/assets/app-1a.js", `console.log(1)`},
	}
	for _, tt := range tests {
		resp, err := http.Get(srv.URL + tt.path)
		if err != nil {
			t.Fatal(err)
		}
		body, _ := io.ReadAll(resp.Body)
		_ = resp.Body.Close()
		if resp.StatusCode != http.StatusOK || string(body) != tt.body {
			t.Errorf("%s: got %d %q, want 200 %q", tt.path, resp.StatusCode, body, tt.body)
		}
		if got := resp.Header.Get("Cache-Control"); got != "public, max-age=0" {
			t.Errorf("%s: Cache-Control %q, want %q", tt.path, got, "public, max-age=0")
		}
	}
}
