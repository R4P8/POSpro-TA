package repository

import (
	"Be-ManagementProduct/internal/entity"
	"context"
)

type UserAksesRepository interface {
	Create(ctx context.Context, user *entity.User) error
	FindAll(ctx context.Context) ([]entity.User, error)
	FindByID(ctx context.Context, id int64) (*entity.User, error)
	Update(ctx context.Context, user *entity.User) error
}
