package palettelib

import (
	"fmt"
	"image/color"
	"testing"
)

var colorCategoryTests = []struct {
	in  color.RGBA
	out string
}{
	{color.RGBA{R: 255, G: 255, B: 255}, Colors.White},
	{color.RGBA{R: 0, G: 0, B: 0}, Colors.Black},
	{color.RGBA{R: 108, G: 97, B: 120}, Colors.Purple},
	{color.RGBA{R: 178, G: 199, B: 178}, Colors.Gray},
}

func TestColorCategory(t *testing.T) {
	for _, tt := range colorCategoryTests {
		t.Run(fmt.Sprintf("R: %d G: %d B: %d", tt.in.R, tt.in.G, tt.in.B), func(t *testing.T) {
			cat := ColorCategory(tt.in)
			if cat != tt.out {
				t.Errorf("got %q, want %q", cat, tt.out)
			}
		})
	}
}

var rgbToHSLTest = []struct {
	in  struct{ r, g, b uint8 }
	out struct{ h, s, l float64 }
}{
	{struct{ r, g, b uint8 }{r: 255, g: 255, b: 255}, struct{ h, s, l float64 }{0, 0, 1}},
	{struct{ r, g, b uint8 }{r: 36, g: 20, b: 250}, struct{ h, s, l float64 }{h: 244.174000, s: 0.958000, l: 0.529000}},
	{struct{ r, g, b uint8 }{r: 120, g: 10, b: 55}, struct{ h, s, l float64 }{h: 335.45500, s: 0.846, l: 0.255000}},
	{struct{ r, g, b uint8 }{r: 60, g: 113, b: 209}, struct{ h, s, l float64 }{h: 218.65800, s: 0.618, l: 0.527}},
}

func TestHSLConversion(t *testing.T) {
	for _, tt := range rgbToHSLTest {
		t.Run(fmt.Sprintf("R: %d G: %d B: %d", tt.in.r, tt.in.g, tt.in.b), func(t *testing.T) {
			h, s, l := GetHSL(tt.in.r, tt.in.g, tt.in.b)
			if h != tt.out.h || s != tt.out.s || l != tt.out.l {
				t.Errorf("%v %v %v", h != tt.out.h, s != tt.out.s, l != tt.out.l)
				t.Errorf("got %f %f %f, want %f %f %f", h, s, l, tt.out.h, tt.out.s, tt.out.l)
			}
		})
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
