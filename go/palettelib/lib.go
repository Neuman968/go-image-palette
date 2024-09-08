package palettelib

import (
	"bytes"
	"encoding/json"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"math"
	"os"
	"sort"
)

const LIGHT_THRESHOLD = .40

// Contains a reference to the RGBA image content as well as the number of times it occurs.
type ColorStruct struct {
	color    color.Color
	rgba     color.RGBA
	category string
	R        uint8
	G        uint8
	B        uint8
	A        uint8
	Count    int
}

func (s ColorStruct) isWhite() bool {
	return s.R == 255 && s.G == 255 && s.B == 255
}

type ColorStructAndDist struct {
	colorStruct ColorStruct
	distance    float64
}

type ResultColors struct {
	Primary ColorStruct

	Secondary ColorStruct

	Tertiary ColorStruct

	Fourth ColorStruct

	Fifth ColorStruct

	TopColors []ColorStruct
}

// Points are used as coordinates to determine the color category.
var colorPoints = map[string][]color.RGBA{
	Colors.Red: {
		color.RGBA{R: 234, G: 50, B: 35}, // red
		// color.RGBA{R: 127, G: 23, B: 14}, // dark red
		// color.RGBA{R: 96, G: 16, B: 33},  // maroon
	},
	Colors.Green: {
		color.RGBA{R: 77, G: 169, B: 58},   // green
		color.RGBA{R: 166, G: 242, B: 139}, // light green
		color.RGBA{R: 157, G: 246, B: 80},  // lime green
		color.RGBA{R: 115, G: 246, B: 79},  // Bright Green
		// color.RGBA{R: 27, G: 68, B: 22},    // Forest Green
		color.RGBA{R: 206, G: 249, B: 188}, // Pale Green
		color.RGBA{R: 106, G: 119, B: 36},  // Olive Green
		color.RGBA{R: 119, G: 245, B: 169}, // Sea Green
		color.RGBA{R: 183, G: 247, B: 94},  // Lime
		color.RGBA{R: 64, G: 71, B: 47},
	},
	Colors.Blue: {
		color.RGBA{R: 0, G: 30, B: 245},    // blue
		color.RGBA{R: 156, G: 209, B: 248}, // light blue
		color.RGBA{R: 63, G: 144, B: 134},  // teal
		color.RGBA{R: 126, G: 189, B: 247}, // sky blue
		color.RGBA{R: 86, G: 190, B: 173},  // Turquoise
		color.RGBA{R: 1, G: 17, B: 87},     // dark blue
		color.RGBA{R: 115, G: 251, B: 253}, // cyan
		color.RGBA{R: 105, G: 229, B: 203}, // aqua
		color.RGBA{R: 17, G: 20, B: 40},
		color.RGBA{R: 75, G: 119, B: 209},
		color.RGBA{R: 109, G: 147, B: 230},
		color.RGBA{R: 161, G: 178, B: 214},
	},
	Colors.Yellow: {
		color.RGBA{R: 255, G: 253, B: 84}, // yellow
		color.RGBA{R: 204, G: 176, B: 59}, // mustard
		color.RGBA{R: 249, G: 215, B: 73}, // gold
	},
	Colors.Orange: {
		color.RGBA{R: 255, G: 165, B: 0},  // orange
		color.RGBA{R: 240, G: 145, B: 53}, // dark orange
		color.RGBA{R: 235, G: 172, B: 108},
	},
	Colors.Purple: {
		color.RGBA{R: 177, G: 25, B: 124},  // purple
		color.RGBA{R: 184, G: 131, B: 239}, // light purple
		color.RGBA{R: 145, G: 65, B: 225},  // violet
		color.RGBA{R: 195, G: 166, B: 234}, // Lavendar
		color.RGBA{R: 50, G: 16, B: 60},    // dark purple
		color.RGBA{R: 139, G: 139, B: 246}, // Periwinkle
		color.RGBA{R: 108, G: 97, B: 120},
		color.RGBA{R: 170, G: 150, B: 164},
		color.RGBA{R: 122, G: 108, B: 131},
		color.RGBA{R: 135, G: 119, B: 141},
	},
	Colors.Black: {
		color.RGBA{R: 0, G: 0, B: 0},
		color.RGBA{R: 26, G: 19, B: 17},
	},
	Colors.White: {color.RGBA{R: 255, G: 255, B: 255}},
	Colors.Brown: {
		// color.RGBA{R: 98, G: 56, B: 16},    // brown
		color.RGBA{R: 206, G: 177, B: 120}, // tan
		color.RGBA{R: 229, G: 217, B: 172}, // Beige
		color.RGBA{R: 169, G: 129, B: 87},  // light brown
	},
	Colors.Gray: {
		// color.RGBA{R: 147, G: 149, B: 145},
		color.RGBA{R: 128, G: 128, B: 128}, // dark gray
		color.RGBA{R: 211, G: 211, B: 211}, // light gray
		color.RGBA{R: 169, G: 169, B: 169}, // gray
	},
	Colors.Pink: {
		color.RGBA{R: 239, G: 139, B: 189}, // pink
		color.RGBA{R: 169, G: 117, B: 129}, // Mauve
		color.RGBA{R: 239, G: 128, B: 113}, // salmon
		color.RGBA{R: 234, G: 61, B: 138},  // hot pint
		color.RGBA{R: 193, G: 78, B: 107},  // dark pink
		color.RGBA{R: 248, G: 212, B: 223}, // light pink
	},
}

