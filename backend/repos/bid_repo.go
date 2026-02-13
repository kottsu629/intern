package repos

import (
	"context"
	"database/sql"

	"app/models"
)

type BidRepo struct{ db *sql.DB }

func NewBidRepo(db *sql.DB) *BidRepo {
	return &BidRepo{db: db}
}

func (r *BidRepo) ListBidsByCarID(ctx context.Context, carID int64) ([]models.Bid, error) {
	rows, err := r.db.QueryContext(
		ctx,
		`SELECT id, car_id, amount, bidder, request_id, created_at
		 FROM bids
		 WHERE car_id = ?
		 ORDER BY created_at DESC`,
		carID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	bids := make([]models.Bid, 0)
	for rows.Next() {
		var b models.Bid
		if err := rows.Scan(
			&b.ID,
			&b.CarID,
			&b.Amount,
			&b.Bidder,
			&b.RequestID,
			&b.CreatedAt,
		); err != nil {
			return nil, err
		}
		bids = append(bids, b)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return bids, nil
}

func (r *BidRepo) CreateBidTx(ctx context.Context, tx *sql.Tx, req models.BidRequest) error {
	_, err := tx.ExecContext(
		ctx,
		`INSERT INTO bids (car_id, amount, bidder, request_id)
		 VALUES (?, ?, ?, ?)`,
		req.CarID,
		req.Amount,
		req.Bidder,
		req.RequestID,
	)
	return err
}
