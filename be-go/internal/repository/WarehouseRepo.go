package repository

import (
	"context"

	"Be-ManagementProduct/internal/entity"
)

type WarehouseRepository interface {
	Create(ctx context.Context, warehouse *entity.Warehouse) error
	FindAll(ctx context.Context) ([]entity.Warehouse, error)
	FindByID(ctx context.Context, id int64) (*entity.Warehouse, error)
	Update(ctx context.Context, warehouse *entity.Warehouse) error
	Delete(ctx context.Context, id int64) error
}
