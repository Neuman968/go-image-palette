package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/Neuman968/web-image-palette/colorlib"
)

func main() {
	var imgFileName = flag.String("i", "", "-i <path-to-image>")
	var numberOfColors = flag.Int("n", 10, "-n <number-of-colors>")
	var numberOfTopDistincts = flag.Int("d", 3, "-d <distinct-colors>")
	flag.Parse()
	imgData, err := colorlib.GetImageFromFile(imgFileName)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Print(colorlib.GetJsonForImage(imgData, *numberOfColors, *numberOfTopDistincts))
	}
}
