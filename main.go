package main

import (
	_ "encoding/json"
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"math"
	"os"
	"sort"
)

type HSL struct {
	H, S, L float64
}

// Contains a reference to the RGBA image content as well as the number of times it occurs.
//
type ColorCount struct {
	color    color.Color
	rgba     color.RGBA
	hsl      HSL
	count    int
	category int
}

type TopColors struct {
	red    []ColorCount
	green  []ColorCount
	blue   []ColorCount
	yellow []ColorCount
	orange []ColorCount
	purple []ColorCount
	black  []ColorCount
	white  []ColorCount
	brown  []ColorCount
	gray   []ColorCount
	pink   []ColorCount
}

// sRGB values.
// var colorPoints = map[int]color.RGBA{
// 	red:    color.RGBA{R: 254, G: 0, B: 0, A: 0},
// 	green:  color.RGBA{R: 0, G: 128, B: 2},
// 	blue:   color.RGBA{R: 19, G: 0, B: 255},
// 	yellow: color.RGBA{R: 0, G: 254, B: 254},
// 	orange: color.RGBA{R: 255, G: 165, B: 0},
// 	purple: color.RGBA{R: 128, G: 0, B: 128},
// 	black:  color.RGBA{R: 0, G: 0, B: 0},
// 	white:  color.RGBA{R: 255, G: 255, B: 255},
// 	brown:  color.RGBA{R: 165, G: 42, B: 42},
// 	gray:   color.RGBA{R: 128, G: 128, B: 128},
// 	pink:   color.RGBA{R: 0, G: 128, B: 2},
// }

// Display native values..
var colorPoints = map[int]color.RGBA{
	red:    color.RGBA{R: 234, G: 50, B: 35},
	green:  color.RGBA{R: 55, G: 125, B: 34},
	blue:   color.RGBA{R: 0, G: 30, B: 245},
	yellow: color.RGBA{R: 255, G: 253, B: 84},
	orange: color.RGBA{R: 255, G: 165, B: 0},
	purple: color.RGBA{R: 177, G: 25, B: 124},
	black:  color.RGBA{R: 0, G: 0, B: 0},
	white:  color.RGBA{R: 255, G: 255, B: 255},
	brown:  color.RGBA{R: 152, G: 52, B: 48},
	gray:   color.RGBA{R: 128, G: 128, B: 128},
	pink:   color.RGBA{R: 245, G: 194, B: 203},
}

var colorMap = make(map[int]map[color.Color]ColorCount)

// color categories as defined by me.
const (
	red    int = 0
	green      = 1
	blue       = 2
	black      = 3
	white      = 4
	gray       = 5
	yellow     = 6
	purple     = 8
	orange     = 9
	brown      = 10
	pink       = 11
)

func main() {
	// fmt.Println("Hello World!")
	// imgFile, err := os.Open("./red-f44242.png")
	imgFile, err := os.Open("./test-image.jpeg")
	if err != nil {
		log.Fatal(err)
	}
	imgData, _, err := image.Decode(imgFile)
	if err != nil {
		fmt.Println(err)
	}

	// colorMap := make(map[color.Color]ColorCount)
	colorMap[red] = make(map[color.Color]ColorCount)
	colorMap[green] = make(map[color.Color]ColorCount)
	colorMap[blue] = make(map[color.Color]ColorCount)
	colorMap[yellow] = make(map[color.Color]ColorCount)
	colorMap[orange] = make(map[color.Color]ColorCount)
	colorMap[purple] = make(map[color.Color]ColorCount)
	colorMap[black] = make(map[color.Color]ColorCount)
	colorMap[white] = make(map[color.Color]ColorCount)
	colorMap[brown] = make(map[color.Color]ColorCount)
	colorMap[gray] = make(map[color.Color]ColorCount)
	colorMap[pink] = make(map[color.Color]ColorCount)

	// Loop over image data.
	for y := imgData.Bounds().Min.Y; y < imgData.Bounds().Max.Y; y++ {
		for x := imgData.Bounds().Min.X; x < imgData.Bounds().Max.X; x++ {
			color := imgData.At(x, y)
			colorStruct := toColorStruct(color)
			value, present := colorMap[colorStruct.category][color]
			count := 1
			if present {
				count = value.count + 1
			}

			colorStruct.count = count
			colorMap[colorStruct.category][color] = colorStruct
		}
	}

	fmt.Printf("There are %d entries in the map", len(colorMap))

	// todo maybe do this in goroutines?
	printTop("red", getSortedDict(red))
	printTop("green", getSortedDict(green))
	printTop("blue", getSortedDict(blue))
	printTop("yellow", getSortedDict(yellow))
	printTop("orange", getSortedDict(orange))
	printTop("purple", getSortedDict(purple))
	printTop("black", getSortedDict(black))
	printTop("white", getSortedDict(white))
	printTop("brown", getSortedDict(brown))
	printTop("gray", getSortedDict(gray))
	printTop("pink", getSortedDict(pink))

	// sortedColors := make([]ColorCount, 0, len(colorMap))
	// for _, value := range colorMap {
	// 	sortedColors = append(sortedColors, value)
	// }

	// sort.Slice(sortedColors, func(i, j int) bool {
	// 	return sortedColors[i].count > sortedColors[j].count
	// })

	// // Print Top 10
	// for i := 0; i < 10; i++ {
	// 	fmt.Println("")
	// 	convertedColor := color.RGBAModel.Convert(sortedColors[i].color).(color.RGBA)
	// 	fmt.Printf("rgb(%d,%d,%d) a: %d appeared %d times %s",
	// 		convertedColor.R,
	// 		convertedColor.G,
	// 		convertedColor.B,
	// 		convertedColor.A,
	// 		sortedColors[i].count,
	// 		sortedColors[i].category)
	// }

}

