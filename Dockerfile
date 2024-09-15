FROM golang:alpine3.19 AS go-builder

WORKDIR /app

COPY go/go.mod ./
RUN go mod download
COPY go ./

# Build WASM app.
RUN cd go; CGO_ENABLED=0 GOOS=js GOARCH=wasm go build -o /main.wasm

# Build GUI app.
FROM node:22.8 AS web-deps

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn

COPY . ./

COPY --from=go-builder /main.wasm ./public/main.wasm

RUN yarn build


# Final image hosting the web app.
FROM nginx:1.27-alpine

COPY nginx-rewrite.conf /etc/nginx/conf.d/default.conf
COPY --from=web-deps /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
