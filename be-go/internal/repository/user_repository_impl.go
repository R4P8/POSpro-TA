package repository

import (
	"context"
	"database/sql"
	"time"

	"Be-ManagementProduct/internal/entity"
)

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *entity.User) error {
	query := `
		INSERT INTO users 
		(full_name, email, password, role, created_at, updated_at)
		VALUES ($1,$2,$3,$4,NOW(),NOW())
		RETURNING id_user
	`
	return r.db.QueryRowContext(
		ctx,
		query,
		user.FullName,
		user.Email,
		user.Password,
		user.Role,
	).Scan(&user.ID_User)
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	query := `
		SELECT id_user, full_name, role, email, password, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	row := r.db.QueryRowContext(ctx, query, email)

	var user entity.User
	err := row.Scan(
		&user.ID_User,
		&user.FullName,
		&user.Role,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepository) UpdateLastLogin(ctx context.Context, userID int64, lastLogin time.Time) error {
	query := `
		UPDATE users 
		SET last_login_at = $1, updated_at = NOW()
		WHERE id_user = $2
	`

	_, err := r.db.ExecContext(ctx, query, lastLogin, userID)
	return err
}

func (r *userRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	query := `SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)`

	var exists bool
	err := r.db.QueryRowContext(ctx, query, email).Scan(&exists)
	return exists, err
}

func (r *userRepository) FindByID(ctx context.Context, id int64) (*entity.User, error) {
	query := `
		SELECT id_user, full_name, role, email, password, created_at, updated_at
		FROM users
		WHERE id_user = $1
	`

	var user entity.User

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID_User,
		&user.FullName,
		&user.Role,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *entity.User) (*entity.User, error) {
	query := `
		UPDATE users
		SET full_name=$1, email=$2, password=$3, updated_at=NOW()
		WHERE id_user=$4
		RETURNING id_user, full_name, role, email, password, created_at, updated_at
	`

	var updatedUser entity.User

	err := r.db.QueryRowContext(ctx, query,
		user.FullName,
		user.Email,
		user.Password,
		user.ID_User,
	).Scan(
		&updatedUser.ID_User,
		&updatedUser.FullName,
		&updatedUser.Role,
		&updatedUser.Email,
		&updatedUser.Password,
		&updatedUser.CreatedAt,
		&updatedUser.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &updatedUser, nil
}

func (r *userRepository) Delete(ctx context.Context, id int64) (*entity.User, error) {

	// Ambil data dulu
	user, err := r.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	query := `DELETE FROM users WHERE id_user=$1`
	_, err = r.db.ExecContext(ctx, query, id)
	if err != nil {
		return nil, err
	}

	return user, nil
}
