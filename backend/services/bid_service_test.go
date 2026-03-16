package services_test

import (
	"app/models"
	"app/services"
	"context"
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

type mockBidRepo struct{}

func (m *mockBidRepo) CreateBidTx(_ context.Context, _ *sql.Tx, _ models.BidRequest) error {
	return nil
}

type mockCarRepo struct{}

func (m *mockCarRepo) ExistsByID(_ context.Context, _ int64) (bool, error) {
	return true, nil
}

func TestCreateBid_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock の初期化に失敗しました: %v", err)
	}
	defer db.Close()

	mock.ExpectBegin()
	mock.ExpectCommit()

	svc := services.NewBidService(db, &mockBidRepo{}, &mockCarRepo{})

	req := models.BidRequest{
		CarID:     1,
		Amount:    10000,
		Bidder:    "田中太郎",
		RequestID: "req-001",
	}

	if err := svc.CreateBid(context.Background(), req); err != nil {
		t.Errorf("予期しないエラーが発生しました: %v", err)
	}
	
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("トランザクションが正しく完了しませんでした: %v", err)
	}
}