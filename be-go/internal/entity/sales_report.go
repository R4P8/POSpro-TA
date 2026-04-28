package entity

import "time"

type SalesPerDay struct {
	CreatedAt time.Time `json:"created_at"`
	Quantity  int64     `json:"quantity"`
	Price     float64   `json:"price"`
	Total     float64   `json:"total"`
}