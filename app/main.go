package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// POST /bids で受け取る JSON
type BidRequest struct {
	CarID     int64  `json:"car_id"`
	Amount    int    `json:"amount"`
	Bidder    string `json:"bidder"`
	RequestID string `json:"request_id"`
}

// GET /bids で返す 1件分
type Bid struct {
	ID        int64     `json:"id"`
	CarID     int64     `json:"car_id"`
	Amount    int       `json:"amount"`
	Bidder    string    `json:"bidder"`
	RequestID string    `json:"request_id"`
	CreatedAt time.Time `json:"created_at"`
}

// /cars で返す 1件分
type Car struct {
	ID        int64     `json:"id"`
	Model     string    `json:"model"`
	Price     int       `json:"price"`
	Year      int       `json:"year"`
	CreatedAt time.Time `json:"created_at"`
}

func main() {
    dsn := "app:app@tcp(db:3306)/app?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci"
    
	// docker-compose.yml の設定と合わせる

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("DB接続失敗: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("DBに接続できません: %v", err)
	}
	fmt.Println("DB接続成功！")

	// ルーティング登録（全部 CORS ラッパで包む）
	http.Handle("/bids", withCORS(bidsHandler(db)))
	http.Handle("/cars", withCORS(carsHandler(db)))   // 一覧・検索
	http.Handle("/cars/", withCORS(carDetailHandler(db))) // 1件取得
	http.Handle("/", withCORS(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "OK")
	})))

	fmt.Println("サーバー起動: 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// ===================== CORS ラッパ =====================

func withCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		// Preflight(OPTIONS) はここで返して終了
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		h.ServeHTTP(w, r)
	})
}

// ===================== /bids 用ハンドラ =====================

// /bids をまとめて扱うハンドラ
func bidsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			handleCreateBid(db, w, r)
		case http.MethodGet:
			handleListBids(db, w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

// POST /bids
func handleCreateBid(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	var req BidRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if req.CarID == 0 || req.Amount <= 0 || req.Bidder == "" || req.RequestID == "" {
		http.Error(w, "missing fields", http.StatusBadRequest)
		return
	}

	// タイムアウト付きコンテキスト
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	// トランザクション開始
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		http.Error(w, "failed to begin tx", http.StatusInternalServerError)
		return
	}

	// 生SQLで INSERT（request_id は UNIQUE 制約あり）
	_, err = tx.ExecContext(
		ctx,
		`INSERT INTO bids (car_id, amount, bidder, request_id)
		 VALUES (?, ?, ?, ?)`,
		req.CarID, req.Amount, req.Bidder, req.RequestID,
	)
	if err != nil {
		_ = tx.Rollback()
		http.Error(w, "failed to insert bid", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "failed to commit", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "created")
}

// GET /bids?item_id=XXX
func handleListBids(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	itemIDStr := r.URL.Query().Get("item_id")
	if itemIDStr == "" {
		http.Error(w, "item_id is required", http.StatusBadRequest)
		return
	}

	carID, err := strconv.ParseInt(itemIDStr, 10, 64)
	if err != nil {
		http.Error(w, "item_id must be integer", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	rows, err := db.QueryContext(
		ctx,
		`SELECT id, car_id, amount, bidder, request_id, created_at
		 FROM bids
		 WHERE car_id = ?
		 ORDER BY created_at DESC`,
		carID,
	)
	if err != nil {
		http.Error(w, "failed to query bids", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var bids []Bid
	for rows.Next() {
		var b Bid
		if err := rows.Scan(&b.ID, &b.CarID, &b.Amount, &b.Bidder, &b.RequestID, &b.CreatedAt); err != nil {
			http.Error(w, "failed to scan row", http.StatusInternalServerError)
			return
		}
		bids = append(bids, b)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "rows error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(bids); err != nil {
		http.Error(w, "failed to encode json", http.StatusInternalServerError)
		return
	}
}

// ===================== /cars 一覧・検索 =====================

// GET /cars
// 仕様:
//   ・min_price と max_price 両方あり → その範囲 (min_price <= price <= max_price)
//   ・min_price のみ → price = min_price（完全一致）
//   ・max_price のみ → price = max_price（完全一致）
//   ・どちらも空 → 絞り込みなし
//   ・sort=price_desc → 価格高い順、それ以外は価格安い順
func carsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		defer cancel()

		q := r.URL.Query()
		minPriceStr := strings.TrimSpace(q.Get("min_price"))
		maxPriceStr := strings.TrimSpace(q.Get("max_price"))
		sortParam := q.Get("sort") // "price_asc" or "price_desc"

		baseSQL := `
			SELECT id, model, price, year, created_at
			FROM cars
		`
		var whereConds []string
		var args []interface{}

		// min/max のパース
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
			hasMin = true
			min = v
		}

		if maxPriceStr != "" {
			v, err := strconv.Atoi(maxPriceStr)
			if err != nil {
				http.Error(w, "max_price must be integer", http.StatusBadRequest)
				return
			}
			hasMax = true
			max = v
		}

		// 条件組み立て
		switch {
		case hasMin && hasMax:
			// 範囲検索
			if min > max {
				// min > max の場合は入れ替え
				min, max = max, min
			}
			whereConds = append(whereConds, "price BETWEEN ? AND ?")
			args = append(args, min, max)

		case hasMin && !hasMax:
			// min のみ → 完全一致
			whereConds = append(whereConds, "price = ?")
			args = append(args, min)

		case !hasMin && hasMax:
			// max のみ → 完全一致
			whereConds = append(whereConds, "price = ?")
			args = append(args, max)

		default:
			// どちらも指定なし → 絞り込みなし
		}

		if len(whereConds) > 0 {
			baseSQL += " WHERE " + strings.Join(whereConds, " AND ")
		}

		// 並び順
		switch sortParam {
		case "price_desc":
			baseSQL += " ORDER BY price DESC"
		default:
			baseSQL += " ORDER BY price ASC" // デフォルトは安い順
		}

		rows, err := db.QueryContext(ctx, baseSQL, args...)
		if err != nil {
			http.Error(w, "failed to query cars", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var cars []Car
		for rows.Next() {
			var c Car
			if err := rows.Scan(&c.ID, &c.Model, &c.Price, &c.Year, &c.CreatedAt); err != nil {
				http.Error(w, "failed to scan row", http.StatusInternalServerError)
				return
			}
			cars = append(cars, c)
		}
		if err := rows.Err(); err != nil {
			http.Error(w, "rows error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(cars); err != nil {
			http.Error(w, "failed to encode json", http.StatusInternalServerError)
			return
		}
	}
}

// ===================== /cars/{id} 詳細取得 =====================

// GET /cars/{id}
func carDetailHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// パスから ID 部分だけを取り出す
		path := strings.TrimPrefix(r.URL.Path, "/cars/")
		idStr := strings.Trim(path, "/")
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

		row := db.QueryRowContext(
			ctx,
			`SELECT id, model, price, year, created_at
			 FROM cars
			 WHERE id = ?`,
			carID,
		)

		var c Car
		if err := row.Scan(&c.ID, &c.Model, &c.Price, &c.Year, &c.CreatedAt); err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "car not found", http.StatusNotFound)
				return
			}
			http.Error(w, "failed to query car", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(c); err != nil {
			http.Error(w, "failed to encode json", http.StatusInternalServerError)
			return
		}
	}
}
