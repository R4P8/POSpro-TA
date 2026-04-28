package service

import (
	"context"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
)

type WarehouseService interface {
	Create(ctx context.Context, warehouse *entity.Warehouse) error
	GetAll(ctx context.Context) ([]entity.Warehouse, error)
	GetByID(ctx context.Context, id int64) (*entity.Warehouse, error)
	Update(ctx context.Context, warehouse *entity.Warehouse) error
	Delete(ctx context.Context, id int64) error
}

type warehouseService struct {
	repo repository.WarehouseRepository
}

func NewWarehouseService(repo repository.WarehouseRepository) WarehouseService {
	return &warehouseService{repo: repo}
}

func (s *warehouseService) Create(ctx context.Context, warehouse *entity.Warehouse) error {
	return s.repo.Create(ctx, warehouse)
}

func (s *warehouseService) GetAll(ctx context.Context) ([]entity.Warehouse, error) {
	return s.repo.FindAll(ctx)
}

func (s *warehouseService) GetByID(ctx context.Context, id int64) (*entity.Warehouse, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *warehouseService) Update(ctx context.Context, warehouse *entity.Warehouse) error {
	return s.repo.Update(ctx, warehouse)
}

func (s *warehouseService) Delete(ctx context.Context, id int64) error {
	return s.repo.Delete(ctx, id)
}
