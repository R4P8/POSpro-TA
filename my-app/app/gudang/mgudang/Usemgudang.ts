'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchWarehouses, fetchTenants, fetchRole, saveWarehouse, deleteWarehouse } from './services';
import type { WarehouseData, Tenant, WarehouseForm } from '@/app/admin/gudang/types';

const EMPTY_FORM: WarehouseForm = { name: '', location: '', tenant_id: 0 };

export function useMGudang() {
  // ─── Role ─────────────────────────────────────────────────────────────────
  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    fetchRole()
      .then(setRole)
      .finally(() => setRoleLoading(false));
  }, []);

  const canAccess = role === 'Owner' || role === 'Gudang';

  // ─── Data ─────────────────────────────────────────────────────────────────
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [tenants, setTenants]       = useState<Tenant[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const loadWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setWarehouses(await fetchWarehouses());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTenants = useCallback(async () => {
    setTenants(await fetchTenants());
  }, []);

  useEffect(() => {
    if (canAccess) {
      loadTenants();
      loadWarehouses();
    }
  }, [canAccess, loadTenants, loadWarehouses]);

  const getTenantName = (id: number) =>
    tenants.find(t => t.id === id)?.business_name ?? `Tenant #${id}`;

  // ─── Modal ────────────────────────────────────────────────────────────────
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState<WarehouseData | null>(null);
  const [form, setForm]             = useState<WarehouseForm>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, tenant_id: tenants[0]?.id ?? 0 });
    setShowModal(true);
  };

  const openEdit = (w: WarehouseData) => {
    setEditTarget(w);
    setForm({ name: w.name, location: w.location, tenant_id: w.tenant_id });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.location.trim() || !form.tenant_id) return;
    setSaving(true);
    try {
      await saveWarehouse(form, editTarget?.id);
      setShowModal(false);
      loadWarehouses();
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteWarehouse(id);
      setDeleteId(null);
      loadWarehouses();
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message);
    }
  };

  return {
    // role
    role, roleLoading, canAccess,
    // data
    warehouses, tenants, loading, error,
    // helpers
    getTenantName, loadWarehouses,
    // modal
    showModal, editTarget, form, setForm, saving,
    openCreate, openEdit, closeModal, handleSave,
    // delete
    deleteId, setDeleteId, handleDelete,
  };
}