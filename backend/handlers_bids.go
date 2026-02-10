package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type BidsHandler struct {
	repo    *BidRepo
	service *BidService
}

func NewBidsHandler(repo *BidRepo, service *BidService) *BidsHandler {
	return &BidsHandler{repo: repo, service: service}
}

// GET /bids?item_id=xxx  & POST /bids
func (h *BidsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.handleCreateBid(w, r)
	case http.MethodGet:
		h.handleListBids(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *BidsHandler) handleCreateBid(w http.ResponseWriter, r *http.Request) {
	var req BidRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if err := h.service.CreateBid(r.Context(), req); err != nil {
		msg := err.Error()
		if msg == "missing fields" || msg == "car_id not found" {
			http.Error(w, msg, http.StatusBadRequest)
			return
		}
		http.Error(w, "failed to insert bid", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	_, _ = w.Write([]byte("created"))
}

func (h *BidsHandler) handleListBids(w http.ResponseWriter, r *http.Request) {
	itemIDStr := strings.TrimSpace(r.URL.Query().Get("item_id"))
	if itemIDStr == "" {
		http.Error(w, "item_id is required", http.StatusBadRequest)
		return
	}

	carID, err := strconv.ParseInt(itemIDStr, 10, 64)
	if err != nil {
		http.Error(w, "item_id must be integer", http.StatusBadRequest)
		return
	}

	bids, err := h.repo.ListBidsByCarID(r.Context(), carID)
	if err != nil {
		http.Error(w, "failed to query bids", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(bids)
}
