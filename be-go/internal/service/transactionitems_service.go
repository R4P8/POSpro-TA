package service

import (
	"context"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
)

type TransactionItemsService interface {
	Create(ctx context.Context, item *entity.TransactionItems) error
	GetByID(ctx context.Context, id int64) (*entity.TransactionItems, error)
	GetAll(ctx context.Context) ([]entity.TransactionItems, error)
	GetByTransactionID(ctx context.Context, transactionID int64) ([]entity.TransactionItems, error)
	Update(ctx context.Context, item *entity.TransactionItems) error
}

type transactionItemsService struct {
	repo repository.TransactionItemsRepository
}

func NewTransactionItemsService(repo repository.TransactionItemsRepository) TransactionItemsService {
	return &transactionItemsService{repo: repo}
}

func (s *transactionItemsService) Create(ctx context.Context, item *entity.TransactionItems) error {
	// Optional: auto calculate subtotal
	item.Subtotal = float64(item.Quantity) * item.Price
	return s.repo.Create(ctx, item)
}

func (s *transactionItemsService) GetByID(ctx context.Context, id int64) (*entity.TransactionItems, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *transactionItemsService) GetAll(ctx context.Context) ([]entity.TransactionItems, error) {
	return s.repo.FindAll(ctx)
}

func (s *transactionItemsService) GetByTransactionID(ctx context.Context, transactionID int64) ([]entity.TransactionItems, error) {
	return s.repo.FindByTransactionID(ctx, transactionID)
}

func (s *transactionItemsService) Update(ctx context.Context, item *entity.TransactionItems) error {
	item.Subtotal = float64(item.Quantity) * item.Price
	return s.repo.Update(ctx, item)
}
