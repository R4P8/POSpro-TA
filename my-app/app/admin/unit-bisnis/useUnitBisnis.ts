import { useState, useEffect } from 'react';
import type { UnitBisnis, UnitBisnisForm } from './types';
import { fetchRole, fetchUnits, createUnit, updateUnit, deleteUnit } from './services';

const EMPTY_FORM: UnitBisnisForm = {
  business_name: '',
  alamat: '',
  karyawan: 0,
  status: 'active',
};

function useFlashMessage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function flash(type: 'error' | 'success', msg: string) {
    if (type === 'error') {
      setError(msg);
      setTimeout(() => setError(''), 3000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3000);
    }
  }

  return { error, success, flash };
}

export function useUnitBisnis() {
  const [units, setUnits]             = useState<UnitBisnis[]>([]);
  const [loading, setLoading]         = useState(true);
  const [role, setRole]               = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitBisnis | null>(null);
  const [form, setForm]               = useState<UnitBisnisForm>(EMPTY_FORM);
  const { error, success, flash }     = useFlashMessage();

  // Cek role saat mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setRoleLoading(false); return; }

    fetchRole()
      .then(setRole)
      .catch(() => setRole(''))
      .finally(() => setRoleLoading(false));
  }, []);

  // Fetch units hanya jika Owner
  useEffect(() => {
    if (role === 'Owner') loadUnits();
  }, [role]);

  async function loadUnits() {
    setLoading(true);
    try {
      setUnits(await fetchUnits());
    } catch (e: any) {
      flash('error', e.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setEditingUnit(null);
    setShowModal(true);
  }

  function openEditModal(unit: UnitBisnis) {
    setEditingUnit(unit);
    setForm({
      business_name: unit.business_name,
      alamat: unit.alamat,
      karyawan: unit.karyawan,
      status: unit.status,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingUnit(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingUnit) {
        await updateUnit(editingUnit.id, form);
        flash('success', 'Unit bisnis berhasil diupdate');
      } else {
        await createUnit(form);
        flash('success', 'Unit bisnis berhasil ditambahkan');
      }
      closeModal();
      loadUnits();
    } catch (e: any) {
      flash('error', e.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Yakin ingin menghapus unit bisnis ini?')) return;
    try {
      await deleteUnit(id);
      flash('success', 'Unit bisnis berhasil dihapus');
      loadUnits();
    } catch (e: any) {
      flash('error', e.message);
    }
  }

  return {
    units,
    loading,
    role,
    roleLoading,
    showModal,
    editingUnit,
    form,
    setForm,
    error,
    success,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}