package repository

import (
	"context"
	"database/sql"
	"errors"

	"Be-ManagementProduct/internal/entity"
)

type productRepositoryImpl struct {
	db *sql.DB
}

func NewProductRepository(db *sql.DB) ProductRepository {
	return &productRepositoryImpl{db: db}
}

func (r *productRepositoryImpl) Create(ctx context.Context, product *entity.Product) error {

	query := `
		INSERT INTO products 
		(id_warehouse, name, sku, price_buy, price_sell, stock, minimum_stock, is_active, created_at, user_insert)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9)
		RETURNING id_product, created_at
	`

	return r.db.QueryRowContext(ctx, query,
		product.IDWarehouse,
		product.Name,
		product.Sku,
		product.PriceBuy,
		product.PriceSell,
		product.Stock,
		product.MinimumStock,
		product.IsActive,
		product.UserInsert,
	).Scan(
		&product.ID_Product,
		&product.CreatedAt,
	)
}

func (r *productRepositoryImpl) FindAll(ctx context.Context) ([]entity.Product, error) {

	query := `
		SELECT id_product, id_warehouse, name, sku, price_buy, price_sell, stock, minimum_stock, is_active, created_at, updated_at
		FROM products
		ORDER BY id_product ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []entity.Product

	for rows.Next() {
		var product entity.Product

		err := rows.Scan(
			&product.ID_Product,
			&product.IDWarehouse,
			&product.Name,
			&product.Sku,
			&product.PriceBuy,
			&product.PriceSell,
			&product.Stock,
			&product.MinimumStock,
			&product.IsActive,
			&product.CreatedAt,
			&product.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		products = append(products, product)
	}

	return products, nil
}

func (r *productRepositoryImpl) FindByID(ctx context.Context, id int64) (*entity.Product, error) {

	query := `
		SELECT id_product, id_warehouse, name, sku, price_buy, price_sell, stock, minimum_stock, is_active, created_at, updated_at
		FROM products
		WHERE id_product = $1
	`

	var product entity.Product

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&product.ID_Product,
		&product.IDWarehouse,
		&product.Name,
		&product.Sku,
		&product.PriceBuy,
		&product.PriceSell,
		&product.Stock,
		&product.MinimumStock,
		&product.IsActive,
		&product.CreatedAt,
		&product.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (r *productRepositoryImpl) Update(ctx context.Context, product *entity.Product) error {

	query := `
		UPDATE products
		SET name=$1,
		    sku=$2,
		    price_buy=$3,
		    price_sell=$4,
		    stock=$5,
		    minimum_stock=$6,
		    is_active=$7,
		    updated_at=NOW(),
		    user_update=$8
		WHERE id_product=$9
		RETURNING updated_at
	`

	return r.db.QueryRowContext(ctx, query,
		product.Name,
		product.Sku,
		product.PriceBuy,
		product.PriceSell,
		product.Stock,
		product.MinimumStock,
		product.IsActive,
		product.UserUpdate,
		product.ID_Product,
	).Scan(&product.UpdatedAt)
}

func (r *productRepositoryImpl) Delete(ctx context.Context, id int64) error {

	query := `DELETE FROM products WHERE id_product = $1`

	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

func (r *productRepositoryImpl) UpdateStockTx(ctx context.Context, tx *sql.Tx, productID int64, qty int, isOut bool) error {

	var query string

	if isOut {
		query = `
            UPDATE products
            SET stock = stock - $1,
                updated_at = NOW()
            WHERE id_product = $2
              AND stock >= $1
        `
	} else {
		query = `
            UPDATE products
            SET stock = stock + $1,
                updated_at = NOW()
            WHERE id_product = $2
        `
	}

	result, err := tx.ExecContext(ctx, query, qty, productID)
	if err != nil {
		return err
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return errors.New("insufficient stock")
	}

	return nil
}

func (r *productRepositoryImpl) FindBestSeller(ctx context.Context) ([]entity.BestSellerProduct, error) {

	query := `
		SELECT p.name, p.stock, SUM(ti.quantity) as quantity, ti.price
		FROM products p
		JOIN transaction_items ti ON p.id_product = ti.id_product
		GROUP BY p.name, p.stock, ti.price
		ORDER BY quantity DESC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []entity.BestSellerProduct

	for rows.Next() {
		var p entity.BestSellerProduct

		err := rows.Scan(
			&p.Name,
			&p.Stock,
			&p.Quantity,
			&p.Price,
		)
		if err != nil {
			return nil, err
		}

		products = append(products, p)
	}

	return products, nil
}

func (r *productRepositoryImpl) FindCriticalStock(ctx context.Context) ([]entity.CriticalStockProduct, error) {

	query := `
		SELECT name, stock, minimum_stock
		FROM products
		WHERE stock <= minimum_stock
		ORDER BY stock ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []entity.CriticalStockProduct

	for rows.Next() {
		var p entity.CriticalStockProduct

		err := rows.Scan(
			&p.Name,
			&p.Stock,
			&p.MinimumStock,
		)
		if err != nil {
			return nil, err
		}

		products = append(products, p)
	}

	return products, nil
}

func (r *productRepositoryImpl) FindSalesPerProduct(ctx context.Context) ([]entity.BestSellerProduct, error) {

	query := `
		SELECT p.name, ti.quantity, ti.price
		FROM products p
		JOIN transaction_items ti ON p.id_product = ti.id_product
		ORDER BY p.name ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reports []entity.BestSellerProduct

	for rows.Next() {
		var r entity.BestSellerProduct

		err := rows.Scan(
			&r.Name,
			&r.Quantity,
			&r.Price,
		)
		if err != nil {
			return nil, err
		}

		reports = append(reports, r)
	}

	return reports, nil
}

func (r *productRepositoryImpl) GetStockHistory(ctx context.Context) ([]entity.ProductStockHistory, error) {
	query := `
        SELECT 
            p.created_at,
            p.name,
            p.stock,
            p.minimum_stock,
            p.is_active
        FROM products p
        ORDER BY p.created_at DESC
    `

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var histories []entity.ProductStockHistory

	for rows.Next() {
		var h entity.ProductStockHistory

		err := rows.Scan(
			&h.CreatedAt,
			&h.Name,
			&h.Stock,
			&h.MinimumStock,
			&h.IsActive,
		)
		if err != nil {
			return nil, err
		}

		histories = append(histories, h)
	}

	return histories, nil
}
