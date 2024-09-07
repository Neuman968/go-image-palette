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
	if result != Colors.Purple {
		t.Errorf("Output is not equal to purple, was %s", result)
	}
}

func Test_ColorCategory_ExpectingGrayReturned(t *testing.T) {
	rgba := color.RGBA{R: 178, G: 199, B: 178}
	result := ColorCategory(rgba)
	// category
	if result != Colors.Gray {
		t.Errorf("Output is not equal to Gray, was %s", result)
	}
}

func Test_ColorCategory_ExpectingBlackReturned(t *testing.T) {
	rgba := color.RGBA{R: 0, G: 0, B: 0}
	result := ColorCategory(rgba)
	// category
	if result != Colors.Black {
		t.Errorf("Output is not equal to pink, was %s", result)
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

func Test_testRgbLightness_passingRgbValue_expectingLightValue(t *testing.T) {
	result := getLightness(color.RGBA{R: 255, G: 255, B: 255})
	expected := fmt.Sprint(1)
	actual := fmt.Sprint(result)
	if actual != expected {
		t.Errorf("Lightness was not correct expected: %s actual %s", expected, actual)
	}
}

func Test_testRgbLightness_passingMediumValue(t *testing.T) {
	result := getLightness(color.RGBA{R: 253, G: 254, B: 139})
	expected := fmt.Sprint(0.7705882352941177)
	actual := fmt.Sprint(result)
	if actual != expected {
		t.Errorf("Expected: %s actual: %s", expected, actual)
	}
}

func Test_testRgbLightness_passingLightValue(t *testing.T) {
	result := getLightness(color.RGBA{R: 229, G: 234, B: 241})
	expected := fmt.Sprint(0.9215686274509803)
	actual := fmt.Sprint(result)
	if actual != expected {
		t.Errorf("Expected: %s actual: %s", expected, actual)
	}
}

func Test_testRgbLightness_passingDarkValue(t *testing.T) {
	result := getLightness(color.RGBA{R: 36, G: 48, B: 52})
	expected := fmt.Sprint(0.17254901960784313)
	actual := fmt.Sprint(result)
	if actual != expected {
		t.Errorf("Expected: %s actual: %s", expected, actual)
	}
}
