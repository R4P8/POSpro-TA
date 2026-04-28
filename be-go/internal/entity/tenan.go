package entity

import "time"

type Tenant struct {
	IDTenant     int64     `json:"id"`
	BusinessName string    `json:"business_name"`
	Status       string    `json:"status"`
	Alamat       string    `json:"alamat"`
	Karyawan     int64     `json:"karyawan"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
	UpdatedAt    time.Time `json:"updated_at,omitempty"`
}
