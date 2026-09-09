package protocol

import (
	"encoding/json"
	"testing"
)

func TestRegisteredBasicAuthAckRoundTrip(t *testing.T) {
	data, err := json.Marshal(RegisteredMessage{Type: TypeRegistered, Subdomain: "demo", BasicAuth: true})
	if err != nil {
		t.Fatal(err)
	}
	var raw map[string]any
	if err := json.Unmarshal(data, &raw); err != nil {
		t.Fatal(err)
	}
	if raw["basic_auth"] != true {
		t.Fatalf("wire field basic_auth missing: %s", data)
	}

	// An older server never sets the field; the client must see false.
	old, err := ParseRegistered(json.RawMessage(`{"type":"registered","tunnel_id":"t","subdomain":"demo","public_url":"https://demo.ophl.link"}`))
	if err != nil {
		t.Fatal(err)
	}
	if old.BasicAuth {
		t.Fatal("absent basic_auth must parse as false")
	}
}
