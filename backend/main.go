package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"app/handlers"
	"app/repos"
	"app/services"

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

	carRepo := repos.NewCarRepo(db)
	bidRepo := repos.NewBidRepo(db)

	carService := services.NewCarService(carRepo)
	bidService := services.NewBidService(db, bidRepo, carRepo)

	carsHandler := handlers.NewCarsHandler(carRepo, carService)
	bidsHandler := handlers.NewBidsHandler(bidRepo, bidService)

	http.Handle("/cars", withCORS(carsHandler))                
	http.Handle("/cars/", withCORS(handlers.CarDetailHandler(carRepo))) 
	http.Handle("/bids", withCORS(bidsHandler))                 
	http.Handle("/", withCORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("OK"))
	})))

	fmt.Println("サーバー起動: 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
