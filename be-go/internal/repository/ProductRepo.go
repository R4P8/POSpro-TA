package repository

import (
	"Be-ManagementProduct/internal/entity"
	"context"
)

type ProductRepository interface {
	Create(ctx context.Context, product *entity.Product) error
	FindAll(ctx context.Context) ([]entity.Product, error)
	FindByID(ctx context.Context, id int64) (*entity.Product, error)
	Update(ctx context.Context, product *entity.Product) error
	Delete(ctx context.Context, id int64) error

	FindBestSeller(ctx context.Context) ([]entity.BestSellerProduct, error)
	FindCriticalStock(ctx context.Context) ([]entity.CriticalStockProduct, error)
	FindSalesPerProduct(ctx context.Context) ([]entity.BestSellerProduct, error)
	GetStockHistory(ctx context.Context) ([]entity.ProductStockHistory, error)
}
