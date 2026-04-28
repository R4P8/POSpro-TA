export interface Product {
  id: number;
  id_warehouse: number;
  name: string;
  sku: string;
  price_buy: number;
  price_sell: number;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
  user_insert?: number;
  user_update?: number;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface TransactionPayload {
  id_warehouse:   number;
  id_user:        number;
  invoice_number: string;
  total_amount:   number;
  payment_method: string;
}

export interface TransactionItemPayload {
  id_transaction: number;
  id_product:     number;
  quantity:       number;
  price:          number;
  subtotal:       number;
}

export interface SuccessData {
  invoice: string;
  total:   number;
  method:  string;
  change:  number;
}