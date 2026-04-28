package entity

import "time"

type Transaction struct {
	IDTransaction int64     `json:"id"`
	IDWarehouse   int64     `json:"id_warehouse"`
	IDUser        int64     `json:"id_user"`
	InvoiceNumber string    `json:"invoice_number"`
	TotalAmount   float64   `json:"total_amount"`
	PaymentMethod string    `json:"payment_method"`
	CreatedAt     time.Time `json:"created_at,omitempty"`
}
