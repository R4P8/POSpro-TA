package repository

import (
	"context"
	"time"

	"Be-ManagementProduct/internal/entity"
)

type UserRepository interface {
	Create(ctx context.Context, user *entity.User) error
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	UpdateLastLogin(ctx context.Context, userID int64, lastLogin time.Time) error
	ExistsByEmail(ctx context.Context, email string) (bool, error)

	FindByID(ctx context.Context, id int64) (*entity.User, error)
	Update(ctx context.Context, user *entity.User) (*entity.User, error)
	Delete(ctx context.Context, id int64) (*entity.User, error)
}
