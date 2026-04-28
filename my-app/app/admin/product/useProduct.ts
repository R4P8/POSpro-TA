'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchWarehouses, saveProduct, deleteProduct } from './services';
import { EMPTY_FORM } from './constants';
import type { Product, Warehouse, ProductForm } from './types';

export function useProduct() {
  // ─── Auth / role ──────────────────────────────────────────────────────────
  const [role, setRole]               = useState<string | null>(null);
  const [userId, setUserId]           = useState(0);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') ?? '');
    setUserId(Number(localStorage.getItem('userId') ?? 0));
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
    warehouses.find((w) => w.id === id)?.name ?? `Gudang #${id}`;

  // ─── Modal ────────────────────────────────────────────────────────────────
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm]             = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const openCreate = () => {
    if (!canEdit) return;
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, id_warehouse: warehouses[0]?.id ?? 0, user_insert: userId, user_update: userId });
    setShowModal(true);
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
      user_insert:   p.user_insert ?? userId,
      user_update:   userId,
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
    // state
    products, warehouses, loading, error, roleLoading, canEdit,
    showModal, editTarget, form, setForm, saving,
    deleteId, setDeleteId, mobileMenuOpen, setMobileMenuOpen,
    // actions
    openCreate, openEdit, closeModal, handleSave, handleDelete,
    loadProducts, getWarehouseName,
  };
}