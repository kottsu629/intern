package services

import (
	"context"
	"database/sql"
	"errors"
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
