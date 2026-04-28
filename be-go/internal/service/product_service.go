package service

import (
	"context"
	"errors"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
)

type ProductService interface {
	Create(ctx context.Context, product *entity.Product) error
	GetByID(ctx context.Context, id int64) (*entity.Product, error)
	GetAll(ctx context.Context) ([]entity.Product, error)
	Update(ctx context.Context, product *entity.Product) error
	Delete(ctx context.Context, id int64) error
	FindBestSeller(ctx context.Context) ([]entity.BestSellerProduct, error)
	FindCriticalStock(ctx context.Context) ([]entity.CriticalStockProduct, error)
	FindSalesPerProduct(ctx context.Context) ([]entity.BestSellerProduct, error)
	GetStockHistory(ctx context.Context) ([]entity.ProductStockHistory, error)
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) Create(ctx context.Context, product *entity.Product) error {

	if product.Name == "" {
		return errors.New("product name is required")
	}

	return s.repo.Create(ctx, product)
}

func (s *productService) GetByID(ctx context.Context, id int64) (*entity.Product, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *productService) GetAll(ctx context.Context) ([]entity.Product, error) {
	return s.repo.FindAll(ctx)
}

func (s *productService) Update(ctx context.Context, product *entity.Product) error {
	return s.repo.Update(ctx, product)
}

func (s *productService) Delete(ctx context.Context, id int64) error {
	return s.repo.Delete(ctx, id)
}

func (s *productService) FindBestSeller(ctx context.Context) ([]entity.BestSellerProduct, error) {
	return s.repo.FindBestSeller(ctx)
}

func (s *productService) FindCriticalStock(ctx context.Context) ([]entity.CriticalStockProduct, error) {
	return s.repo.FindCriticalStock(ctx)
}

func (s *productService) FindSalesPerProduct(ctx context.Context) ([]entity.BestSellerProduct, error) {
	return s.repo.FindSalesPerProduct(ctx)
}

func (s *productService) GetStockHistory(ctx context.Context) ([]entity.ProductStockHistory, error) {
	return s.repo.GetStockHistory(ctx)
}
