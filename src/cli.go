package main

import (
	"flag"
	"fmt"
)

func main() {
	// fmt.Println("Hello World!")
	// imgFile, err := os.Open("./red-f44242.png")
	var imgFileName = flag.String("i", "", "-i <path-to-image>")
	var numberOfColors = flag.Int("n", 10, "-n <number-of-colors>")
	var numberOfTopDistincts = flag.Int("d", 3, "-d <distinct-colors>")
	flag.Parse()
	fmt.Print(GetJsonForImage(imgFileName, numberOfColors, numberOfTopDistincts))
}
