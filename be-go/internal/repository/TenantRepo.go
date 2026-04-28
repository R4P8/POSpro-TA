package repository

import (
	"Be-ManagementProduct/internal/entity"
	"context"
)

type TenantRepository interface {
	Create(ctx context.Context, tenant *entity.Tenant) error
	FindByID(ctx context.Context, id int64) (*entity.Tenant, error)
	FindAll(ctx context.Context) ([]*entity.Tenant, error)
	Update(ctx context.Context, tenant *entity.Tenant) error
	Delete(ctx context.Context, id int64) error
}
