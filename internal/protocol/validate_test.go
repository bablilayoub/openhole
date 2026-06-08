package protocol

import (
	"strconv"
	"strings"
	"testing"
)

func TestValidateRequestRejectsTooManyHeaders(t *testing.T) {
	headers := make(map[string][]string)
	for i := 0; i < MaxHeaderCount+1; i++ {
		headers["X-Header-"+strconv.Itoa(i)] = []string{"ok"}
	}
	err := ValidateRequest(&RequestMessage{
		Type:      TypeRequest,
		RequestID: "r1",
		Method:    "GET",
		Path:      "/",
		Headers:   headers,
	})
	if err == nil {
		t.Fatal("expected too many headers error")
	}
}

func TestValidateRequestRejectsOversizedPath(t *testing.T) {
	err := ValidateRequest(&RequestMessage{
		Type:      TypeRequest,
		RequestID: "r1",
		Method:    "GET",
		Path:      "/" + strings.Repeat("a", MaxPathLen+1),
	})
	if err == nil {
		t.Fatal("expected path too long error")
	}
}

func TestValidateRequestRejectsCRLFInQuery(t *testing.T) {
	err := ValidateRequest(&RequestMessage{
		Type:      TypeRequest,
		RequestID: "r1",
		Method:    "GET",
		Path:      "/",
		Query:     "q=1\r\nX-Injected: true",
	})
	if err == nil {
		t.Fatal("expected invalid query error")
	}
}

func TestValidateRegisteredRejectsBadReclaimToken(t *testing.T) {
	err := ValidateRegistered(&RegisteredMessage{
		Type:         TypeRegistered,
		TunnelID:     "t1",
		Subdomain:    "my-app",
		PublicURL:    "https://my-app.ophl.link",
		ReclaimToken: "not-hex",
	})
	if err == nil {
		t.Fatal("expected invalid reclaim token error")
	}
}

func TestValidateRequestRejectsCRLFInHeader(t *testing.T) {
	err := ValidateRequest(&RequestMessage{
		Type:      TypeRequest,
		RequestID: "r1",
		Method:    "GET",
		Path:      "/",
		Headers:   map[string][]string{"X-Bad": {"value\r\nInjected: true"}},
	})
	if err == nil {
		t.Fatal("expected invalid header value error")
	}
}
