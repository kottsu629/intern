// package handlers

package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"app/models"
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

// GET /cars  &  POST /cars
func (h *CarsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.handleListCars(w, r)
	case http.MethodPost:
		h.handleCreateCar(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *CarsHandler) handleCreateCar(w http.ResponseWriter, r *http.Request) {
	var req models.CarCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	id, err := h.service.CreateCar(r.Context(), req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(map[string]any{"id": id})
}

// GET /cars
// 仕様（わかりやすい一般形）:
//   ・min_price のみ → price >= min_price
//   ・max_price のみ → price <= max_price
//   ・両方あり → min_price <= price <= max_price（min > max なら入替）
//   ※ sort機能は削除
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

	// SQLや条件組み立てはservice/repoに寄せる（sortは扱わない）
	cars, err := h.service.ListCars(ctx, hasMin, hasMax, min, max)
	if err != nil {
		http.Error(w, "failed to query cars", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(cars)
}

// GET /cars/{id}
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
