package repository

import (
	"context"

	"Be-ManagementProduct/internal/entity"
)

type TransactionItemsRepository interface {
	Create(ctx context.Context, item *entity.TransactionItems) error
	FindAll(ctx context.Context) ([]entity.TransactionItems, error)
	FindByID(ctx context.Context, id int64) (*entity.TransactionItems, error)
	FindByTransactionID(ctx context.Context, transactionID int64) ([]entity.TransactionItems, error)
	Update(ctx context.Context, item *entity.TransactionItems) error
}
