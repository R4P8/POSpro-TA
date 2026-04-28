import { useState, useEffect } from 'react';
import type { WarehouseData, Tenant, WarehouseForm } from './types';
import {
  fetchRole,
  fetchTenants,
  fetchWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from './services';

const EMPTY_FORM: WarehouseForm = { name: '', location: '', tenant_id: 0 };

export function useGudang() {
  const [warehouses, setWarehouses]   = useState<WarehouseData[]>([]);
  const [tenants, setTenants]         = useState<Tenant[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState<WarehouseData | null>(null);
  const [form, setForm]               = useState<WarehouseForm>(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState<number | null>(null);

  // Cek role saat mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setRoleLoading(false); return; }

    fetchRole()
      .then(setRole)
      .catch(() => setRole(''))
      .finally(() => setRoleLoading(false));
  }, []);

  // Fetch data hanya untuk role yang diizinkan
  useEffect(() => {
    if (role === 'Owner' || role === 'Gudang') {
      loadData();
    }
  }, [role]);

  async function loadData() {
    const [tenantData] = await Promise.all([
      fetchTenants().catch(() => [] as Tenant[]),
      loadWarehouses(),
    ]);
    setTenants(tenantData);
  }

  async function loadWarehouses() {
    setLoading(true);
    setError(null);
    try {
      setWarehouses(await fetchWarehouses());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function getTenantName(id: number): string {
    return tenants.find((t) => t.id === id)?.business_name ?? `Tenant #${id}`;
  }

  function openCreate() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, tenant_id: tenants[0]?.id ?? 0 });
    setShowModal(true);
  }

  function openEdit(w: WarehouseData) {
    setEditTarget(w);
    setForm({ name: w.name, location: w.location, tenant_id: w.tenant_id });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.location.trim() || !form.tenant_id) return;
    setSaving(true);
    try {
      if (editTarget) {
        await updateWarehouse(editTarget.id, form);
      } else {
        await createWarehouse(form);
      }
      closeModal();
      loadWarehouses();
    } catch (e: any) {
      alert('Gagal menyimpan: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteWarehouse(id);
      setDeleteId(null);
      loadWarehouses();
    } catch (e: any) {
      alert('Gagal menghapus: ' + e.message);
    }
  }

  return {
    warehouses,
    tenants,
    loading,
    error,
    role,
    roleLoading,
    showModal,
    editTarget,
    form,
    setForm,
    saving,
    deleteId,
    setDeleteId,
    getTenantName,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
    loadWarehouses,
  };
}