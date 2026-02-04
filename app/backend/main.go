package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "app:app@tcp(db:3306)/app?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("DB接続失敗: %v", err)
	}
	defer db.Close()

	// DBが起動完了するまで待つ（最大60秒）
	fmt.Println("DB接続待ち...")
	const (
		maxRetries = 30
		interval   = 2 * time.Second
	)
	var pingErr error
	for i := 1; i <= maxRetries; i++ {
		if err := db.Ping(); err == nil {
			pingErr = nil
			break
		} else {
			pingErr = err
			log.Printf("DBに接続できません (%d/%d): %v", i, maxRetries, err)
			time.Sleep(interval)
		}
	}
	if pingErr != nil {
		log.Fatalf("DBに接続できません（リトライ終了）: %v", pingErr)
	}
	fmt.Println("DB接続成功！")

	carRepo := NewCarRepo(db)
	bidRepo := NewBidRepo(db)

	carService := NewCarService(carRepo)
	bidService := NewBidService(db, bidRepo, carRepo)

	carsHandler := NewCarsHandler(carRepo, carService)
	bidsHandler := NewBidsHandler(bidRepo, bidService)

	http.Handle("/cars", withCORS(carsHandler))           // GET/POST
	http.Handle("/cars/", withCORS(carDetailHandler(db))) // GET /cars/{id}
	http.Handle("/bids", withCORS(bidsHandler))           // GET/POST
	http.Handle("/", withCORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("OK"))
	})))

	fmt.Println("サーバー起動: 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
