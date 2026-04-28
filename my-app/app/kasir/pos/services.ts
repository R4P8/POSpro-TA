import { API_BASE, getAuthHeaders, getUserId, generateInvoice } from './utils';
import type { Product, Warehouse, CartItem, TransactionPayload, TransactionItemPayload } from './Types';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/Api/product`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return (data ?? []).filter((p: Product) => p.is_active);
}

export async function fetchWarehouses(): Promise<Warehouse[]> {
  const res = await fetch(`${API_BASE}/Api/warehouses`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/** Returns the generated invoice number so the caller can show it in the success modal. */
export async function submitCheckout(
  cart: CartItem[],
  subtotal: number,
  paymentMethod: string,
  selectedWarehouse: number,
): Promise<string> {
  const invoice     = generateInvoice();
  const userId      = getUserId();
  const warehouseId = selectedWarehouse > 0 ? selectedWarehouse : cart[0]?.id_warehouse ?? 0;

  // 1 — Create transaction header
  const txRes = await fetch(`${API_BASE}/Api/transaction`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      id_warehouse:   warehouseId,
      id_user:        userId,
      invoice_number: invoice,
      total_amount:   subtotal,
      payment_method: paymentMethod,
    } as TransactionPayload),
  });
  if (!txRes.ok) throw new Error(`Transaksi gagal: HTTP ${txRes.status}`);
  const { id: transactionId } = await txRes.json() as { id: number };

  // 2 — Save line items
  await Promise.all(cart.map(item =>
    fetch(`${API_BASE}/Api/transaction-items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id_transaction: transactionId,
        id_product:     item.id,
        quantity:       item.qty,
        price:          item.price_sell,
        subtotal:       item.price_sell * item.qty,
      } as TransactionItemPayload),
    }),
  ));

  // 3 — Stock-out logs
  await Promise.all(cart.map(item =>
    fetch(`${API_BASE}/Api/stocks-logs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id_warehouse:    item.id_warehouse,
        id_product:      item.id,
        id_user:         userId,
        type:            'out',
        quantity_change: item.qty,
        note:            `POS Sale - ${invoice}`,
      }),
    }),
  ));

  // 4 — Decrement product stock in DB
  await Promise.all(cart.map(item =>
    fetch(`${API_BASE}/Api/product/${item.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id_warehouse:  item.id_warehouse,
        name:          item.name,
        sku:           item.sku,
        price_buy:     item.price_buy,
        price_sell:    item.price_sell,
        stock:         Math.max(0, item.stock - item.qty),
        minimum_stock: item.minimum_stock,
        is_active:     item.is_active,
        user_insert:   item.user_insert ?? userId,
        user_update:   userId,
      }),
    }),
  ));

  return invoice;
}