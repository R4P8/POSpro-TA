package entity

import "time"

type ProductStockHistory struct {
	CreatedAt    time.Time `json:"created_at"`
	Name         string    `json:"name"`
	Stock        int64     `json:"stock"`
	MinimumStock int64     `json:"minimum_stock"`
	IsActive     bool      `json:"is_active"`
}
