package repository

import (
	"Be-ManagementProduct/internal/entity"
	"context"
	"database/sql"
)

type tenantRepository struct {
	db *sql.DB
}

func NewTenantRepository(db *sql.DB) TenantRepository {
	return &tenantRepository{db: db}
}

func (r *tenantRepository) Create(ctx context.Context, tenant *entity.Tenant) error {

	query := `
		INSERT INTO tenants 
		(business_name, status, alamat, karyawan, created_at)
		VALUES ($1,$2,$3,$4,NOW())
		RETURNING id_tenant
	`

	return r.db.QueryRowContext(
		ctx,
		query,
		tenant.BusinessName,
		tenant.Status,
		tenant.Alamat,
		tenant.Karyawan,
	).Scan(&tenant.IDTenant)
}

func (r *tenantRepository) FindByID(ctx context.Context, id int64) (*entity.Tenant, error) {

	query := `
		SELECT id_tenant, business_name, status, alamat, karyawan 
		FROM tenants
		WHERE id_tenant = $1
	`

	row := r.db.QueryRowContext(ctx, query, id)

	var tenant entity.Tenant

	err := row.Scan(
		&tenant.IDTenant,
		&tenant.BusinessName,
		&tenant.Status,
		&tenant.Alamat,
		&tenant.Karyawan,
	)

	if err != nil {
		return nil, err
	}

	return &tenant, nil
}

func (r *tenantRepository) FindAll(ctx context.Context) ([]*entity.Tenant, error) {

	query := `
		SELECT id_tenant, business_name, status, alamat, karyawan
		FROM tenants
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tenants []*entity.Tenant

	for rows.Next() {
		var tenant entity.Tenant

		err := rows.Scan(
			&tenant.IDTenant,
			&tenant.BusinessName,
			&tenant.Status,
			&tenant.Alamat,
			&tenant.Karyawan,
		)
		if err != nil {
			return nil, err
		}

		tenants = append(tenants, &tenant)
	}

	return tenants, nil
}

func (r *tenantRepository) Update(ctx context.Context, tenant *entity.Tenant) error {

	query := `
		UPDATE tenants
		SET business_name=$1, status=$2, alamat=$3, karyawan=$4, updated_at=NOW()
		WHERE id_tenant=$5
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		tenant.BusinessName,
		tenant.Status,
		tenant.Alamat,
		tenant.Karyawan,
		tenant.IDTenant,
	)

	return err
}

func (r *tenantRepository) Delete(ctx context.Context, id int64) error {

	query := `DELETE FROM tenants WHERE id_tenant = $1`

	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