var Colors = newColorRegistry()

func newColorRegistry() *colorRegistry {
	return &colorRegistry{
		Red:     "red",
		Green:   "green",
		Blue:    "blue",
		White:   "white",
		Gray:    "gray",
		Yellow:  "yellow",
		Purple:  "purple",
		Orange:  "orange",
		Brown:   "brown",
		Pink:    "pink",
		Unknown: "unknown",
	}
}

type colorRegistry struct {
	Red     string
	Green   string
	Blue    string
	Black   string
	White   string
	Gray    string
	Yellow  string
	Purple  string
	Orange  string
	Brown   string
	Pink    string
	Unknown string
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

// Calculates the average distance between unique colors in the image.
func getAverageColorDistance(colorMap *map[color.Color]ColorStruct) float64 {
	var total float64
	var count float64

	var prev color.Color

	for key := range *colorMap {
		if prev != nil {
			total += getRgbDistance(color.RGBAModel.Convert(key).(color.RGBA), color.RGBAModel.Convert(prev).(color.RGBA))
			count++
		}
		prev = key
	}

	return total / count
}

func getColorMap(imgData *image.Image) (*map[color.Color]ColorStruct, *ColorStruct) {

	var largest ColorStruct

	var colorMap = make(map[color.Color]ColorStruct)

	for y := (*imgData).Bounds().Min.Y; y < (*imgData).Bounds().Max.Y; y += 1 {
		for x := (*imgData).Bounds().Min.X; x < (*imgData).Bounds().Max.X; x += 1 {

			colr := (*imgData).At(x, y)
			colorStruct, present := colorMap[colr]
			if present {
				colorStruct.Count = colorStruct.Count + 1
			} else {
				colorStruct = toColorStruct(colr)
				colorStruct.category = ColorCategory(colorStruct.rgba)
				colorStruct.rgba = color.RGBAModel.Convert(colr).(color.RGBA)
				colorStruct.R = colorStruct.rgba.R
				colorStruct.G = colorStruct.rgba.G
				colorStruct.B = colorStruct.rgba.B
				colorStruct.A = colorStruct.rgba.A
			}
			if colorStruct.Count > largest.Count && !colorStruct.isWhite() {
				largest = colorStruct
			}

			colorMap[colr] = colorStruct
		}
	}
	return &colorMap, &largest
}

func GetJsonForImage(imgData *image.Image, numberOfColors int, numberOfTopDistincts int) string {

	colorMap, largest := getColorMap(imgData)

	result := &ResultColors{
		Primary: *largest,
	}

	averageColorDistance := getAverageColorDistance(colorMap)

	result.Secondary = getAccent(*largest, averageColorDistance, colorMap)
	result.Tertiary = getAccent(result.Secondary, averageColorDistance, colorMap)
	result.Fourth = getAccent(result.Tertiary, averageColorDistance, colorMap)
	result.Fifth = getAccent(result.Fourth, averageColorDistance, colorMap)

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

func getLightness(rgba color.RGBA) float64 {
	max := math.Max(float64(rgba.R), math.Max(float64(rgba.G), float64(rgba.B)))
	min := math.Min(float64(rgba.R), math.Min(float64(rgba.G), float64(rgba.B)))
	return (0.5 * (max + min)) / 255
}

func getAccent(previousColorStruct ColorStruct,
	averageDistance float64,
	colorMap *map[color.Color]ColorStruct) ColorStruct {
	var secondary ColorStruct
	for _, value := range *colorMap {
		if value.Count > secondary.Count &&
			value.Count < previousColorStruct.Count &&
			getRgbDistance(value.rgba, previousColorStruct.rgba) > averageDistance {
			secondary = value
		}
	}

	if (secondary == ColorStruct{}) {
		secondary = previousColorStruct
	}

	return secondary
}

func getSortedDict(category string, colorMap map[color.Color]ColorStruct) []ColorStruct {
	var sortedColor []ColorStruct
	for _, value := range colorMap {
		if value.category == category {
			sortedColor = append(sortedColor, value)
		}
	}
	sort.Slice(sortedColor, func(i, j int) bool {
		return sortedColor[i].Count > sortedColor[j].Count
	})
	return sortedColor
}

func getResultSlice(colors []ColorStruct, size int) []ColorStruct {
	safeLength := size
	if len(colors) < size {
		safeLength = len(colors)
	}
	return colors[0:safeLength]
}

func toColorStruct(colorVal color.Color) ColorStruct {
	colorStruct := new(ColorStruct)
	colorStruct.color = colorVal
	colorStruct.Count = 0
	return *colorStruct
}

func ColorCategory(color color.RGBA) string {
	var lowestCat = Colors.Red
	var shortestDistance = float64(-1)

	for key, value := range colorPoints {
		for _, subColor := range value {
			dist := getRgbDistance(subColor, color)
			if shortestDistance == -1 || dist < shortestDistance {
				lowestCat = key
				shortestDistance = dist
			}
		}
	}
	return lowestCat
}

// Calculate the distance between two colors as if they were points in a 3D space.
func getRgbDistance(rgb1, rgb2 color.RGBA) float64 {
	return math.Sqrt(math.Pow(float64(rgb2.R)-float64(rgb1.R), 2) +
		math.Pow(float64(rgb2.G)-float64(rgb1.G), 2) + math.Pow(float64(rgb2.B)-float64(rgb1.B), 2))
}
