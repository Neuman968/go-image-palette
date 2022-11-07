package main

import (
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"os"
)

type ColorCount struct {
	rgbColor color.Color
	count    int
}

func main() {
	// fmt.Println("Hello World!")
	imgFile, err := os.Open("./red-f44242.png")
	if err != nil {
		log.Fatal(err)
	}
	imgData, imgType, err := image.Decode(imgFile)
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println(imgData)
	fmt.Println(imgType)

	colorMap := make(map[color.Color]int)

	topColors := make(map[int]ColorCount)

	// Loop over image data.
	for y := imgData.Bounds().Min.Y; y < imgData.Bounds().Max.Y; y++ {
		for x := imgData.Bounds().Min.X; x < imgData.Bounds().Max.X; x++ {
			color := imgData.At(x, y)
			value, present := colorMap[color]
			if present {
				colorMap[color] = value + 1
			} else {
				colorMap[color] = 1
			}
		}
	}
	fmt.Printf("There are %d entries in the map", len(colorMap))

	var maxColor color.Color
	var maxCount int = 0
	for k, v := range colorMap {
		if v > maxCount {
			maxColor = k
			maxCount = v
		}
	}

	// Calculate top 10 colors.
	for key, value := range colorMap {
		// init first place if not already set.
		_, present := topColors[1]
		if !present {
			colorCount := new(ColorCount)
			colorCount.count = value
			colorCount.rgbColor = key
			topColors[1] = *colorCount
		}

		for i := 1; i < 11; i++ {
			currentColor, present := topColors[i]

		}
	}

	// r, g, b, a := maxColor.RGBA()

	// converted := color.RGBAModel.Convert(maxColor).(color.RGBA)

	// fmt.Println("")
	// fmt.Println(maxColor)
	// fmt.Println("")
	// fmt.Println(maxColor.RGBA())
	// // color.Model.Convert(maxColor).RGBA()
	// // color.Model.Convert(color.NRGBAModel)
	// fmt.Println("Printing hex color...")
	// fmt.Printf("#%02x%02x%02x", r, g, b)
	// fmt.Println("")
	// fmt.Printf("The most common color was %d %d %d %d occurred %d times", r, g, b, a, maxCount)
	// fmt.Println("")
	// fmt.Printf("converted.. rgba(%d,%d,%d,%d) occurred %d times", r/257, g/257, b/257, a/257, maxCount)
	// fmt.Println("Getting color")
	// fmt.Printf("rgb(%d,%d,%d)", converted.R, converted.G, converted.B)
}
