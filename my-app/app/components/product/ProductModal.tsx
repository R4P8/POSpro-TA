'use client';

import { X, ChevronDown } from 'lucide-react';
import type { Warehouse, ProductForm } from '@/app/admin/product/types';

interface ProductModalProps {
  isEdit: boolean;
  form: ProductForm;
  warehouses: Warehouse[];
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (updated: ProductForm) => void;
}

const INPUT =
  'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500';

export default function ProductModal({
  isEdit,
  form,
  warehouses,
  saving,
  onClose,
  onSave,
  onChange,
}: ProductModalProps) {
  const set = (patch: Partial<ProductForm>) => onChange({ ...form, ...patch });
  const isValid = form.name.trim() && form.sku.trim() && !!form.id_warehouse;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Warehouse */}
          <div>
            <label className="block text-xs sm:text-sm text-zinc-400 mb-1">
              Gudang <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={form.id_warehouse}
                onChange={(e) => set({ id_warehouse: Number(e.target.value) })}
                className={`${INPUT} appearance-none pr-10`}
              >
                <option value={0} disabled>-- Pilih Gudang --</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Name + SKU */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm text-zinc-400 mb-1">
                Nama Produk <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Kopi Arabica"
                className={INPUT}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-zinc-400 mb-1">
                SKU <span className="text-red-400">*</span>
              </label>
              <input
                value={form.sku}
                onChange={(e) => set({ sku: e.target.value })}
                placeholder="KOP-001"
                className={INPUT}
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Harga Beli (Rp)</label>
              <input type="number" min="0" value={form.price_buy}
                onChange={(e) => set({ price_buy: Number(e.target.value) })} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Harga Jual (Rp)</label>
              <input type="number" min="0" value={form.price_sell}
                onChange={(e) => set({ price_sell: Number(e.target.value) })} className={INPUT} />
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Stok</label>
              <input type="number" min="0" value={form.stock}
                onChange={(e) => set({ stock: Number(e.target.value) })} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-zinc-400 mb-1">Stok Minimum</label>
              <input type="number" min="0" value={form.minimum_stock}
                onChange={(e) => set({ minimum_stock: Number(e.target.value) })} className={INPUT} />
            </div>
          </div>

          {/* Toggle active */}
          <div className="flex items-center justify-between bg-zinc-800/60 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium">Status Produk</p>
              <p className="text-xs text-zinc-500">Produk aktif akan tampil di sistem</p>
            </div>
            <button
              type="button"
              onClick={() => set({ is_active: !form.is_active })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-purple-600' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm">
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || !isValid}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}