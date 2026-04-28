package repository

import (
	"context"
	"database/sql"

	"Be-ManagementProduct/internal/entity"
)

type transactionItemsRepositoryImpl struct {
	db *sql.DB
}

func NewTransactionItemsRepository(db *sql.DB) TransactionItemsRepository {
	return &transactionItemsRepositoryImpl{db: db}
}

func (r *transactionItemsRepositoryImpl) Create(ctx context.Context, item *entity.TransactionItems) error {

	query := `
		INSERT INTO transaction_items
		(id_transaction, id_product, quantity, price, subtotal)
		VALUES ($1,$2,$3,$4,$5)
		RETURNING id_transaction_item
	`

	return r.db.QueryRowContext(ctx, query,
		item.IDTransaction,
		item.IDProduct,
		item.Quantity,
		item.Price,
		item.Subtotal,
	).Scan(&item.IDTransactionItem)
}

func (r *transactionItemsRepositoryImpl) FindAll(ctx context.Context) ([]entity.TransactionItems, error) {

	query := `
		SELECT id_transaction_item, id_transaction, id_product, quantity, price, subtotal
		FROM transaction_items
		ORDER BY id_transaction_item ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []entity.TransactionItems

	for rows.Next() {
		var item entity.TransactionItems

		err := rows.Scan(
			&item.IDTransactionItem,
			&item.IDTransaction,
			&item.IDProduct,
			&item.Quantity,
			&item.Price,
			&item.Subtotal,
		)
		if err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	return items, nil
}

func (r *transactionItemsRepositoryImpl) FindByID(ctx context.Context, id int64) (*entity.TransactionItems, error) {

	query := `
		SELECT id_transaction_item, id_transaction, id_product, quantity, price, subtotal
		FROM transaction_items
		WHERE id_transaction_item = $1
	`

	var item entity.TransactionItems

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&item.IDTransactionItem,
		&item.IDTransaction,
		&item.IDProduct,
		&item.Quantity,
		&item.Price,
		&item.Subtotal,
	)

	if err != nil {
		return nil, err
	}

	return &item, nil
}

func (r *transactionItemsRepositoryImpl) FindByTransactionID(ctx context.Context, transactionID int64) ([]entity.TransactionItems, error) {

	query := `
		SELECT id_transaction_item, id_transaction, id_product, quantity, price, subtotal
		FROM transaction_items
		WHERE id_transaction = $1
	`

	rows, err := r.db.QueryContext(ctx, query, transactionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []entity.TransactionItems

	for rows.Next() {
		var item entity.TransactionItems

		err := rows.Scan(
			&item.IDTransactionItem,
			&item.IDTransaction,
			&item.IDProduct,
			&item.Quantity,
			&item.Price,
			&item.Subtotal,
		)
		if err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	return items, nil
}

func (r *transactionItemsRepositoryImpl) Update(ctx context.Context, item *entity.TransactionItems) error {

	query := `
		UPDATE transaction_items
		SET id_product=$1,
		    quantity=$2,
		    price=$3,
		    subtotal=$4
		WHERE id_transaction_item=$5
	`

	_, err := r.db.ExecContext(ctx, query,
		item.IDProduct,
		item.Quantity,
		item.Price,
		item.Subtotal,
		item.IDTransactionItem,
	)

	return err
}
