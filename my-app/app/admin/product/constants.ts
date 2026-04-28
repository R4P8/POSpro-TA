import type { ProductForm } from './types';

export const EMPTY_FORM: ProductForm = {
  name: '',
  sku: '',
  id_warehouse: 0,
  price_buy: 0,
  price_sell: 0,
  stock: 0,
  minimum_stock: 0,
  is_active: true,
  user_insert: 0,
  user_update: 0,
};