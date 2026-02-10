package models

import "time"

// POST /cars
type CarCreateRequest struct {
	Model string `json:"model"`
	Price int    `json:"price"`
	Year  int    `json:"year"`
}

// GET /cars item
type Car struct {
	ID        int64     `json:"id"`
	Model     string    `json:"model"`
	Price     int       `json:"price"`
	Year      int       `json:"year"`
	CreatedAt time.Time `json:"created_at"`
}