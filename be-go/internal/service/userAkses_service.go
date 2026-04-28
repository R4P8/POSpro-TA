package service

import (
	"context"
	"strings"
	"time"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserAksesService interface {
	Create(ctx context.Context, user *entity.User) error
	GetAll(ctx context.Context) ([]entity.User, error)
	GetByID(ctx context.Context, id int64) (*entity.User, error)
	Update(ctx context.Context, user *entity.User) error
}

type userAksesService struct {
	repo repository.UserAksesRepository
}

func NewUserAksesService(repo repository.UserAksesRepository) UserAksesService {
	return &userAksesService{repo: repo}
}

func (s *userAksesService) Create(ctx context.Context, user *entity.User) error {

	//  HASH PASSWORD
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	return s.repo.Create(ctx, user)
}

func (s *userAksesService) GetAll(ctx context.Context) ([]entity.User, error) {
	return s.repo.FindAll(ctx)
}

func (s *userAksesService) GetByID(ctx context.Context, id int64) (*entity.User, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *userAksesService) Update(ctx context.Context, user *entity.User) error {
	user.UpdatedAt = time.Now()

	// Hash hanya kalau password baru (belum di-hash)
	// Password lama yang sudah di-hash tidak perlu di-hash ulang
	if user.Password != "" && !strings.HasPrefix(user.Password, "$2a$") {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashed)
	}

	return s.repo.Update(ctx, user)
}
