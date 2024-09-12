package palettelib

import (
	"bytes"
	"cmp"
	"encoding/json"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"math"
	"os"
	"slices"
)

const (
	hueThreshold        = 3.0
	saturationThreshold = 0.4
	luminanceThreshold  = 0.2
)

const numberOfColors = 15

// Contains a reference to the RGBA image content as well as the number of times it occurs.
type ColorStruct struct {
	color color.Color
	rgba  color.RGBA

	R uint8
	G uint8
	B uint8
	A uint8

	H float64
	S float64
	L float64

	Count int
}

type ColorStats struct {
	colorMap map[color.Color]ColorStruct

	largest *ColorStruct

	averageColorDistance float64

	averageHue float64

	averageLuminance float64

	averageSaturation float64

	totalPixels int
}

type ResultColors struct {
	Primary ColorStruct

	Secondary ColorStruct

	Tertiary ColorStruct

	Fourth ColorStruct

	Fifth ColorStruct

	PrimarySimilar []ColorStruct

	SecondarySimilar []ColorStruct

	TertiarySimilar []ColorStruct

	FourthSimilar []ColorStruct

	FifthSimilar []ColorStruct
}

func GetImageFromFile(imgFileName *string) (*image.Image, error) {
	imgFile, err := os.Open(*imgFileName)
	if err != nil {
		return nil, err
	}
	imgData, _, err := image.Decode(imgFile)
	if err != nil {
		return nil, err
	}
	return &imgData, nil
}

func GetJsonImageForBytes(imgByte []byte, numberOfColors int, numberOfTopDistincts int) string {
	img, _, err := image.Decode(bytes.NewReader(imgByte))
	if err != nil {
		log.Fatal(err)
	}
	return GetJsonForImage(&img, numberOfColors, numberOfTopDistincts)
}

func getColorMap(imgData *image.Image) ColorStats {

	var largest ColorStruct

	var colorMap = make(map[color.Color]ColorStruct)

	var totalDistance float64

	var totalPixels int

	var totalHue float64

	var totalSaturation float64

	var totalLuminance float64

	for y := (*imgData).Bounds().Min.Y; y < (*imgData).Bounds().Max.Y; y += 1 {
		for x := (*imgData).Bounds().Min.X; x < (*imgData).Bounds().Max.X; x += 1 {

			colr := (*imgData).At(x, y)
			colorStruct, present := colorMap[colr]
			if present {
				colorStruct.Count = colorStruct.Count + 1
			} else {
				colorStruct = newColorStruct(colr)
				totalDistance += getRgbDistance(colorStruct.rgba, color.RGBA{R: 255 / 2, G: 255 / 2, B: 255 / 2})

				totalHue += colorStruct.H
				totalSaturation += colorStruct.S
				totalLuminance += colorStruct.L
			}

			if colorStruct.Count > largest.Count {
				largest = colorStruct
			}

			colorMap[colr] = colorStruct
			totalPixels++
		}
	}

	return ColorStats{
		colorMap:             colorMap,
		largest:              &largest,
		averageColorDistance: totalDistance / float64(len(colorMap)),
		averageHue:           totalHue / float64(len(colorMap)),
		averageSaturation:    totalSaturation / float64(len(colorMap)),
		averageLuminance:     totalLuminance / float64(len(colorMap)),
		totalPixels:          totalPixels,
	}
}

func GetImagePalette(imgData *image.Image) *ResultColors {
	stats := getColorMap(imgData)

	largest := stats.largest

	result := &ResultColors{
		Primary: *largest,
	}

	sortedColors := make([]ColorStruct, 0, len(stats.colorMap))
	for _, value := range stats.colorMap {
		sortedColors = append(sortedColors, value)
	}

	slices.SortFunc(sortedColors, func(i, j ColorStruct) int {
		return cmp.Or(
			cmp.Compare(i.Count, j.Count),
			cmp.Compare(i.H, j.H),
		)
	})

	result.Primary = getAccent(&sortedColors, []ColorStruct{}, &stats)
	result.Secondary = getAccent(&sortedColors, []ColorStruct{result.Primary}, &stats)
	result.Tertiary = getAccent(&sortedColors, []ColorStruct{result.Primary, result.Secondary}, &stats)
	result.Fourth = getAccent(&sortedColors, []ColorStruct{result.Primary, result.Secondary, result.Tertiary}, &stats)
	result.Fifth = getAccent(&sortedColors, []ColorStruct{result.Primary, result.Secondary, result.Tertiary, result.Fourth}, &stats)

	colorChannel := make(chan []ColorStruct, 5)

	slices.Reverse(sortedColors)

	go GetSimilarColors(result.Primary, sortedColors, &stats, 10, colorChannel)
	go GetSimilarColors(result.Secondary, sortedColors, &stats, 10, colorChannel)
	go GetSimilarColors(result.Tertiary, sortedColors, &stats, 10, colorChannel)
	go GetSimilarColors(result.Fourth, sortedColors, &stats, 10, colorChannel)
	go GetSimilarColors(result.Fifth, sortedColors, &stats, 10, colorChannel)

	result.PrimarySimilar = <-colorChannel
	result.SecondarySimilar = <-colorChannel
	result.TertiarySimilar = <-colorChannel
	result.FourthSimilar = <-colorChannel
	result.FifthSimilar = <-colorChannel

	return result
}

