

package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"
	"app/repos"
	"app/services"
)

type CarsHandler struct {
	repo    *repos.CarRepo
	service *services.CarService
}

func NewCarsHandler(repo *repos.CarRepo, service *services.CarService) *CarsHandler {
	return &CarsHandler{repo: repo, service: service}
}


func (h *CarsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.handleListCars(w, r)
	
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}



func (h *CarsHandler) handleListCars(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	q := r.URL.Query()
	minPriceStr := strings.TrimSpace(q.Get("min_price"))
	maxPriceStr := strings.TrimSpace(q.Get("max_price"))

	var (
		hasMin bool
		hasMax bool
		min    int
		max    int
	)

	if minPriceStr != "" {
		v, err := strconv.Atoi(minPriceStr)
		if err != nil {
			http.Error(w, "min_price must be integer", http.StatusBadRequest)
			return
		}
		hasMin, min = true, v
	}

	if maxPriceStr != "" {
		v, err := strconv.Atoi(maxPriceStr)
		if err != nil {
			http.Error(w, "max_price must be integer", http.StatusBadRequest)
			return
		}
		hasMax, max = true, v
	}

	
	cars, err := h.service.ListCars(ctx, hasMin, hasMax, min, max)
	if err != nil {
		http.Error(w, "failed to query cars", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(cars)
}


func CarDetailHandler(repo *repos.CarRepo) http.HandlerFunc {


	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		path := strings.TrimPrefix(r.URL.Path, "/cars/")
		idStr := strings.Trim(strings.TrimSpace(path), "/")
		if idStr == "" {
			http.Error(w, "id is required", http.StatusBadRequest)
			return
		}

		carID, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			http.Error(w, "id must be integer", http.StatusBadRequest)
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		defer cancel()

		c, err := repo.GetCarByID(ctx, carID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "car not found", http.StatusNotFound)
				return
			}
			http.Error(w, "failed to query car", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(c)
	}
}
