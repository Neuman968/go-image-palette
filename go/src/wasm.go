package main

import (
	"fmt"
	"syscall/js"
)

func processImage(this js.Value, inputs []js.Value) interface{} {
	byteArr := inputs[0]
	inBuf := make([]uint8, byteArr.Get("byteLength").Int())
	js.CopyBytesToGo(inBuf, byteArr)
	return GetJsonImageForBytes(inBuf, GetIntPtr(200), GetIntPtr(15))
	// start := time.Now()
	// GetJsonImageForBytes(inBuf, GetIntPtr(200), GetIntPtr(15))
	// duration := time.Since(start)
	// return fmt.Sprintf("Duration: %d", duration)
}

func sayHi(this js.Value, inputs []js.Value) interface{} {
	return "Hello!!! You Did it!!"
}

func echo(this js.Value, inputs []js.Value) interface{} {
	msgObj := inputs[0]
	msg := msgObj.Get("message").String()
	return fmt.Sprintf("Echoing: %s", msg)
}

func main() {
	js.Global().Set("GetJsonForImage", js.FuncOf(processImage))
	js.Global().Set("SayHi", js.FuncOf(sayHi))
	js.Global().Set("Echo", js.FuncOf(echo))
	<-make(chan bool)
}
