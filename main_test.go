package main

import (
	"fmt"
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

func Test_ColorCategory_ExpectingBlackReturned(t *testing.T) {
	rgba := color.RGBA{R: 0, G: 0, B: 0}
	result := ColorCategory(rgba)
	// category
	if result != 3 {
		t.Errorf("Output is not equal to pink, was %d", result)
	}
}

func Test_testRGBDistance_Expecting3dPointDistance(t *testing.T) {
	//7,4,3
	// 17,6,2
	// 10.246951
	p1 := color.RGBA{R: 7, G: 4, B: 3}
	p2 := color.RGBA{R: 17, G: 6, B: 2}
	result := getRgbDistance(p1, p2)
	resultStr := fmt.Sprint(result)
	expectStr := fmt.Sprint(10.246950765959598)
	if resultStr != expectStr {
		t.Errorf("Distance was not correct, was %s %s", resultStr, expectStr)
	}
}
