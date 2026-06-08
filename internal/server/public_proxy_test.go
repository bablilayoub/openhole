package server

import (
	"net/http/httptest"
	"testing"
)

func TestRequestPathUsesEscapedPath(t *testing.T) {
	tests := []struct {
		name string
		url  string
		want string
	}{
		{
			name: "encoded dot segments",
			url:  "/%2e%2e/secret.txt",
			want: "/%2e%2e/secret.txt",
		},
		{
			name: "encoded slash in segment",
			url:  "/a%2fb",
			want: "/a%2fb",
		},
		{
			name: "normal path",
			url:  "/api/users",
			want: "/api/users",
		},
		{
			name: "root",
			url:  "/",
			want: "/",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			r := httptest.NewRequest("GET", tc.url, nil)
			if got := requestPath(r); got != tc.want {
				t.Fatalf("requestPath() = %q, want %q (URL.Path=%q)", got, tc.want, r.URL.Path)
			}
		})
	}
}

func TestRequestPathDoesNotDecodeTraversal(t *testing.T) {
	r := httptest.NewRequest("GET", "/%2e%2e/%2e%2e/etc/passwd", nil)

	got := requestPath(r)
	want := "/%2e%2e/%2e%2e/etc/passwd"
	if got != want {
		t.Fatalf("requestPath() = %q, want %q", got, want)
	}
	if got == r.URL.Path {
		t.Fatalf("requestPath() must not equal decoded URL.Path %q", r.URL.Path)
	}
}
