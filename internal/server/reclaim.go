package server

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

func newReclaimToken() (plain string, hash string, err error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", "", fmt.Errorf("generate reclaim token: %w", err)
	}
	plain = hex.EncodeToString(b)
	hash = hashReclaimToken(plain)
	return plain, hash, nil
}

func hashReclaimToken(plain string) string {
	sum := sha256.Sum256([]byte(plain))
	return hex.EncodeToString(sum[:])
}

func reclaimTokenValid(plain, hash string) bool {
	return plain != "" && hash != "" && hashReclaimToken(plain) == hash
}

func canReclaimHold(hold holdEntry, clientIP, reclaimToken string) bool {
	if reclaimTokenValid(reclaimToken, hold.tokenHash) {
		return true
	}
	if clientIP != "" && hold.clientIP == clientIP {
		return true
	}
	return false
}