func GetSimilarColors(color ColorStruct, colors []ColorStruct, colorStats *ColorStats, size int, c chan<- []ColorStruct) {

	var similarColors []ColorStruct

	for _, value := range colors {
		if (value.H > color.H-hueThreshold && value.H < color.H+hueThreshold) &&
			(value.S > color.S-saturationThreshold && value.S < color.S+saturationThreshold) &&
			(value.L > color.L-luminanceThreshold && value.L < color.L+luminanceThreshold) {
			similarColors = append(similarColors, value)
		}
		if len(similarColors) >= numberOfColors {
			break
		}
	}

	c <- similarColors
}

func getAccent(colors *[]ColorStruct, otherColors []ColorStruct, colorStats *ColorStats) ColorStruct {

	var paletteColor ColorStruct

	for _, value := range *colors {
		// Compare the current value and see if it is a better candidate.

		if paletteColor == (ColorStruct{}) {
			paletteColor = value
			continue
		}

		scorePrevious := getScore(paletteColor, otherColors, colorStats)
		scoreCurrent := getScore(value, otherColors, colorStats)

		if scoreCurrent >= scorePrevious ||
			(scorePrevious == scoreCurrent && value.Count > paletteColor.Count) {
			paletteColor = value
		}
	}

	if (paletteColor == ColorStruct{} && len(otherColors) > 0) {
		paletteColor = (otherColors)[0]
	}

	return paletteColor
}

func getScore(colorStruct ColorStruct, otherColors []ColorStruct, colorStats *ColorStats) (score int) {
	score += addScore(isDistanceThresholdFromColors(colorStruct, &otherColors, colorStats.averageColorDistance), 2)
	score += addScore(isAlreadyUsed(colorStruct, otherColors), -1)
	score += addScore(getRgbDistance(colorStruct.rgba, color.RGBA{R: 255, G: 255, B: 255}) < colorStats.averageColorDistance, -1)
	score += addScore(getRgbDistance(colorStruct.rgba, color.RGBA{R: 0, G: 0, B: 0}) < colorStats.averageColorDistance, -1)
	score += addScore((float64(colorStruct.Count)/float64(colorStats.totalPixels) < 0.20), -1)
	return
}

func isAlreadyUsed(colorStruct ColorStruct, otherColors []ColorStruct) bool {
	for _, value := range otherColors {
		if value.rgba == colorStruct.rgba {
			return true
		}
	}
	return false
}

func addScore(isTrue bool, score int) int {
	if isTrue {
		return score
	}
	return 0
}

func GetJsonForImage(imgData *image.Image, numberOfColors int, numberOfTopDistincts int) string {

	result := GetImagePalette(imgData)

	binary, _ := json.Marshal(result)
	// // todo handle json marshal error.
	return string(binary)
}

/*
M = max{R, G, B}
m = min{R, G, B}
d = (M - m)/255.

The lightness, L, of a color is given by the equation

L = [½(M + m)]/255 = (M + m)/510.

https://www.had2know.org/technology/hsl-rgb-color-converter.html
© 2010-2023 had2know.org
*/

func GetHSL(r, g, b uint8) (float64, float64, float64) {
	rPercent := float64(r) / 255
	gPercent := float64(g) / 255
	bPercent := float64(b) / 255

	max, min := math.Max(math.Max(rPercent, gPercent), bPercent), math.Min(math.Min(rPercent, gPercent), bPercent)
	delta := max - min

	var h, s, l float64

	// Lightness calculation:
	l = (max + min) / 2
	// Hue and Saturation Calculation:
	if delta == 0 {
		h = 0
		s = 0
	} else {
		switch max {
		case rPercent:
			h = 60 * (math.Mod((gPercent-bPercent)/delta, 6))
		case gPercent:
			h = 60 * (((bPercent - rPercent) / delta) + 2)
		case bPercent:
			h = 60 * (((rPercent - gPercent) / delta) + 4)
		}
		if h < 0 {
			h += 360
		}

		s = delta / (1 - math.Abs((2*l)-1))
	}

	return (math.Round(h*1000) / 1000), (math.Round(s*1000) / 1000), (math.Round(l*1000) / 1000)
}

func isDistanceThresholdFromColors(color ColorStruct, previousColors *[]ColorStruct,
	averageDistance float64) bool {
	for _, value := range *previousColors {
		if getRgbDistance(value.rgba, color.rgba) <= averageDistance {
			return false
		}
	}
	return true
}

func newColorStruct(colorVal color.Color) ColorStruct {
	colorStruct := ColorStruct{}
	colorStruct.color = colorVal
	colorStruct.Count = 1

	colorStruct.rgba = color.RGBAModel.Convert(colorVal).(color.RGBA)
	colorStruct.R = colorStruct.rgba.R
	colorStruct.G = colorStruct.rgba.G
	colorStruct.B = colorStruct.rgba.B
	colorStruct.A = colorStruct.rgba.A

	h, s, l := GetHSL(colorStruct.R, colorStruct.G, colorStruct.B)

	colorStruct.H = h
	colorStruct.S = s
	colorStruct.L = l

	return colorStruct
}

// Calculate the distance between two colors as if they were points in a 3D space.
func getRgbDistance(rgb1, rgb2 color.RGBA) float64 {
	return math.Sqrt(math.Pow(float64(rgb2.R)-float64(rgb1.R), 2) +
		math.Pow(float64(rgb2.G)-float64(rgb1.G), 2) + math.Pow(float64(rgb2.B)-float64(rgb1.B), 2))
}
