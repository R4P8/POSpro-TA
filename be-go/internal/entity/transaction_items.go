package entity

type TransactionItems struct {
	IDTransactionItem int64   `json:"id"`
	IDTransaction     int64   `json:"id_transaction"`
	IDProduct         int64   `json:"id_product"`
	Quantity          int64   `json:"quantity"`
	Price             float64 `json:"price"`
	Subtotal          float64 `json:"subtotal"`
}
