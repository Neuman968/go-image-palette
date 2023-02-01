package main

import (
	"flag"
	"fmt"
	"log"
)

func main() {
	var imgFileName = flag.String("i", "", "-i <path-to-image>")
	var numberOfColors = flag.Int("n", 10, "-n <number-of-colors>")
	var numberOfTopDistincts = flag.Int("d", 3, "-d <distinct-colors>")
	flag.Parse()
	imgData, err := getImageFromFile(imgFileName)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Print(GetJsonForImage(imgData, numberOfColors, numberOfTopDistincts))
	}
}
