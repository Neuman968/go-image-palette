package main

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"io"
	"io/ioutil"
	"log"
	"net/http"
)

func getHello(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got /hello request\n")
	io.WriteString(w, "Hello, HTTP!\n")
}

func supportedContentTypes(contentType string) bool {
	return "image/png" == contentType || "image/jpeg" == contentType || "image/gif" == contentType
}

func ProcessImage(r *http.Request, field string, maxSize int) (*image.Image, error) {
	file, info, err := r.FormFile(field)

	if err != nil {
		return nil, err
	}

	if !supportedContentTypes(info.Header.Get("Content-Type")) {
		return nil, errors.New("Wrong Image Type, Supported Image formats are jpeg, png or gif")
	}

	byteStream, err := ioutil.ReadAll(file)

	// if len(byteStream) > maxSize {
	// 	return nil, errors.New(fmt.Sprintf("Image was too large. Resize your image or choose a smaller one and try again."))
	// }

	img, _, err := image.Decode(bytes.NewReader(byteStream))
	return &img, err
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.NotFound(w, r)
		return
	}

	img, err := ProcessImage(r, "file", 1)
	if err != nil {
		// http.ErrServerClosed(w, r)
		// todo handle err
		log.Printf("Error!! %v", err)
	} else {
		json := GetJsonForImage(img, 200, 15)
		io.WriteString(w, json)
	}
}

func main() {
	http.HandleFunc("/", getHello)
	http.HandleFunc("/upload", handleUpload)
	fmt.Println("Starting server on port :8888")
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		fmt.Println("Error! Failed to start application")
		fmt.Errorf("Cause: ", err)
	}
}
