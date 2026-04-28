package entity

import "time"

type StocksLog struct {
	ID_Stock_Log    int64     `json:"id"`
	IDWarehouse     int64     `json:"id_warehouse"`
	ID_Product      int64     `json:"id_product"`
	ID_User         int64     `json:"id_user"`
	Type            string    `json:"type"`
	Quantity_Change int64     `json:"quantity_change"`
	Note            string    `json:"note"`
	CreatedAt       time.Time `json:"created_at,omitempty"`
}
