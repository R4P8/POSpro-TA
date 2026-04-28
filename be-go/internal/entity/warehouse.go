package entity

import "time"

type Warehouse struct {
	IDWarehouse int64     `json:"id"`
	ID_Tenant   int64     `json:"tenant_id"`
	Name        string    `json:"name"`
	Location    string    `json:"location"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
}
