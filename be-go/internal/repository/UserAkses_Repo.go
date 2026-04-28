package repository

import (
	"context"
	"database/sql"

	"Be-ManagementProduct/internal/entity"
)

type userAksesRepositoryImpl struct {
	db *sql.DB
}

func NewUserAksesRepository(db *sql.DB) UserAksesRepository {
	return &userAksesRepositoryImpl{db: db}
}

func (r *userAksesRepositoryImpl) Create(ctx context.Context, user *entity.User) error {
	query := `
		INSERT INTO users (full_name, email, password, role, status, created_at, updated_at)
		VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
		RETURNING id_user
	`

	return r.db.QueryRowContext(ctx, query,
		user.FullName,
		user.Email,
		user.Password,
		user.Role,
		user.Status,
	).Scan(&user.ID_User)
}

func (r *userAksesRepositoryImpl) FindAll(ctx context.Context) ([]entity.User, error) {
	query := `
		SELECT id_user, full_name, email, role, status, created_at, updated_at
		FROM users
		ORDER BY id_user ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []entity.User

	for rows.Next() {
		var user entity.User
		err := rows.Scan(
			&user.ID_User,
			&user.FullName,
			&user.Email,
			&user.Role,
			&user.Status,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}

func (r *userAksesRepositoryImpl) FindByID(ctx context.Context, id int64) (*entity.User, error) {
	query := `
		SELECT id_user, full_name, email, role, status, created_at, updated_at
		FROM users
		WHERE id_user = $1
	`

	var user entity.User

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID_User,
		&user.FullName,
		&user.Email,
		&user.Role,
		&user.Status,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userAksesRepositoryImpl) Update(ctx context.Context, user *entity.User) error {
	query := `
		UPDATE users
		SET full_name=$1, email=$2, role=$3, status=$4, updated_at=NOW()
		WHERE id_user=$5
	`

	_, err := r.db.ExecContext(ctx, query,
		user.FullName,
		user.Email,
		user.Role,
		user.Status,
		user.ID_User,
	)

	return err
}
