package server

import (
	"sync"
)

const maxWSStreamsPerTunnel = 10

type wsRelayFrame struct {
	Opcode int
	Data   []byte
}

type wsOpenResult struct {
	OK         bool
	Headers    map[string][]string
	StatusCode int
	Message    string
}

type wsStream struct {
	id         string
	openResult chan wsOpenResult
	fromClient chan wsRelayFrame
	done       chan struct{}
	closeOnce  sync.Once
}

func (s *wsStream) close() {
	s.closeOnce.Do(func() {
		close(s.done)
	})
}

func (t *Tunnel) registerWSStream(id string) (*wsStream, error) {
	t.wsMu.Lock()
	defer t.wsMu.Unlock()
	if t.wsStreams == nil {
		t.wsStreams = make(map[string]*wsStream)
	}
	if len(t.wsStreams) >= maxWSStreamsPerTunnel {
		return nil, errTooManyWSStreams
	}
	stream := &wsStream{
		id:         id,
		openResult: make(chan wsOpenResult, 1),
		fromClient: make(chan wsRelayFrame, 32),
		done:       make(chan struct{}),
	}
	t.wsStreams[id] = stream
	return stream, nil
}

func (t *Tunnel) unregisterWSStream(id string) {
	t.wsMu.Lock()
	defer t.wsMu.Unlock()
	if stream, ok := t.wsStreams[id]; ok {
		stream.close()
		delete(t.wsStreams, id)
	}
}

func (t *Tunnel) getWSStream(id string) *wsStream {
	t.wsMu.RLock()
	defer t.wsMu.RUnlock()
	return t.wsStreams[id]
}

func (t *Tunnel) closeAllWSStreams() {
	t.wsMu.Lock()
	defer t.wsMu.Unlock()
	for id, stream := range t.wsStreams {
		stream.close()
		delete(t.wsStreams, id)
	}
}

type wsStreamLimitError struct{}

func (wsStreamLimitError) Error() string { return "too many websocket streams" }

var errTooManyWSStreams = wsStreamLimitError{}
