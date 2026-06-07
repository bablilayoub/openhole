package shared

import (
	"fmt"
	"math/rand"
)

var adjectives = []string{
	"blue", "silent", "fast", "red", "clean", "bright", "calm", "bold",
	"swift", "cool", "warm", "dark", "light", "wild", "keen", "sharp",
}

var nouns = []string{
	"fox", "river", "panda", "moon", "lion", "hawk", "wolf", "bear",
	"oak", "star", "cloud", "stone", "wave", "peak", "lake", "fern",
}

func RandomSubdomain() string {
	a := adjectives[rand.Intn(len(adjectives))]
	n := nouns[rand.Intn(len(nouns))]
	return fmt.Sprintf("%s-%s", a, n)
}
