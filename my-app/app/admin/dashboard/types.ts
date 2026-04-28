export interface TransactionReport {
  invoice_number: string;
  created_at:     string;
  quantity:       number;
  total_amount:   number;
  full_name:      string;
  status:         string;
}

export interface BestSellerProduct {
  name:     string;
  stock:    number;
  quantity: number;
  price:    number;
}

export interface CriticalStockProduct {
  name:          string;
  stock:         number;
  minimum_stock: number;
}

export interface StatCard {
  title:      string;
  value:      string;
  change:     string;
  isPositive: boolean;
  icon:       React.ElementType;
  color:      string;
}