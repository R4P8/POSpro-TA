package repository

import (
	"context"
	"database/sql"

	"Be-ManagementProduct/internal/entity"
)

type warehouseRepositoryImpl struct {
	db *sql.DB
}

func NewWarehouseRepository(db *sql.DB) WarehouseRepository {
	return &warehouseRepositoryImpl{db: db}
}

func (r *warehouseRepositoryImpl) Create(ctx context.Context, warehouse *entity.Warehouse) error {

	query := `
		INSERT INTO warehouses (id_tenant, name, location, created_at)
		VALUES ($1,$2,$3,NOW())
		RETURNING id_warehouse, created_at
	`

	return r.db.QueryRowContext(ctx, query,
		warehouse.ID_Tenant,
		warehouse.Name,
		warehouse.Location,
	).Scan(
		&warehouse.IDWarehouse,
		&warehouse.CreatedAt,
	)
}

func (r *warehouseRepositoryImpl) FindAll(ctx context.Context) ([]entity.Warehouse, error) {

	query := `
		SELECT id_warehouse, id_tenant, name, location
		FROM warehouses
		ORDER BY id_warehouse ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var warehouses []entity.Warehouse

	for rows.Next() {
		var warehouse entity.Warehouse

		err := rows.Scan(
			&warehouse.IDWarehouse,
			&warehouse.ID_Tenant,
			&warehouse.Name,
			&warehouse.Location,
		)
		if err != nil {
			return nil, err
		}

		warehouses = append(warehouses, warehouse)
	}

	return warehouses, nil
}

func (r *warehouseRepositoryImpl) FindByID(ctx context.Context, id int64) (*entity.Warehouse, error) {

	query := `
		SELECT id_warehouse, id_tenant, name, location
		FROM warehouses
		WHERE id_warehouse = $1
	`

	var warehouse entity.Warehouse

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&warehouse.IDWarehouse,
		&warehouse.ID_Tenant,
		&warehouse.Name,
		&warehouse.Location,
	)

	if err != nil {
		return nil, err
	}

	return &warehouse, nil
}

func (r *warehouseRepositoryImpl) Update(ctx context.Context, warehouse *entity.Warehouse) error {

	query := `
		UPDATE warehouses
		SET name=$1,
		    location=$2,
		    updated_at=NOW()
		WHERE id_warehouse=$3
		RETURNING updated_at
	`

	return r.db.QueryRowContext(ctx, query,
		warehouse.Name,
		warehouse.Location,
		warehouse.IDWarehouse,
	).Scan(&warehouse.UpdatedAt)
}

func (r *warehouseRepositoryImpl) Delete(ctx context.Context, id int64) error {

	query := `DELETE FROM warehouses WHERE id_warehouse = $1`

	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
