

package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"app/models"
	"app/repos"
)

type CarService struct {
	repo *repos.CarRepo
}

func NewCarService(repo *repos.CarRepo) *CarService { return &CarService{repo: repo} }

func (s *CarService) CreateCar(ctx context.Context, req models.CarCreateRequest) (int64, error) {
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


func (s *CarService) ListCars(ctx context.Context, hasMin bool, hasMax bool, min int, max int) ([]models.Car, error) {
	if hasMin && hasMax && min > max {
		min, max = max, min
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	return s.repo.ListCarsWithFilter(ctx, hasMin, hasMax, min, max)
}
