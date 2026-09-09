package client

type Config struct {
	Port      int
	Host      string
	Subdomain string
	ServerURL string
	Token     string
	BasicAuth string // "user:pass" for public URL Basic Auth
	Verbose   bool
}
