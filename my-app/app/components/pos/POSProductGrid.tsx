'use client';

import { Search, RefreshCw, ShoppingCart, Package } from 'lucide-react';
import type { Product } from '@/app/admin/product/types';
import type { CartItem } from '@/app/admin/pos/types';

interface POSProductGridProps {
  products: Product[];
  warehouses: { id: number; name: string }[];
  cart: CartItem[];
  loading: boolean;
  search: string;
  selectedWarehouse: number;
  readOnly: boolean;
  totalQty: number;
  subtotal: number;
  onSearchChange: (v: string) => void;
  onWarehouseChange: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onRefresh: () => void;
  onOpenCart: () => void;
}

export default function POSProductGrid({
  products,
  warehouses,
  cart,
  loading,
  search,
  selectedWarehouse,
  readOnly,
  totalQty,
  subtotal,
  onSearchChange,
  onWarehouseChange,
  onAddToCart,
  onRefresh,
  onOpenCart,
}: POSProductGridProps) {
  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 p-3 sm:p-4 border-b border-zinc-800 flex-shrink-0">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Warehouse filter */}
        {warehouses.length > 0 && (
          <select
            value={selectedWarehouse}
            onChange={(e) => onWarehouseChange(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 text-white hidden sm:block"
          >
            <option value={0}>Semua Gudang</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        )}

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        {/* Mobile cart button */}
        <button
          onClick={onOpenCart}
          className="md:hidden relative p-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {loading && (
          <div className="flex items-center justify-center h-48 text-zinc-500 gap-3">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Memuat produk...</span>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-600 gap-2">
            <Package className="w-10 h-10" />
            <p className="text-sm">Produk tidak ditemukan</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {products.map((p) => {
              const inCart = cart.find((c) => c.id === p.id)?.qty ?? 0;
              return (
                <button
                  key={p.id}
                  onClick={() => !readOnly && onAddToCart(p)}
                  disabled={readOnly || p.stock === 0}
                  className={`relative flex flex-col p-3 rounded-xl border text-left transition-all ${
                    p.stock === 0
                      ? 'border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed'
                      : readOnly
                      ? 'border-zinc-800 bg-zinc-900 cursor-not-allowed'
                      : 'border-zinc-800 bg-zinc-900 hover:border-purple-500/50 hover:bg-zinc-800 active:scale-95'
                  }`}
                >
                  {inCart > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                      {inCart}
                    </span>
                  )}
                  <p className="font-medium text-sm leading-tight line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-purple-400 font-bold text-sm mt-auto">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price_sell)}
                  </p>
                  <p className={`text-xs mt-0.5 ${p.stock <= 5 ? 'text-orange-400' : 'text-zinc-500'}`}>
                    Stok: {p.stock}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}