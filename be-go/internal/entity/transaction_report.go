package entity

import "time"

type TransactionReport struct {
	InvoiceNumber string    `json:"invoice_number"`
	CreatedAt     time.Time `json:"created_at"`
	Quantity      int64     `json:"quantity"`
	TotalAmount   float64   `json:"total_amount"`
	FullName      string    `json:"full_name"`
	Status        string    `json:"status"`
}