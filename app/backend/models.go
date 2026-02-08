package main

import "time"

// POST /bids
type BidRequest struct {
	CarID     int64  `json:"car_id"`
	Amount    int    `json:"amount"`
	Bidder    string `json:"bidder"`
	RequestID string `json:"request_id"`
}

// GET /bids response item
type Bid struct {
	ID        int64     `json:"id"`
	CarID     int64     `json:"car_id"`
	Amount    int       `json:"amount"`
	Bidder    string    `json:"bidder"`
	RequestID string    `json:"request_id"`
	CreatedAt time.Time `json:"created_at"`
}

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
