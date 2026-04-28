package entity

import "time"

type Product struct {
	ID_Product   int64     `json:"id"`
	IDWarehouse  int64     `json:"id_warehouse"`
	Name         string    `json:"name"`
	Sku          string    `json:"sku"`
	PriceBuy     float64   `json:"price_buy"`
	PriceSell    float64   `json:"price_sell"`
	Stock        int       `json:"stock"`
	MinimumStock int       `json:"minimum_stock"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
	UpdatedAt    time.Time `json:"updated_at,omitempty"`
	UserInsert   int       `json:"user_insert"`
	UserUpdate   int       `json:"user_update"`
}
