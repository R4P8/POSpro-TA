import type { Product } from '@/app/admin/product/types';

export type { Product };

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