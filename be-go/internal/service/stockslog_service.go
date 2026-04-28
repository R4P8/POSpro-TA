package service

import (
	"context"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
)

type StocksLogService interface {
	Create(ctx context.Context, log *entity.StocksLog) error
	GetAll(ctx context.Context) ([]entity.StocksLog, error)
	GetByID(ctx context.Context, id int64) (*entity.StocksLog, error)
	GetByProductID(ctx context.Context, productID int64) ([]entity.StocksLog, error)
}

type stocksLogServiceImpl struct {
	repo repository.StocksLogRepository
}

func NewStocksLogService(repo repository.StocksLogRepository) StocksLogService {
	return &stocksLogServiceImpl{repo: repo}
}

func (s *stocksLogServiceImpl) Create(ctx context.Context, log *entity.StocksLog) error {

	// Validasi sederhana
	if log.Quantity_Change == 0 {
		return nil
	}

	return s.repo.Create(ctx, log)
}

func (s *stocksLogServiceImpl) GetAll(ctx context.Context) ([]entity.StocksLog, error) {
	return s.repo.FindAll(ctx)
}

func (s *stocksLogServiceImpl) GetByID(ctx context.Context, id int64) (*entity.StocksLog, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *stocksLogServiceImpl) GetByProductID(ctx context.Context, productID int64) ([]entity.StocksLog, error) {
	return s.repo.FindByProductID(ctx, productID)
}
