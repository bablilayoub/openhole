package protocol

import (
	"fmt"
	"strings"
)

const (
	MaxHeaderCount        = 100
	MaxHeaderValuesPerKey = 10
	MaxHeaderValueLen     = 8192
	MaxIDLen              = 128
	MaxMessageLen         = 1024
	MaxPathLen            = 8192
	MaxBodyBase64Len      = 14 * 1024 * 1024
)

func validateHeaders(headers map[string][]string) error {
	if len(headers) > MaxHeaderCount {
		return fmt.Errorf("too many headers")
	}
	for k, vals := range headers {
		if len(k) > MaxHeaderValueLen {
			return fmt.Errorf("header name too long")
		}
		if len(vals) > MaxHeaderValuesPerKey {
			return fmt.Errorf("too many values for header %q", k)
		}
		for _, v := range vals {
			if len(v) > MaxHeaderValueLen {
				return fmt.Errorf("header value too long")
			}
			if strings.ContainsAny(v, "\r\n\x00") {
				return fmt.Errorf("invalid header value")
			}
		}
	}
	return nil
}

func validateStringField(name, value string, max int) error {
	if len(value) > max {
		return fmt.Errorf("%s too long", name)
	}
	return nil
}

func ValidateRegister(m *RegisterMessage) error {
	if err := validateStringField("client_id", m.ClientID, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("requested_subdomain", m.RequestedSubdomain, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("reclaim_token", m.ReclaimToken, MaxIDLen*2); err != nil {
		return err
	}
	if err := validateStringField("local_host", m.LocalHost, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("version", m.Version, MaxIDLen); err != nil {
		return err
	}
	return nil
}

func ValidateRequest(m *RequestMessage) error {
	if err := validateStringField("request_id", m.RequestID, MaxIDLen); err != nil {
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
	if strings.ContainsAny(m.Query, "\r\n\x00") {
		return fmt.Errorf("invalid query")
	}
	if err := validateStringField("body_base64", m.BodyBase64, MaxBodyBase64Len); err != nil {
		return err
	}
	return validateHeaders(m.Headers)
}

func ValidateResponse(m *ResponseMessage) error {
	if err := validateStringField("request_id", m.RequestID, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("body_base64", m.BodyBase64, MaxBodyBase64Len); err != nil {
		return err
	}
	return validateHeaders(m.Headers)
}

func ValidateRegistered(m *RegisteredMessage) error {
	if err := validateStringField("tunnel_id", m.TunnelID, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("subdomain", m.Subdomain, MaxIDLen); err != nil {
		return err
	}
	if err := validateStringField("public_url", m.PublicURL, MaxPathLen); err != nil {
		return err
	}
	if m.ReclaimToken == "" {
		return nil
	}
	if len(m.ReclaimToken) != 64 {
		return fmt.Errorf("reclaim_token invalid length")
	}
	for _, c := range m.ReclaimToken {
		if (c < '0' || c > '9') && (c < 'a' || c > 'f') {
			return fmt.Errorf("reclaim_token invalid format")
		}
	}
	return nil
}

func ValidateError(m *ErrorMessage) error {
	if err := validateStringField("request_id", m.RequestID, MaxIDLen); err != nil {
		return err
	}
	return validateStringField("message", m.Message, MaxMessageLen)
}
