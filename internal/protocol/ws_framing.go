package protocol

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/gorilla/websocket"
)

const (
	wsBinaryMagic   = "OHWS"
	wsBinaryPrefix  = 4 + 36 + 1 // magic + stream id + opcode
	wsStreamIDLen   = 36
	maxWSFrameBytes = 1 << 20 // 1 MiB per relayed frame
)

// WSFrame is a relayed WebSocket data frame on the control connection.
type WSFrame struct {
	StreamID string
	Opcode   int
	Payload  []byte
}

// TunnelMessage is either a JSON control message or a binary WebSocket relay frame.
type TunnelMessage struct {
	JSON    Envelope
	RawJSON json.RawMessage
	WSFrame *WSFrame
}

func ReadTunnelMessage(conn *websocket.Conn) (TunnelMessage, error) {
	mt, data, err := conn.ReadMessage()
	if err != nil {
		return TunnelMessage{}, err
	}
	if mt == websocket.BinaryMessage {
		frame, err := ParseWSFrame(data)
		if err != nil {
			return TunnelMessage{}, err
		}
		return TunnelMessage{WSFrame: frame}, nil
	}
	var env Envelope
	if err := json.Unmarshal(data, &env); err != nil {
		return TunnelMessage{}, fmt.Errorf("invalid json: %w", err)
	}
	return TunnelMessage{JSON: env, RawJSON: data}, nil
}

func WriteWSFrame(conn *websocket.Conn, streamID string, opcode int, payload []byte) error {
	if len(payload) > maxWSFrameBytes {
		return errors.New("websocket frame too large")
	}
	if len(streamID) != wsStreamIDLen {
		return fmt.Errorf("invalid stream id length")
	}
	buf := make([]byte, wsBinaryPrefix+len(payload))
	copy(buf[0:4], wsBinaryMagic)
	copy(buf[4:40], streamID)
	buf[40] = byte(opcode)
	copy(buf[41:], payload)
	return conn.WriteMessage(websocket.BinaryMessage, buf)
}

func ParseWSFrame(data []byte) (*WSFrame, error) {
	if len(data) < wsBinaryPrefix {
		return nil, errors.New("websocket frame too short")
	}
	if string(data[0:4]) != wsBinaryMagic {
		return nil, errors.New("invalid websocket frame magic")
	}
	streamID := string(data[4:40])
	if len(streamID) != wsStreamIDLen {
		return nil, errors.New("invalid stream id")
	}
	opcode := int(data[40])
	payloadLen := len(data) - wsBinaryPrefix
	if payloadLen > maxWSFrameBytes {
		return nil, errors.New("websocket frame too large")
	}
	payload := make([]byte, payloadLen)
	copy(payload, data[wsBinaryPrefix:])
	return &WSFrame{
		StreamID: streamID,
		Opcode:   opcode,
		Payload:  payload,
	}, nil
}

func ParseWSOpen(data json.RawMessage) (WSOpenMessage, error) {
	var m WSOpenMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateWSOpen(&m)
}

func ParseWSOpenOK(data json.RawMessage) (WSOpenOKMessage, error) {
	var m WSOpenOKMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateWSOpenOK(&m)
}

func ParseWSOpenFail(data json.RawMessage) (WSOpenFailMessage, error) {
	var m WSOpenFailMessage
	if err := json.Unmarshal(data, &m); err != nil {
		return m, err
	}
	return m, ValidateWSOpenFail(&m)
}
