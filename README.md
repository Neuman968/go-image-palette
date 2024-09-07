## Building WebAssembly Go code

Must have at least go version 1.22 installed.

cd into the `go` directory in this project. 
Build the wasm binary using the following command


```bash
GOOS=js GOARCH=wasm go build -o main.wasm
```

Next, copy the resulting `main.wasm` file into the public directory of the react app.
(From the go folder)
```
cp main.wasm ../public/go-wasm.wasm
```
