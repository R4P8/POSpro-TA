package repository

import (
	"Be-ManagementProduct/internal/entity"
	"context"
	"database/sql"
)

type TransactionRepository interface {
	Create(ctx context.Context, trx *entity.Transaction) error
	CreateTx(ctx context.Context, tx *sql.Tx, trx *entity.Transaction) error
	FindAll(ctx context.Context) ([]entity.Transaction, error)
	FindByID(ctx context.Context, id int64) (*entity.Transaction, error)
	FindCashierTransactions(ctx context.Context) ([]entity.TransactionReport, error)
	GetSalesPerDay(ctx context.Context) ([]entity.SalesPerDay, error)
}
