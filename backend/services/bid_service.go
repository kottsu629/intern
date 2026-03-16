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

func NewBidService(db *sql.DB, bidRepo BidRepoInterface, carRepo CarRepoInterface) *BidService {
	return &BidService{db: db, bidRepo: bidRepo, carRepo: carRepo}
}
func (s *BidService) CreateBid(ctx context.Context, req models.BidRequest) (err error) {
	req.Bidder = strings.TrimSpace(req.Bidder)

	req.RequestID = strings.TrimSpace(req.RequestID)

	if req.CarID <= 0 || req.Amount <= 0 || req.Bidder == "" || req.RequestID == "" {
		err = errors.New("missing fields")
		return
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	exists, err := s.carRepo.ExistsByID(ctx, req.CarID)
	if err != nil {
		return
	}
	if !exists {
		err = errors.New("car_id not found")
		return
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return
	}
	defer func() {
		if err != nil {

			_ = tx.Rollback()
		}
	}()
	if err = s.bidRepo.CreateBidTx(ctx, tx, req); err != nil {
		return
	}
	err = tx.Commit()
	return
}
