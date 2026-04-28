package repository

import (
	"context"
	"database/sql"

	"Be-ManagementProduct/internal/entity"
)

type stocksLogRepositoryImpl struct {
	db *sql.DB
}

func NewStocksLogRepository(db *sql.DB) StocksLogRepository {
	return &stocksLogRepositoryImpl{db: db}
}

func (r *stocksLogRepositoryImpl) Create(ctx context.Context, log *entity.StocksLog) error {

	query := `
		INSERT INTO stock_logs
		(id_warehouse, id_product, id_user, type, quantity_change, note, created_at)
		VALUES ($1,$2,$3,$4,$5,$6,NOW())
		RETURNING id_stock_log, created_at
	`

	return r.db.QueryRowContext(ctx, query,
		log.IDWarehouse,
		log.ID_Product,
		log.ID_User,
		log.Type,
		log.Quantity_Change,
		log.Note,
	).Scan(
		&log.ID_Stock_Log,
		&log.CreatedAt,
	)
}

func (r *stocksLogRepositoryImpl) FindAll(ctx context.Context) ([]entity.StocksLog, error) {

	query := `
		SELECT id_stock_log, id_warehouse, id_product, id_user,
		       type, quantity_change, note, created_at
		FROM stock_logs
		ORDER BY id_stock_log DESC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []entity.StocksLog

	for rows.Next() {
		var log entity.StocksLog

		err := rows.Scan(
			&log.ID_Stock_Log,
			&log.IDWarehouse,
			&log.ID_Product,
			&log.ID_User,
			&log.Type,
			&log.Quantity_Change,
			&log.Note,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		logs = append(logs, log)
	}

	return logs, nil
}

func (r *stocksLogRepositoryImpl) FindByID(ctx context.Context, id int64) (*entity.StocksLog, error) {

	query := `
		SELECT id_stock_log, id_warehouse, id_product, id_user,
		       type, quantity_change, note, created_at
		FROM stock_logs
		WHERE id_stock_log = $1
	`

	var log entity.StocksLog

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&log.ID_Stock_Log,
		&log.IDWarehouse,
		&log.ID_Product,
		&log.ID_User,
		&log.Type,
		&log.Quantity_Change,
		&log.Note,
		&log.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &log, nil
}

func (r *stocksLogRepositoryImpl) FindByProductID(ctx context.Context, productID int64) ([]entity.StocksLog, error) {

	query := `
		SELECT id_stock_log, id_warehouse, id_product, id_user,
		       type, quantity_change, note, created_at
		FROM stock_logs
		WHERE id_product = $1
		ORDER BY id_stock_log DESC
	`

	rows, err := r.db.QueryContext(ctx, query, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []entity.StocksLog

	for rows.Next() {
		var log entity.StocksLog

		err := rows.Scan(
			&log.ID_Stock_Log,
			&log.IDWarehouse,
			&log.ID_Product,
			&log.ID_User,
			&log.Type,
			&log.Quantity_Change,
			&log.Note,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		logs = append(logs, log)
	}

	return logs, nil
}

func (r *stocksLogRepositoryImpl) CreateTx(ctx context.Context, tx *sql.Tx, log *entity.StocksLog) error {
	query := `
		INSERT INTO stock_logs
		(id_warehouse, id_product, id_user, type, quantity_change, note, created_at)
		VALUES ($1,$2,$3,$4,$5,$6,NOW())
		RETURNING id_stock_log, created_at
	`

	return tx.QueryRowContext(ctx, query,
		log.IDWarehouse,
		log.ID_Product,
		log.ID_User,
		log.Type,
		log.Quantity_Change,
		log.Note,
	).Scan(
		&log.ID_Stock_Log,
		&log.CreatedAt,
	)
}
