package main

import (
	"encoding/json"
	"flag"
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

// Contains a reference to the RGBA image content as well as the number of times it occurs.
//
type ColorStruct struct {
	color    color.Color
	rgba     color.RGBA
	category int
	R        uint8
	G        uint8
	B        uint8
	A        uint8
	Count    int
}

type ColorStructAndDist struct {
	colorStruct ColorStruct
	distance    float64
}

type ResultColors struct {
	Red            []ColorStruct
	TopDistinctRed []ColorStruct

	Green            []ColorStruct
	TopDistinctGreen []ColorStruct

	Blue            []ColorStruct
	TopDistinctBlue []ColorStruct

	Yellow            []ColorStruct
	TopDistinctYellow []ColorStruct

	Orange            []ColorStruct
	TopDistinctOrange []ColorStruct

	Purple            []ColorStruct
	TopDistinctPurple []ColorStruct

	Black            []ColorStruct
	TopDistinctBlack []ColorStruct

	White            []ColorStruct
	TopDistinctWhite []ColorStruct

	Brown            []ColorStruct
	TopDistinctBrown []ColorStruct

	Gray            []ColorStruct
	TopDistinctGray []ColorStruct

	Pink            []ColorStruct
	TopDistinctPink []ColorStruct

	Primary ColorStruct

	Secondary ColorStruct
}

// Display native values..
var colorPoints = map[int][]color.RGBA{
	red: {
		color.RGBA{R: 234, G: 50, B: 35}, // red
		// color.RGBA{R: 127, G: 23, B: 14}, // dark red
		// color.RGBA{R: 96, G: 16, B: 33},  // maroon
	},
	green: {
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
	blue: {
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
		// color.RGBA{R: 1, G: 38, B: 163},    // Royal Blue
		// color.RGBA{R: 3, G: 22, B: 67},     // Navy Blue
		// color.RGBA{R: 52, G: 28, B: 125}, // Indigo
	},
	yellow: {
		color.RGBA{R: 255, G: 253, B: 84}, // yellow
		color.RGBA{R: 204, G: 176, B: 59}, // mustard
		color.RGBA{R: 249, G: 215, B: 73}, // gold
	},
	orange: {
		color.RGBA{R: 255, G: 165, B: 0},  // orange
		color.RGBA{R: 240, G: 145, B: 53}, // dark orange
		color.RGBA{R: 235, G: 172, B: 108},
	},
	purple: {
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
	black: {color.RGBA{R: 0, G: 0, B: 0}},
	white: {color.RGBA{R: 255, G: 255, B: 255}},
	brown: {
		// color.RGBA{R: 98, G: 56, B: 16},    // brown
		color.RGBA{R: 206, G: 177, B: 120}, // tan
		color.RGBA{R: 229, G: 217, B: 172}, // Beige
		color.RGBA{R: 169, G: 129, B: 87},  // light brown
	},
	gray: {
		// color.RGBA{R: 147, G: 149, B: 145},
		color.RGBA{R: 128, G: 128, B: 128}, // dark gray
		color.RGBA{R: 211, G: 211, B: 211}, // light gray
		color.RGBA{R: 169, G: 169, B: 169}, // gray
	},
	pink: {
		color.RGBA{R: 239, G: 139, B: 189}, // pink
		color.RGBA{R: 169, G: 117, B: 129}, // Mauve
		color.RGBA{R: 239, G: 128, B: 113}, // salmon
		color.RGBA{R: 234, G: 61, B: 138},  // hot pint
		color.RGBA{R: 193, G: 78, B: 107},  // dark pink
		color.RGBA{R: 248, G: 212, B: 223}, // light pink
	},
}

var colorMap = make(map[int]map[color.Color]ColorStruct)

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
	var imgFileName = flag.String("i", "", "-i <path-to-image>")
	var numberOfColors = flag.Int("n", 10, "-n <number-of-colors>")
	var numberOfTopDistincts = flag.Int("d", 3, "-d <distinct-colors>")

	flag.Parse()

	imgFile, err := os.Open(*imgFileName)
	if err != nil {
		log.Fatal(err)
	}
	imgData, _, err := image.Decode(imgFile)
	if err != nil {
		fmt.Println(err)
	}

	colorMap[red] = make(map[color.Color]ColorStruct)
	colorMap[green] = make(map[color.Color]ColorStruct)
	colorMap[blue] = make(map[color.Color]ColorStruct)
	colorMap[yellow] = make(map[color.Color]ColorStruct)
	colorMap[orange] = make(map[color.Color]ColorStruct)
	colorMap[purple] = make(map[color.Color]ColorStruct)
	colorMap[black] = make(map[color.Color]ColorStruct)
	colorMap[white] = make(map[color.Color]ColorStruct)
	colorMap[brown] = make(map[color.Color]ColorStruct)
	colorMap[gray] = make(map[color.Color]ColorStruct)
	colorMap[pink] = make(map[color.Color]ColorStruct)

	var largest ColorStruct
	// start := time.Now()
	// fmt.Println("Begining image processing...")
	// Loop over image data.
	for y := imgData.Bounds().Min.Y; y < imgData.Bounds().Max.Y; y++ {
		for x := imgData.Bounds().Min.X; x < imgData.Bounds().Max.X; x++ {
			colr := imgData.At(x, y)
			colorStruct := toColorStruct(colr)
			value, present := findColorStruct(colr)
			count := 1
			colorStruct.rgba = color.RGBAModel.Convert(colr).(color.RGBA)
			if present {
				count = value.Count + 1
				colorStruct.category = value.category
			} else {
				colorStruct.category = ColorCategory(colorStruct.rgba)
			}
			colorStruct.Count = count
			colorStruct.R = colorStruct.rgba.R
			colorStruct.G = colorStruct.rgba.G
			colorStruct.B = colorStruct.rgba.B
			colorStruct.A = colorStruct.rgba.A
			if (ColorStruct{} == largest || largest.Count < count) {
				largest = colorStruct
			}

			colorMap[colorStruct.category][colr] = colorStruct
		}
	}
	// end := time.Since(start)
	// fmt.Printf("Conversion took %s", end)
	// fmt.Println(" Ending image processing.")
	// fmt.Printf("There are %d entries in the map", len(colorMap))
	result := &ResultColors{
		Red:     getResultSlice(getSortedDict(red), *numberOfColors),
		Green:   getResultSlice(getSortedDict(green), *numberOfColors),
		Blue:    getResultSlice(getSortedDict(blue), *numberOfColors),
		Yellow:  getResultSlice(getSortedDict(yellow), *numberOfColors),
		Orange:  getResultSlice(getSortedDict(orange), *numberOfColors),
		Purple:  getResultSlice(getSortedDict(purple), *numberOfColors),
		Black:   getResultSlice(getSortedDict(black), *numberOfColors),
		White:   getResultSlice(getSortedDict(white), *numberOfColors),
		Brown:   getResultSlice(getSortedDict(brown), *numberOfColors),
		Gray:    getResultSlice(getSortedDict(gray), *numberOfColors),
		Pink:    getResultSlice(getSortedDict(pink), *numberOfColors),
		Primary: largest,
	}

	result.Secondary = getSecondary([][]ColorStruct{
		result.Red, result.Green, result.Blue, result.Yellow,
		result.Orange, result.Purple, result.Pink,
	}, largest.category)

	result.TopDistinctRed = getDistincts(result.Red, *numberOfTopDistincts)
	result.TopDistinctGreen = getDistincts(result.Green, *numberOfTopDistincts)
	result.TopDistinctBlue = getDistincts(result.Blue, *numberOfTopDistincts)
	result.TopDistinctYellow = getDistincts(result.Yellow, *numberOfTopDistincts)
	result.TopDistinctOrange = getDistincts(result.Orange, *numberOfTopDistincts)
	result.TopDistinctPurple = getDistincts(result.Purple, *numberOfTopDistincts)
	result.TopDistinctBlack = getDistincts(result.Black, *numberOfTopDistincts)
	result.TopDistinctWhite = getDistincts(result.White, *numberOfTopDistincts)
	result.TopDistinctBrown = getDistincts(result.Brown, *numberOfTopDistincts)
	result.TopDistinctGray = getDistincts(result.Gray, *numberOfTopDistincts)
	result.TopDistinctPink = getDistincts(result.Pink, *numberOfTopDistincts)

	binary, err := json.Marshal(result)
	fmt.Println(string(binary))
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

func getDistincts(colors []ColorStruct, numberOfDistcts int) []ColorStruct {
	// fmt.Printf("Analyzing %d colors", len(colors))
	returnArr := make([]ColorStruct, numberOfDistcts)
	cachedArr := make([]ColorStructAndDist, len(colors))
	if len(colors) > 0 {
		topColor := colors[0]
		for i := 1; i < len(colors); i++ {
			distance := getRgbDistance(topColor.rgba, colors[i].rgba)
			cachedArr[i-1] = ColorStructAndDist{
				distance:    distance,
				colorStruct: colors[i],
			}
		}
		sort.Slice(cachedArr, func(i, j int) bool {
			return cachedArr[i].distance > cachedArr[j].distance
		})
		returnArr[0] = topColor
		for i := 1; i < numberOfDistcts; i++ {
			returnArr[i] = cachedArr[i].colorStruct
			// fmt.Println("Printing returned color struct... ")
			// fmt.Printf("RGB %d %d %d Distance %f", cachedArr[i].colorStruct.rgba.R, cachedArr[i].colorStruct.rgba.G, cachedArr[i].colorStruct.rgba.B, cachedArr[i].distance)
		}
	}
	return returnArr
}

func getSecondary(colors [][]ColorStruct, category int) ColorStruct {
	var secondary ColorStruct
	for _, colorArr := range colors {
		if len(colorArr) > 0 {
			if (ColorStruct{} == secondary ||
				(colorArr[0].category != category && colorArr[0].Count > secondary.Count)) {
				secondary = colorArr[0]
			}
		}
	}
	return secondary
}

func getSortedDict(category int) []ColorStruct {
	sortedColor := make([]ColorStruct, 0, len(colorMap[category]))
	for _, value := range colorMap[category] {
		sortedColor = append(sortedColor, value)
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
	// colorStruct.category = getColorCategory(colorStruct.rgba)
	return *colorStruct
}

func ColorCategory(color color.RGBA) int {
	var lowestCat = red
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

func findColorStruct(colr color.Color) (*ColorStruct, bool) {
	for key := range colorMap {
		colrStruct, present := colorMap[key][colr]
		if present {
			return &colrStruct, true
		}
	}
	return nil, false
}

func getRgbDistance(rgb1, rgb2 color.RGBA) float64 {
	return math.Sqrt(math.Pow(float64(rgb2.R)-float64(rgb1.R), 2) + math.Pow(float64(rgb2.G)-float64(rgb1.G), 2) + math.Pow(float64(rgb2.B)-float64(rgb1.B), 2))
}
