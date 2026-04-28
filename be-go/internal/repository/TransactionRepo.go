package repository

import (
	"context"
	"database/sql"

	"Be-ManagementProduct/internal/entity"
)

type transactionRepositoryImpl struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) TransactionRepository {
	return &transactionRepositoryImpl{db: db}
}

func (r *transactionRepositoryImpl) Create(ctx context.Context, trx *entity.Transaction) error {

	query := `
		INSERT INTO transactions 
		(id_warehouse, id_user, invoice_number, total_amount, payment_method, created_at)
		VALUES ($1,$2,$3,$4,$5,NOW())
		RETURNING id_transaction, created_at
	`

	return r.db.QueryRowContext(ctx, query,
		trx.IDWarehouse,
		trx.IDUser,
		trx.InvoiceNumber,
		trx.TotalAmount,
		trx.PaymentMethod,
	).Scan(
		&trx.IDTransaction,
		&trx.CreatedAt,
	)
}

func (r *transactionRepositoryImpl) FindAll(ctx context.Context) ([]entity.Transaction, error) {

	query := `
		SELECT id_transaction, id_warehouse, id_user, invoice_number, total_amount, payment_method, created_at
		FROM transactions
		ORDER BY id_transaction ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []entity.Transaction

	for rows.Next() {
		var trx entity.Transaction

		err := rows.Scan(
			&trx.IDTransaction,
			&trx.IDWarehouse,
			&trx.IDUser,
			&trx.InvoiceNumber,
			&trx.TotalAmount,
			&trx.PaymentMethod,
			&trx.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		transactions = append(transactions, trx)
	}

	return transactions, nil
}

func (r *transactionRepositoryImpl) FindByID(ctx context.Context, id int64) (*entity.Transaction, error) {

	query := `
		SELECT id_transaction, id_warehouse, id_user, invoice_number, total_amount, payment_method, created_at
		FROM transactions
		WHERE id_transaction = $1
	`

	var trx entity.Transaction

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&trx.IDTransaction,
		&trx.IDWarehouse,
		&trx.IDUser,
		&trx.InvoiceNumber,
		&trx.TotalAmount,
		&trx.PaymentMethod,
		&trx.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &trx, nil
}

func (r *transactionRepositoryImpl) CreateTx(ctx context.Context, tx *sql.Tx, trx *entity.Transaction) error {

	query := `
        INSERT INTO transactions
        (id_warehouse, id_user, invoice_number, total_amount, payment_method, created_at)
        VALUES ($1,$2,$3,$4,$5,NOW())
        RETURNING id_transaction, created_at
    `

	return tx.QueryRowContext(ctx, query,
		trx.IDWarehouse,
		trx.IDUser,
		trx.InvoiceNumber,
		trx.TotalAmount,
		trx.PaymentMethod,
	).Scan(
		&trx.IDTransaction,
		&trx.CreatedAt,
	)
}

func (r *transactionRepositoryImpl) FindCashierTransactions(ctx context.Context) ([]entity.TransactionReport, error) {

	query := `
		SELECT 
			t.invoice_number,
			t.created_at,
			ti.quantity,
			t.total_amount,
			u.full_name,
			t.status
		FROM transactions t
		INNER JOIN transaction_items ti 
			ON t.id_transaction = ti.id_transaction
		INNER JOIN users u 
			ON t.id_user = u.id_user
		WHERE u.role = 'Kasir'
		ORDER BY t.created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reports []entity.TransactionReport

	for rows.Next() {
		var report entity.TransactionReport

		err := rows.Scan(
			&report.InvoiceNumber,
			&report.CreatedAt,
			&report.Quantity,
			&report.TotalAmount,
			&report.FullName,
			&report.Status,
		)
		if err != nil {
			return nil, err
		}

		reports = append(reports, report)
	}

	return reports, nil
}

func (r *transactionRepositoryImpl) GetSalesPerDay(ctx context.Context) ([]entity.SalesPerDay, error) {
	query := `
        SELECT 
            t.created_at,
            ti.quantity,
            ti.price
        FROM transactions t
        INNER JOIN transaction_items ti 
            ON t.id_transaction = ti.id_transaction
        ORDER BY t.created_at DESC
    `
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sales []entity.SalesPerDay

	for rows.Next() {
		var s entity.SalesPerDay

		err := rows.Scan(
			&s.CreatedAt,
			&s.Quantity,
			&s.Price,
		)
		if err != nil {
			return nil, err
		}

		// hitung total
		s.Total = float64(s.Quantity) * s.Price

		sales = append(sales, s)
	}

	return sales, nil
}
