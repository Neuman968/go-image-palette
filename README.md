# Go WebAssembly Image Palette Generator

Generate a color palette from an image all locally with web assembly and Go.

Click here for a [Live Demo](https://neuman968.github.io/go-image-palette/index.html)

## Building WebAssembly Go code

Must have at least go version 1.22 installed.

cd into the `go` directory in this project. 
Build the wasm binary using the following command

```bash
GOOS=js GOARCH=wasm go build -o ../public/go-wasm.wasm
```

This will move the compiiled wasm binary to the public folder of the React project in the parent folder.

