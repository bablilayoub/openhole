package protocol

const (
	TypeRegister   = "register"
	TypeRegistered = "registered"
	TypeRequest    = "request"
	TypeResponse   = "response"
	TypeError      = "error"
	TypePing       = "ping"
	TypePong       = "pong"
)

type Envelope struct {
	Type string `json:"type"`
}

type RegisterMessage struct {
	Type               string `json:"type"`
	ClientID           string `json:"client_id"`
	RequestedSubdomain string `json:"requested_subdomain,omitempty"`
	ReclaimToken       string `json:"reclaim_token,omitempty"`
	LocalPort          int    `json:"local_port"`
	LocalHost          string `json:"local_host"`
	Version            string `json:"version"`
}

type RegisteredMessage struct {
	Type         string `json:"type"`
	TunnelID     string `json:"tunnel_id"`
	Subdomain    string `json:"subdomain"`
	PublicURL    string `json:"public_url"`
	ReclaimToken string `json:"reclaim_token,omitempty"`
}

type RequestMessage struct {
	Type       string              `json:"type"`
	RequestID  string              `json:"request_id"`
	Method     string              `json:"method"`
	Path       string              `json:"path"`
	Query      string              `json:"query"`
	Headers    map[string][]string `json:"headers"`
	BodyBase64 string              `json:"body_base64"`
}

type ResponseMessage struct {
	Type       string              `json:"type"`
	RequestID  string              `json:"request_id"`
	StatusCode int                 `json:"status_code"`
	Headers    map[string][]string `json:"headers"`
	BodyBase64 string              `json:"body_base64"`
}

type ErrorMessage struct {
	Type      string `json:"type"`
	RequestID string `json:"request_id,omitempty"`
	Message   string `json:"message"`
}

type PingMessage struct {
	Type string `json:"type"`
}

type PongMessage struct {
	Type string `json:"type"`
}
