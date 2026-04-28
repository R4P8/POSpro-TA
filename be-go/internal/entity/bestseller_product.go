package entity

type BestSellerProduct struct {
	Name     string  `json:"name"`
	Stock    int64   `json:"stock,omitempty"`
	Quantity int64   `json:"quantity"`
	Price    float64 `json:"price"`
}
