package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/Neuman968/web-image-palette/palettelib"
)

func main() {
	var imgFileName = flag.String("i", "", "-i <path-to-image>")
	var numberOfColors = flag.Int("n", 10, "-n <number-of-colors>")
	var numberOfTopDistincts = flag.Int("d", 3, "-d <distinct-colors>")
	flag.Parse()
	imgData, err := palettelib.GetImageFromFile(imgFileName)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Print(palettelib.GetJsonForImage(imgData, *numberOfColors, *numberOfTopDistincts))
	}
}
