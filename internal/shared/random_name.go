package shared

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math/big"
)

var adjectives = []string{
	"blue", "silent", "fast", "red", "clean", "bright", "calm", "bold",
	"swift", "cool", "warm", "dark", "light", "wild", "keen", "sharp",
	"quiet", "brave", "clear", "fresh", "grand", "happy", "iron", "jade",
}

var nouns = []string{
	"fox", "river", "panda", "moon", "lion", "hawk", "wolf", "bear",
	"oak", "star", "cloud", "stone", "wave", "peak", "lake", "fern",
	"gate", "port", "link", "node", "path", "dock", "bridge", "tunnel",
}

func RandomSubdomain() string {
	a := adjectives[cryptoRandInt(len(adjectives))]
	n := nouns[cryptoRandInt(len(nouns))]
	suffix := cryptoRandHex(2)
	return fmt.Sprintf("%s-%s-%s", a, n, suffix)
}

func cryptoRandInt(max int) int {
	n, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	if err != nil {
		return 0
	}
	return int(n.Int64())
}

func cryptoRandHex(bytes int) string {
	b := make([]byte, bytes)
	if _, err := rand.Read(b); err != nil {
		return "00"
	}
	return hex.EncodeToString(b)
}
