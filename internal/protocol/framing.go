package protocol

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

const MaxMessageSize = 14 * 1024 * 1024 // 14MB encoded

func ReadMessage(conn *websocket.Conn) (Envelope, json.RawMessage, error) {
	_, data, err := conn.ReadMessage()
	if err != nil {
		return Envelope{}, nil, err
	}
	var env Envelope
	if err := json.Unmarshal(data, &env); err != nil {
		return Envelope{}, nil, fmt.Errorf("invalid json: %w", err)
	}
	return env, data, nil
}

func WriteMessage(conn *websocket.Conn, v any) error {
	data, err := json.Marshal(v)
	if err != nil {
		return err
	}
	return conn.WriteMessage(websocket.TextMessage, data)
}

func ParseRegister(data json.RawMessage) (RegisterMessage, error) {
	var m RegisterMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateRegister(&m)
}

func ParseRegistered(data json.RawMessage) (RegisteredMessage, error) {
	var m RegisteredMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateRegistered(&m)
}

func ParseRequest(data json.RawMessage) (RequestMessage, error) {
	var m RequestMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateRequest(&m)
}

func ParseResponse(data json.RawMessage) (ResponseMessage, error) {
	var m ResponseMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateResponse(&m)
}

func ParseError(data json.RawMessage) (ErrorMessage, error) {
	var m ErrorMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateError(&m)
}
