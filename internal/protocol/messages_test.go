package protocol

import (
	"encoding/json"
	"testing"
)

func TestParseRegister(t *testing.T) {
	raw := json.RawMessage(`{"type":"register","client_id":"c1","local_port":3000,"local_host":"localhost","version":"0.1.0"}`)
	msg, err := ParseRegister(raw)
	if err != nil {
		t.Fatal(err)
	}
	if msg.Type != TypeRegister || msg.LocalPort != 3000 || msg.LocalHost != "localhost" {
		t.Fatalf("unexpected message: %+v", msg)
	}
}

func TestParseRegistered(t *testing.T) {
	raw := json.RawMessage(`{"type":"registered","tunnel_id":"t1","subdomain":"blue-fox","public_url":"https://blue-fox.ophl.link"}`)
	msg, err := ParseRegistered(raw)
	if err != nil {
		t.Fatal(err)
	}
	if msg.Subdomain != "blue-fox" || msg.PublicURL != "https://blue-fox.ophl.link" {
		t.Fatalf("unexpected message: %+v", msg)
	}
}

func TestParseRequestResponseError(t *testing.T) {
	reqRaw := json.RawMessage(`{"type":"request","request_id":"r1","method":"GET","path":"/","query":"","headers":{},"body_base64":""}`)
	req, err := ParseRequest(reqRaw)
	if err != nil || req.Method != "GET" || req.RequestID != "r1" {
		t.Fatalf("parse request: %+v err=%v", req, err)
	}

	respRaw := json.RawMessage(`{"type":"response","request_id":"r1","status_code":200,"headers":{},"body_base64":"aGk="}`)
	resp, err := ParseResponse(respRaw)
	if err != nil || resp.StatusCode != 200 || resp.BodyBase64 != "aGk=" {
		t.Fatalf("parse response: %+v err=%v", resp, err)
	}

	errRaw := json.RawMessage(`{"type":"error","request_id":"r1","message":"timeout"}`)
	em, err := ParseError(errRaw)
	if err != nil || em.Message != "timeout" {
		t.Fatalf("parse error: %+v err=%v", em, err)
	}
}

func TestMessageRoundTripJSON(t *testing.T) {
	orig := RegisterMessage{
		Type:      TypeRegister,
		ClientID:  "abc",
		LocalPort: 8080,
		LocalHost: "127.0.0.1",
		Version:   "0.1.0",
	}
	data, err := json.Marshal(orig)
	if err != nil {
		t.Fatal(err)
	}
	parsed, err := ParseRegister(data)
	if err != nil {
		t.Fatal(err)
	}
	if parsed.ClientID != orig.ClientID || parsed.LocalPort != orig.LocalPort {
		t.Fatalf("round trip mismatch: %+v", parsed)
	}
}
