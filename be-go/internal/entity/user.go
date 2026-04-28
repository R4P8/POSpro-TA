package entity

import "time"

type User struct {
	ID_User     int64      `json:"id_user"`
	TenantID    int64      `json:"tenant_id"`
	FullName    string     `json:"full_name"`
	Email       string     `json:"email"`
	Password    string     `json:"password,omitempty"`
	Role        string     `json:"role"`
	Status      string     `json:"status"`
	LastLoginAt *time.Time `json:"last_login_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
