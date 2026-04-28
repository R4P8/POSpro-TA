package service

import (
	"context"
	"errors"
	"time"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/repository"
	"Be-ManagementProduct/pkg/helpers"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Register(ctx context.Context, user *entity.User) error
	Login(ctx context.Context, email, password string) (*entity.User, string, error)

	GetProfile(ctx context.Context, userID int64) (*entity.User, error)
	UpdateProfile(ctx context.Context, user *entity.User) (*entity.User, error)
	DeleteAccount(ctx context.Context, userID int64) (*entity.User, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetProfile(ctx context.Context, userID int64) (*entity.User, error) {
	return s.userRepo.FindByID(ctx, userID)
}

func (s *userService) Register(ctx context.Context, user *entity.User) error {

	exist, err := s.userRepo.ExistsByEmail(ctx, user.Email)
	if err != nil {
		return err
	}
	if exist {
		return errors.New("email already registered")
	}

	// Validasi role di layer service (lebih aman)
	if user.Role != "Gudang" && user.Role != "Kasir" {
		return errors.New("invalid role")
	}

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

	return s.userRepo.Create(ctx, user)
}

func (s *userService) Login(ctx context.Context, email, password string) (*entity.User, string, error) {

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	token, err := helpers.GenerateJWT(user)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *userService) UpdateProfile(ctx context.Context, user *entity.User) (*entity.User, error) {

	user.UpdatedAt = time.Now()

	// kalau user ubah password → hash ulang
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(user.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return nil, err
		}
		user.Password = string(hashedPassword)
	}

	return s.userRepo.Update(ctx, user)
}

func (s *userService) DeleteAccount(ctx context.Context, userID int64) (*entity.User, error) {
	return s.userRepo.Delete(ctx, userID)
}
