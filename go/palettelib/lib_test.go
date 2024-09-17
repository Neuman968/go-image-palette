package palettelib

import (
	"fmt"
	"image/color"
	"testing"
)

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
			h, s, l := HSL(tt.in.r, tt.in.g, tt.in.b)
			if h != tt.out.h || s != tt.out.s || l != tt.out.l {
				// t.Errorf("%v %v %v", h != tt.out.h, s != tt.out.s, l != tt.out.l)
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
	result := RGBDistance(p1, p2)
	resultStr := fmt.Sprint(result)
	expectStr := fmt.Sprint(10.246950765959598)
	if resultStr != expectStr {
		t.Errorf("Distance was not correct, was %s %s", resultStr, expectStr)
	}
}

var testImagePaletteTest = []struct {
	in  string
	out ResultColors
}{
	{"../test-images/picpalette-logo2.png",
		ResultColors{
			Primary:   ColorStruct{R: 188, G: 178, B: 180, A: 255, H: 348, S: 0.069, L: 0.718, Count: 27743},
			Secondary: ColorStruct{R: 104, G: 5, B: 249, A: 255, H: 264.344, S: 0.961, L: 0.498, Count: 48},
			Tertiary:  ColorStruct{R: 9, G: 199, B: 244, A: 255, H: 191.489, S: 0.929, L: 0.496, Count: 48},
			Fourth:    ColorStruct{R: 254, G: 1, B: 115, A: 255, H: 332.964, S: 0.992, L: 0.5, Count: 43},
			Fifth:     ColorStruct{R: 0, G: 0, B: 0, A: 0, H: 0, S: 0, L: 0, Count: 6402},
		}},
}

func Test_ImagePaletteTable(t *testing.T) {
	for _, tt := range testImagePaletteTest {
		t.Run(tt.in, func(t *testing.T) {
			imageData, err := ImageFromFile(&tt.in)
			if err != nil {
				t.Errorf("Error loading image %s", err)
			}
			result := ImagePalette(imageData)
			colorStructAssert(t, result.Primary, tt.out.Primary)
			colorStructAssert(t, result.Secondary, tt.out.Secondary)
			colorStructAssert(t, result.Tertiary, tt.out.Tertiary)
			colorStructAssert(t, result.Fourth, tt.out.Fourth)
			colorStructAssert(t, result.Fifth, tt.out.Fifth)
		})
	}
}

func colorStructAssert(t *testing.T, result ColorStruct, expected ColorStruct) {
	if result.R != expected.R || result.G != expected.G || result.B != expected.B || result.A != expected.A || result.H != expected.H || result.S != expected.S || result.L != expected.L || result.Count != expected.Count {
		t.Errorf("Color was not correct. Expected: %v Was: %v", expected, result)
	}
}

// func Test_ImagePalette(t *testing.T) {

// 	fileName := "../test-images/picpalette-logo2.png"

// 	imageData, err := GetImageFromFile(&fileName)

// 	if err != nil {
// 		t.Errorf("Error loading image %s", err)
// 	}

// 	result := GetImagePalette(imageData)

// 	if result.Primary.R != 188 && result.Primary.G != 178 && result.Primary.B != 180 {
// 		t.Errorf("Primary color was not correct, was %v", result.Primary)
// 	}

// 	if result.Secondary.R != 0 && result.Secondary.G != 0 && result.Secondary.B != 0 {
// 		t.Errorf("Secondary color was not correct, was %v", result.Secondary)
// 	}

// 	if result.Tertiary.R != 99 && result.Tertiary.G != 5 && result.Tertiary.B != 249 {
// 		t.Errorf("Tertiary color was not correct, was %v", result.Tertiary)
// 	}

// 	if result.Fourth.R != 9 && result.Fourth.G != 199 && result.Fourth.B != 244 {
// 		t.Errorf("Fourth color was not correct, was %v", result.Fourth)
// 	}

// 	if result.Fifth.R != 253 && result.Fifth.G != 2 && result.Fifth.B != 180 {
// 		t.Errorf("Fifth color was not correct, was %v", result.Fifth)
// 	}
// }
