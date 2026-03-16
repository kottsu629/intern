package services

import (
	"app/models"
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type BidRepoInterface interface {
	CreateBidTx(ctx context.Context, tx *sql.Tx, req models.BidRequest) error
}

type CarRepoInterface interface {
	ExistsByID(ctx context.Context, id int64) (bool, error)
}

type BidService struct {
	db      *sql.DB
	bidRepo BidRepoInterface 
	carRepo CarRepoInterface 
}

func NewBidService(db *sql.DB, bidRepo BidRepoInterface, carRepo CarRepoInterface) *BidService { // 同上
	return &BidService{db: db, bidRepo: bidRepo, carRepo: carRepo}
}

func (s *BidService) CreateBid(ctx context.Context, req models.BidRequest) error {
	req.Bidder = strings.TrimSpace(req.Bidder)

	req.RequestID = strings.TrimSpace(req.RequestID)

	if req.CarID <= 0 || req.Amount <= 0 || req.Bidder == "" || req.RequestID == "" {
		return errors.New("missing fields")
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

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

	if err := s.bidRepo.CreateBidTx(ctx, tx, req); err != nil {
		return err
	}
	return tx.Commit()
}