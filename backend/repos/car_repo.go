package repos

import (
	"context"
	"database/sql"

	"app/models"
)

type CarRepo struct{ db *sql.DB }

func NewCarRepo(db *sql.DB) *CarRepo { return &CarRepo{db: db} }

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

func (r *CarRepo) ListCars(ctx context.Context, query string, args ...any) ([]models.Car, error) {
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cars := make([]models.Car, 0)
	for rows.Next() {
		var c models.Car
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

func (r *CarRepo) GetCarByID(ctx context.Context, carID int64) (*models.Car, error) {
	row := r.db.QueryRowContext(
		ctx,
		`SELECT id, model, price, year, created_at FROM cars WHERE id = ?`,
		carID,
	)

	var c models.Car
	if err := row.Scan(&c.ID, &c.Model, &c.Price, &c.Year, &c.CreatedAt); err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *CarRepo) CreateCar(ctx context.Context, req models.CarCreateRequest) (int64, error) {
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
