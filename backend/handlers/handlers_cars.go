package handlers

import (
	"app/models"
	"app/repos"
	"app/services"
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type CarsHandler struct {
	repo    *repos.CarRepo
	service *services.CarService
}

func NewCarsHandler(repo *repos.CarRepo, service *services.CarService) *CarsHandler {
	return &CarsHandler{repo: repo, service: service}
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


func (h *CarsHandler) handleCreateCar(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    var req models.CarCreateRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        w.WriteHeader(http.StatusBadRequest)
        _ = json.NewEncoder(w).Encode(map[string]string{
            "error":   "invalid_request",
            "message": "invalid JSON",
        })
        return
    }

    if strings.TrimSpace(req.Model) == "" {
        w.WriteHeader(http.StatusBadRequest)
        _ = json.NewEncoder(w).Encode(map[string]string{
            "error":   "validation_error",
            "message": "model is required",
        })
        return
    }
    if req.Price <= 0 {
        w.WriteHeader(http.StatusBadRequest)
        _ = json.NewEncoder(w).Encode(map[string]string{
            "error":   "validation_error",
            "message": "price must be greater than 0",
        })
        return
    }
    currentYear := time.Now().Year()
    if req.Year < 1886 || req.Year > currentYear+1 {
        w.WriteHeader(http.StatusBadRequest)
        _ = json.NewEncoder(w).Encode(map[string]string{
            "error":   "validation_error",
            "message": "year is out of allowed range",
        })
        return
    }

    id, err := h.service.CreateCar(r.Context(), req)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        _ = json.NewEncoder(w).Encode(map[string]string{
            "error":   "internal_error",
            "message": "failed to insert car",
        })
        return
    }

    w.WriteHeader(http.StatusCreated)
    _ = json.NewEncoder(w).Encode(map[string]int64{"id": id})
}
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

func NewCarDetailHandler(repo *repos.CarRepo) http.HandlerFunc {


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


