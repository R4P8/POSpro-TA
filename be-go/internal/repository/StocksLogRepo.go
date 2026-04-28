package repository

import (
	"context"

	"Be-ManagementProduct/internal/entity"
)

type StocksLogRepository interface {
	Create(ctx context.Context, log *entity.StocksLog) error
	FindAll(ctx context.Context) ([]entity.StocksLog, error)
	FindByID(ctx context.Context, id int64) (*entity.StocksLog, error)
	FindByProductID(ctx context.Context, productID int64) ([]entity.StocksLog, error)
}
