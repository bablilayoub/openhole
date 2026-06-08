package client

import (
	"bytes"
	"encoding/base64"
	"io"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
)

const maxBodyBytes = 10 * 1024 * 1024

func ForwardToLocal(req protocol.RequestMessage, host string, port int) (protocol.ResponseMessage, time.Duration, error) {
	start := time.Now()

	if err := shared.ValidateHTTPMethod(req.Method); err != nil {
		return protocol.ResponseMessage{}, 0, err
	}
	if err := shared.ValidateHost(host); err != nil {
		return protocol.ResponseMessage{}, 0, err
	}

	path := req.Path
	if path == "" {
		path = "/"
	}
	if err := shared.ValidateRequestPath(path); err != nil {
		return protocol.ResponseMessage{}, 0, err
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

	hostPort := net.JoinHostPort(host, strconv.Itoa(port))
	target := &url.URL{
		Scheme: "http",
		Host:   hostPort,
	}
	httpReq, err := http.NewRequest(req.Method, target.String(), bytes.NewReader(body))
	if err != nil {
		return protocol.ResponseMessage{}, 0, err
	}

	httpReq.URL.RawPath = path
	httpReq.URL.Path, err = url.PathUnescape(path)
	if err != nil {
		httpReq.URL.Path = path
	}
	if req.Query != "" {
		httpReq.URL.RawQuery = req.Query
	}

	for k, vals := range shared.SanitizeIncomingHeaderMap(req.Headers) {
		for _, v := range vals {
			httpReq.Header.Add(k, v)
		}
	}
	httpReq.Host = hostPort
	httpReq.Header.Set("Host", hostPort)

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
