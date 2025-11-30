FROM golang:1.22


WORKDIR /go/src/app

# 先に go.mod / go.sum だけコピーして依存をダウンロード
COPY go.mod go.sum ./
RUN go mod download

# その後にソースコードをコピー
COPY . .

CMD ["go", "run", "main.go"]
