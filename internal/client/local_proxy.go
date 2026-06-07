package client

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
)

const maxBodyBytes = 10 * 1024 * 1024

func ForwardToLocal(req protocol.RequestMessage, host string, port int) (protocol.ResponseMessage, time.Duration, error) {
	start := time.Now()

	url := fmt.Sprintf("http://%s:%d%s", host, port, req.Path)
	if req.Query != "" {
		url += "?" + req.Query
	}

	var body []byte
	if req.BodyBase64 != "" {
		var err error
		body, err = base64.StdEncoding.DecodeString(req.BodyBase64)
		if err != nil {
			return protocol.ResponseMessage{}, 0, err
		}
		if int64(len(body)) > maxBodyBytes {
			return protocol.ResponseMessage{}, 0, shared.ErrBodyTooLarge
		}
	}

	httpReq, err := http.NewRequest(req.Method, url, bytes.NewReader(body))
	if err != nil {
		return protocol.ResponseMessage{}, 0, err
	}

	for k, vals := range shared.SanitizeIncomingHeaderMap(req.Headers) {
		for _, v := range vals {
			httpReq.Header.Add(k, v)
		}
	}
	httpReq.Host = fmt.Sprintf("%s:%d", host, port)
	httpReq.Header.Set("Host", httpReq.Host)

	hc := &http.Client{Timeout: 30 * time.Second}
	resp, err := hc.Do(httpReq)
	if err != nil {
		return protocol.ResponseMessage{}, time.Since(start), err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(io.LimitReader(resp.Body, maxBodyBytes+1))
	if err != nil {
		return protocol.ResponseMessage{}, time.Since(start), err
	}
	if int64(len(respBody)) > maxBodyBytes {
		return protocol.ResponseMessage{}, time.Since(start), shared.ErrBodyTooLarge
	}

	headers := make(map[string][]string)
	for k, vals := range resp.Header {
		cp := make([]string, len(vals))
		copy(cp, vals)
		headers[k] = cp
	}

	return protocol.ResponseMessage{
		Type:       protocol.TypeResponse,
		RequestID:  req.RequestID,
		StatusCode: resp.StatusCode,
		Headers:    shared.SanitizeResponseHeaders(headers),
		BodyBase64: base64.StdEncoding.EncodeToString(respBody),
	}, time.Since(start), nil
}
