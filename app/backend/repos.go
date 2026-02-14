package main

import (
	"context"
	"database/sql"
)

type CarRepo struct{ db *sql.DB }
type BidRepo struct{ db *sql.DB }

func NewCarRepo(db *sql.DB) *CarRepo { return &CarRepo{db: db} }
func NewBidRepo(db *sql.DB) *BidRepo { return &BidRepo{db: db} }

// -------- cars --------

func (r *CarRepo) ExistsByID(ctx context.Context, id int64) (bool, error) {
	row := r.db.QueryRowContext(ctx, `SELECT 1 FROM cars WHERE id = ? LIMIT 1`, id)
	var one int
	err := row.Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *CarRepo) ListCars(ctx context.Context, query string, args ...any) ([]Car, error) {
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cars := make([]Car, 0)
	for rows.Next() {
		var c Car
		if err := rows.Scan(&c.ID, &c.Model, &c.Price, &c.Year, &c.CreatedAt); err != nil {
			return nil, err
		}
		cars = append(cars, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return cars, nil
}

func (r *CarRepo) GetCarByID(ctx context.Context, carID int64) (*Car, error) {
	row := r.db.QueryRowContext(
		ctx,
		`SELECT id, model, price, year, created_at FROM cars WHERE id = ?`,
		carID,
	)

	var c Car
	if err := row.Scan(&c.ID, &c.Model, &c.Price, &c.Year, &c.CreatedAt); err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *CarRepo) CreateCar(ctx context.Context, req CarCreateRequest) (int64, error) {
	res, err := r.db.ExecContext(
		ctx,
		`INSERT INTO cars (model, price, year) VALUES (?, ?, ?)`,
		req.Model, req.Price, req.Year,
	)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// -------- bids --------

func (r *BidRepo) ListBidsByCarID(ctx context.Context, carID int64) ([]Bid, error) {
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

	bids := make([]Bid, 0)
	for rows.Next() {
		var b Bid
		if err := rows.Scan(&b.ID, &b.CarID, &b.Amount, &b.Bidder, &b.RequestID, &b.CreatedAt); err != nil {
			return nil, err
		}
		bids = append(bids, b)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return bids, nil
}

func (r *BidRepo) CreateBidTx(ctx context.Context, tx *sql.Tx, req BidRequest) error {
	_, err := tx.ExecContext(
		ctx,
		`INSERT INTO bids (car_id, amount, bidder, request_id)
		 VALUES (?, ?, ?, ?)`,
		req.CarID, req.Amount, req.Bidder, req.RequestID,
	)
	return err
}