func printTop(name string, dict []ColorCount) {
	limit := 10
	if len(dict) < limit {
		limit = len(dict)
	}
	fmt.Printf("Top %s colors size %d", name, len(dict))
	fmt.Println("")

	for i := 0; i < limit; i++ {
		fmt.Printf("rgb(%d,%d,%d) a: %d appeared %d times",
			dict[i].rgba.R,
			dict[i].rgba.G,
			dict[i].rgba.B,
			dict[i].rgba.A,
			dict[i].count)
		fmt.Println("")
	}
	fmt.Println("")
}

func getSortedDict(category int) []ColorCount {
	sortedColor := make([]ColorCount, 0, len(colorMap[category]))
	for _, value := range colorMap[category] {
		sortedColor = append(sortedColor, value)
	}
	sort.Slice(sortedColor, func(i, j int) bool {
		return sortedColor[i].count > sortedColor[j].count
	})
	return sortedColor
}

func toColorStruct(colorVal color.Color) ColorCount {
	colorStruct := new(ColorCount)
	colorStruct.color = colorVal
	colorStruct.count = 0
	colorStruct.rgba = color.RGBAModel.Convert(colorVal).(color.RGBA)
	colorStruct.hsl = ToHSL(float64(colorStruct.rgba.R), float64(colorStruct.rgba.G), float64(colorStruct.rgba.B))
	colorStruct.category = getColorCategory(colorStruct.rgba)
	return *colorStruct
}

func getColorCategory(color color.RGBA) int {
	var lowestCat = red
	var shortestDistance = float64(-1)
	for key, value := range colorPoints {
		dist := getRgbDistance(value, color)
		if shortestDistance == -1 || dist < shortestDistance {
			lowestCat = key
			shortestDistance = dist
		}
	}
	return lowestCat
}

func getRgbDistance(rgb1, rgb2 color.RGBA) float64 {
	return math.Sqrt(math.Pow(float64(rgb2.R)-float64(rgb1.R), 2) + math.Pow(float64(rgb2.G)-float64(rgb1.G), 2) + math.Pow(float64(rgb2.B)-float64(rgb1.B), 2))
}

/**
To HSL level from ...
*/
func ToHSL(r, g, b float64) HSL {
	var h, s, l float64

	max := math.Max(math.Max(r, g), b)
	min := math.Min(math.Min(r, g), b)

	// Luminosity is the average of the max and min rgb color intensities.
	l = (max + min) / 2

	// saturation
	delta := max - min
	if delta == 0 {
		// it's gray
		return HSL{0, 0, l}
	}

	// it's not gray
	if l < 0.5 {
		s = delta / (max + min)
	} else {
		s = delta / (2 - max - min)
	}

	// hue
	r2 := (((max - r) / 6) + (delta / 2)) / delta
	g2 := (((max - g) / 6) + (delta / 2)) / delta
	b2 := (((max - b) / 6) + (delta / 2)) / delta
	switch {
	case r == max:
		h = b2 - g2
	case g == max:
		h = (1.0 / 3.0) + r2 - b2
	case b == max:
		h = (2.0 / 3.0) + g2 - r2
	}

	// fix wraparounds
	switch {
	case h < 0:
		h += 1
	case h > 1:
		h -= 1
	}

	return HSL{h, s, l}
}
