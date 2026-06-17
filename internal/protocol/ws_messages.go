package protocol

import (
	"fmt"
	"strings"
)

const (
	TypeWSOpen     = "ws_open"
	TypeWSOpenOK   = "ws_open_ok"
	TypeWSOpenFail = "ws_open_fail"
)

type WSOpenMessage struct {
	Type       string              `json:"type"`
	StreamID   string              `json:"stream_id"`
	Method     string              `json:"method"`
	Path       string              `json:"path"`
	Query      string              `json:"query"`
	Headers    map[string][]string `json:"headers"`
	BodyBase64 string              `json:"body_base64,omitempty"`
}

type WSOpenOKMessage struct {
	Type     string              `json:"type"`
	StreamID string              `json:"stream_id"`
	Headers  map[string][]string `json:"headers"`
}

type WSOpenFailMessage struct {
	Type       string `json:"type"`
	StreamID   string `json:"stream_id"`
	StatusCode int    `json:"status_code,omitempty"`
	Message    string `json:"message"`
}

func ValidateWSOpen(m *WSOpenMessage) error {
	if err := validateStringField("stream_id", m.StreamID, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("method", m.Method, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("path", m.Path, MaxPathLen); err != nil {
		return err
	}
	if err := validateStringField("query", m.Query, MaxPathLen); err != nil {
		return err
	}
	if stringsContainsCRLF(m.Query) {
		return fmt.Errorf("invalid query")
	}
	if err := validateStringField("body_base64", m.BodyBase64, MaxBodyBase64Len); err != nil {
		return err
	}
	return validateHeaders(m.Headers)
}

func ValidateWSOpenOK(m *WSOpenOKMessage) error {
	if err := validateStringField("stream_id", m.StreamID, MaxIDLen); err != nil {
		return err
	}
	return validateHeaders(m.Headers)
}

func ValidateWSOpenFail(m *WSOpenFailMessage) error {
	if err := validateStringField("stream_id", m.StreamID, MaxIDLen); err != nil {
		return err
	}
	return validateStringField("message", m.Message, MaxMessageLen)
}

func stringsContainsCRLF(s string) bool {
	return strings.ContainsAny(s, "\r\n\x00")
}
