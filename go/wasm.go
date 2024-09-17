package main

import (
	"syscall/js"

	"github.com/Neuman968/web-image-palette/palettelib"
)

func processImage(this js.Value, inputs []js.Value) interface{} {
	byteArr := inputs[0]
	inBuf := make([]uint8, byteArr.Get("byteLength").Int())
	js.CopyBytesToGo(inBuf, byteArr)
	return palettelib.JsonImageFromImageBytes(inBuf, 200, 15)
}

func main() {
	js.Global().Set("PaletteFromImage", js.FuncOf(processImage))
	<-make(chan bool)
}
