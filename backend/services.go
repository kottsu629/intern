package main

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type CarService struct {
	repo *CarRepo
}

type BidService struct {
	db      *sql.DB
	bidRepo *BidRepo
	carRepo *CarRepo
}

func NewCarService(repo *CarRepo) *CarService { return &CarService{repo: repo} }

func NewBidService(db *sql.DB, bidRepo *BidRepo, carRepo *CarRepo) *BidService {
	return &BidService{db: db, bidRepo: bidRepo, carRepo: carRepo}
}

func (s *CarService) CreateCar(ctx context.Context, req CarCreateRequest) (int64, error) {
	req.Model = strings.TrimSpace(req.Model)
	if req.Model == "" {
		return 0, errors.New("model is required")
	}
	if req.Price <= 0 {
		return 0, errors.New("price must be positive")
	}
	if req.Year <= 0 {
		return 0, errors.New("year must be positive")
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	return s.repo.CreateCar(ctx, req)
}

func (s *BidService) CreateBid(ctx context.Context, req BidRequest) error {
	req.Bidder = strings.TrimSpace(req.Bidder)
	req.RequestID = strings.TrimSpace(req.RequestID)

	if req.CarID <= 0 || req.Amount <= 0 || req.Bidder == "" || req.RequestID == "" {
		return errors.New("missing fields")
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	// FK違反を「DBエラー(500)」にしないため、先に存在チェック
	exists, err := s.carRepo.ExistsByID(ctx, req.CarID)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New("car_id not found")
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// request_id UNIQUE 前提（冪等性）
	if err := s.bidRepo.CreateBidTx(ctx, tx, req); err != nil {
		return err
	}

	return tx.Commit()
}
