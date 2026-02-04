package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "app:app@tcp(db:3306)/app?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("DB接続失敗: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("DBに接続できません: %v", err)
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
