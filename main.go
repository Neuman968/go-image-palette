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
	"os"
	"sort"

	"github.com/mattn/go-ciede2000"
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

type ResultColors struct {
	Red       []ColorStruct
	Green     []ColorStruct
	Blue      []ColorStruct
	Yellow    []ColorStruct
	Orange    []ColorStruct
	Purple    []ColorStruct
	Black     []ColorStruct
	White     []ColorStruct
	Brown     []ColorStruct
	Gray      []ColorStruct
	Pink      []ColorStruct
	Primary   ColorStruct
	Secondary ColorStruct
}

type TopColors struct {
	red    []ColorStruct
	green  []ColorStruct
	blue   []ColorStruct
	yellow []ColorStruct
	orange []ColorStruct
	purple []ColorStruct
	black  []ColorStruct
	white  []ColorStruct
	brown  []ColorStruct
	gray   []ColorStruct
	pink   []ColorStruct
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
	green:  color.RGBA{R: 77, G: 169, B: 58},
	blue:   color.RGBA{R: 0, G: 30, B: 245},
	yellow: color.RGBA{R: 255, G: 253, B: 84},
	orange: color.RGBA{R: 255, G: 165, B: 0},
	purple: color.RGBA{R: 177, G: 25, B: 124},
	black:  color.RGBA{R: 0, G: 0, B: 0},
	white:  color.RGBA{R: 255, G: 255, B: 255},
	brown:  color.RGBA{R: 98, G: 56, B: 16},
	gray:   color.RGBA{R: 147, G: 149, B: 145},
	pink:   color.RGBA{R: 239, G: 139, B: 189},
}

var colorMap = make(map[int]map[color.Color]ColorStruct)

/*
employeeSalary := map[string]int{
"John": 1000
"Sam": 2000
}
*/

var complementColors = map[int]int{
	red: blue,
}

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

	// Loop over image data.
	for y := imgData.Bounds().Min.Y; y < imgData.Bounds().Max.Y; y++ {
		for x := imgData.Bounds().Min.X; x < imgData.Bounds().Max.X; x++ {
			colr := imgData.At(x, y)
			colorStruct := toColorStruct(colr)
			value, present := colorMap[colorStruct.category][colr]
			count := 1
			if present {
				count = value.Count + 1
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

	// fmt.Printf("There are %d entries in the map", len(colorMap))
	result := &ResultColors{
		Red:     getResultSlice(getSortedDict(red), 10),
		Green:   getResultSlice(getSortedDict(green), 10),
		Blue:    getResultSlice(getSortedDict(blue), 10),
		Yellow:  getResultSlice(getSortedDict(yellow), 10),
		Orange:  getResultSlice(getSortedDict(orange), 10),
		Purple:  getResultSlice(getSortedDict(purple), 10),
		Black:   getResultSlice(getSortedDict(black), 10),
		White:   getResultSlice(getSortedDict(white), 10),
		Brown:   getResultSlice(getSortedDict(brown), 10),
		Gray:    getResultSlice(getSortedDict(gray), 10),
		Pink:    getResultSlice(getSortedDict(pink), 10),
		Primary: largest,
	}

	binary, err := json.Marshal(result)
	fmt.Println(string(binary))
}

// func getSecondaryColor(largest: ColorStruct) {

// }

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
	colorStruct.rgba = color.RGBAModel.Convert(colorVal).(color.RGBA)
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
	// return math.Sqrt(math.Pow(float64(rgb2.R)-float64(rgb1.R), 2) + math.Pow(float64(rgb2.G)-float64(rgb1.G), 2) + math.Pow(float64(rgb2.B)-float64(rgb1.B), 2))
	return ciede2000.Diff(rgb1, rgb2)
}
