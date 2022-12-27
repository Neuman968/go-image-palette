package main

import (
	"image/color"
	"testing"
)

func Test_ColorCategory_ExpectingPurpleReturned(t *testing.T) {
	rgba := color.RGBA{R: 108, G: 97, B: 120}
	result := ColorCategory(rgba)
	// category
	if result != 8 {
		t.Errorf("Output is not equal to pink, was %d", result)
	}
}
