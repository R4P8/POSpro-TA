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
  created_at?: string;
  updated_at?: string;
  user_insert?: number;
  user_update?: number;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface ProductForm {
  name: string;
  sku: string;
  id_warehouse: number;
  price_buy: number;
  price_sell: number;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
  user_insert: number;
  user_update: number;
}