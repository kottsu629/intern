

package services

import (
	"context"
	"time"
	"app/models"
	"app/repos"
)

type CarService struct {
	repo *repos.CarRepo
}

func NewCarService(repo *repos.CarRepo) *CarService { return &CarService{repo: repo} }





func (s *CarService) ListCars(ctx context.Context, hasMin bool, hasMax bool, min int, max int) ([]models.Car, error) {
	if hasMin && hasMax && min > max {
		min, max = max, min
	}

	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	return s.repo.ListCarsWithFilter(ctx, hasMin, hasMax, min, max)
}
