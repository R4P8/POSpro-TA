FROM golang:1.25-alpine AS builder

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o app ./cmd

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /app/app .

USER nonroot:nonroot

EXPOSE 8080

ENTRYPOINT ["/app/app"]