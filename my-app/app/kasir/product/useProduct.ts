'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchWarehouses } from './services';
import type { Product, Warehouse } from './services';

export function useProduct() {
  // ─── Role ─────────────────────────────────────────────────────────────────
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    setRoleLoading(false);
  }, []);

  const canEdit = false; // kasir hanya view-only

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
    loadWarehouses();
    loadProducts();
  }, [loadProducts, loadWarehouses]);

  const getWarehouseName = (id: number) =>
    warehouses.find(w => w.id === id)?.name ?? `Gudang #${id}`;

  return {
    roleLoading, canEdit,
    products, loading, error,
    getWarehouseName, loadProducts,
  };
}