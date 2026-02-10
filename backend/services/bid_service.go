package services

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"

	"app/models"
	"app/repos"
)

type BidService struct {
	db      *sql.DB
	bidRepo *repos.BidRepo
	carRepo *repos.CarRepo
}

func NewBidService(db *sql.DB, bidRepo *repos.BidRepo, carRepo *repos.CarRepo) *BidService {
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
