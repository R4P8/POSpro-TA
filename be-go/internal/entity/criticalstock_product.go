package entity

type CriticalStockProduct struct {
	Name         string `json:"name"`
	Stock        int64  `json:"stock"`
	MinimumStock int64  `json:"minimum_stock"`
}