package service

import (
	"context"
	"database/sql"
	"errors"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
)

type TransactionService interface {
	Create(ctx context.Context, trx *entity.Transaction) error
	GetByID(ctx context.Context, id int64) (*entity.Transaction, error)
	GetAll(ctx context.Context) ([]entity.Transaction, error)
	GetCashierTransactions(ctx context.Context) ([]entity.TransactionReport, error)
	GetSalesPerDay(ctx context.Context) ([]entity.SalesPerDay, error)
}

type transactionService struct {
	db   *sql.DB
	repo repository.TransactionRepository
}

func NewTransactionService(db *sql.DB, repo repository.TransactionRepository) TransactionService {
	return &transactionService{repo: repo, db: db}
}

func (s *transactionService) Create(ctx context.Context, trx *entity.Transaction) error {

	if trx.InvoiceNumber == "" {
		return errors.New("invoice number is required")
	}

	if trx.TotalAmount <= 0 {
		return errors.New("total amount must be greater than zero")
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := s.repo.CreateTx(ctx, tx, trx); err != nil {
		return err
	}

	return tx.Commit()
}

func (s *transactionService) GetByID(ctx context.Context, id int64) (*entity.Transaction, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *transactionService) GetAll(ctx context.Context) ([]entity.Transaction, error) {
	return s.repo.FindAll(ctx)
}

func (s *transactionService) GetCashierTransactions(ctx context.Context) ([]entity.TransactionReport, error) {
	return s.repo.FindCashierTransactions(ctx)
}

func (s *transactionService) GetSalesPerDay(ctx context.Context) ([]entity.SalesPerDay, error) {
	return s.repo.GetSalesPerDay(ctx)
}
