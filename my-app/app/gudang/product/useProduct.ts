'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchWarehouses, saveProduct, deleteProduct } from './services';
import type { Product, Warehouse, ProductForm } from './services';

const EMPTY_FORM: ProductForm = {
  name: '',
  sku: '',
  id_warehouse: 0,
  price_buy: 0,
  price_sell: 0,
  stock: 0,
  minimum_stock: 0,
  is_active: true,
};

export function useProduct() {
  // ─── Role ─────────────────────────────────────────────────────────────────
  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') ?? '');
    setRoleLoading(false);
  }, []);

  const canEdit = role === 'Gudang';

  // ─── Data ─────────────────────────────────────────────────────────────────
  const [products, setProducts]     = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProducts(await fetchProducts());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWarehouses = useCallback(async () => {
    setWarehouses(await fetchWarehouses());
  }, []);

  useEffect(() => {
    if (role !== null) {
      loadWarehouses();
      loadProducts();
    }
  }, [role, loadProducts, loadWarehouses]);

  const getWarehouseName = (id: number) =>
    warehouses.find(w => w.id === id)?.name ?? `Gudang #${id}`;

  // ─── Modal ────────────────────────────────────────────────────────────────
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm]             = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const openCreate = () => {
    if (!canEdit) return;
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, id_warehouse: warehouses[0]?.id ?? 0 });
    setShowModal(true);
    setMobileMenuOpen(false);
  };

  const openEdit = (p: Product) => {
    if (!canEdit) return;
    setEditTarget(p);
    setForm({
      name:          p.name,
      sku:           p.sku,
      id_warehouse:  p.id_warehouse,
      price_buy:     p.price_buy,
      price_sell:    p.price_sell,
      stock:         p.stock,
      minimum_stock: p.minimum_stock,
      is_active:     p.is_active,
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = async () => {
    if (!canEdit || !form.name.trim() || !form.sku.trim() || !form.id_warehouse) return;
    setSaving(true);
    try {
      await saveProduct(form, editTarget?.id);
      setShowModal(false);
      loadProducts();
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!canEdit) return;
    try {
      await deleteProduct(id);
      setDeleteId(null);
      loadProducts();
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message);
    }
  };

  // ─── Mobile menu ──────────────────────────────────────────────────────────
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return {
    // role
    role, roleLoading, canEdit,
    // data
    products, warehouses, loading, error,
    // helpers
    getWarehouseName, loadProducts,
    // modal
    showModal, editTarget, form, setForm, saving,
    openCreate, openEdit, closeModal, handleSave,
    // delete
    deleteId, setDeleteId, handleDelete,
    // ui
    mobileMenuOpen, setMobileMenuOpen,
  };
}