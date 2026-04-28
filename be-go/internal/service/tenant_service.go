package service

import (
	"context"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
)

type TenantService interface {
	Create(ctx context.Context, tenant *entity.Tenant) error
	GetByID(ctx context.Context, id int64) (*entity.Tenant, error)
	GetAll(ctx context.Context) ([]*entity.Tenant, error)
	Update(ctx context.Context, tenant *entity.Tenant) error
	Delete(ctx context.Context, id int64) error
}

type tenantService struct {
	tenantRepo repository.TenantRepository
}

func NewTenantService(tenantRepo repository.TenantRepository) TenantService {
	return &tenantService{tenantRepo: tenantRepo}
}

func (s *tenantService) Create(ctx context.Context, tenant *entity.Tenant) error {
	return s.tenantRepo.Create(ctx, tenant)
}

func (s *tenantService) GetByID(ctx context.Context, id int64) (*entity.Tenant, error) {
	return s.tenantRepo.FindByID(ctx, id)
}

func (s *tenantService) GetAll(ctx context.Context) ([]*entity.Tenant, error) {
	return s.tenantRepo.FindAll(ctx)
}

func (s *tenantService) Update(ctx context.Context, tenant *entity.Tenant) error {
	return s.tenantRepo.Update(ctx, tenant)
}

func (s *tenantService) Delete(ctx context.Context, id int64) error {
	return s.tenantRepo.Delete(ctx, id)
}
