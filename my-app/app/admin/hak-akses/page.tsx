'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, Edit2, Trash2, X, Check, 
  UserPlus, Eye, EyeOff, RefreshCw, Menu, ShieldX
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id_user: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
}

const blankUserForm = { 
  fullname: '', email: '', password: '', confirmPassword: '', role: '', status: 'active' 
};

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
const authHeader = () => ({ 
  'Authorization': `Bearer ${getToken()}`, 
  'Content-Type': 'application/json',
});

const initials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'Owner':  return { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', dot: 'bg-purple-400' };
    case 'Kasir':  return { color: 'bg-green-500/20 text-green-400 border-green-500/30',   dot: 'bg-green-400' };
    case 'Gudang': return { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' };
    default:       return { color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',       dot: 'bg-zinc-400' };
  }
};

// ─── Forbidden Page ───────────────────────────────────────────────────────────
function ForbiddenPage({ role }: { role: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center border border-red-500/20">
            <ShieldX className="w-12 h-12 text-red-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Halaman <span className="text-white font-semibold">Manajemen Pengguna</span> hanya dapat diakses oleh{' '}
            <span className="text-purple-400 font-semibold">Owner</span>.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg">
            <span className="text-xs text-zinc-500">Role Anda:</span>
            <span className="text-xs font-semibold text-orange-400 capitalize">{role}</span>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-semibold transition-all text-white text-sm"
        >
          Kembali ke Dashboard
        </button>
        <p className="text-zinc-700 text-xs">Hubungi Owner jika Anda membutuhkan akses ke halaman ini.</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HakAksesPage() {
  const [users, setUsers]               = useState<User[]>([]);
  const [loading, setLoading]           = useState(false);
  const [apiError, setApiError]         = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const [role, setRole]                 = useState<string | null>(null);
  const [roleLoading, setRoleLoading]   = useState(true);

  type ModalMode = 'create-user' | 'edit-user' | 'delete-user' | null;
  const [modalMode, setModalMode]       = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm]         = useState(blankUserForm);
  const [formError, setFormError]       = useState('');
  const [saving, setSaving]             = useState(false);
  const [showPw, setShowPw]             = useState(false);
  const [showCpw, setShowCpw]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableRoles = ['Owner', 'Kasir', 'Gudang'];

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ─── Fetch users ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${API}/Api/users`, { headers: authHeader() });
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || 'Gagal mengambil data pengguna');
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Cek role ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setRoleLoading(false); return; }

    fetch(`${API}/Api/profile`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setRole(data?.role ?? ''))
      .catch(() => setRole(''))
      .finally(() => setRoleLoading(false));
  }, []);

  // ─── Fetch users hanya kalau Owner ────────────────────────────────────────
  useEffect(() => {
    if (role === 'Owner') fetchUsers();
  }, [role, fetchUsers]);

  // ─── Modal helpers ────────────────────────────────────────────────────────
  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setFormError('');
    setShowPw(false);
    setShowCpw(false);
  };

  const openCreateUser = () => {
    setUserForm(blankUserForm);
    setFormError('');
    setSelectedUser(null);
    setModalMode('create-user');
    setMobileMenuOpen(false);
  };

  const openEditUser = (u: User) => {
    setSelectedUser(u);
    setUserForm({ fullname: u.full_name, email: u.email, password: '', confirmPassword: '', role: u.role, status: u.status });
    setFormError('');
    setModalMode('edit-user');
  };

  const openDeleteUser = (u: User) => {
    setSelectedUser(u);
    setModalMode('delete-user');
  };

  // ─── Save user ────────────────────────────────────────────────────────────
  const handleSaveUser = async () => {
    if (!userForm.fullname.trim())                              { setFormError('Nama lengkap harus diisi'); return; }
    if (!userForm.email.trim())                                 { setFormError('Email harus diisi'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email))   { setFormError('Format email tidak valid'); return; }
    if (modalMode === 'create-user') {
      if (!userForm.password)                                   { setFormError('Password harus diisi'); return; }
      if (userForm.password.length < 8)                        { setFormError('Password minimal 8 karakter'); return; }
      if (userForm.password !== userForm.confirmPassword)       { setFormError('Password tidak cocok'); return; }
    }
    if (!userForm.role)                                         { setFormError('Role harus dipilih'); return; }

    setSaving(true);
    setFormError('');
    try {
      const payload: Record<string, any> = {
        FullName: userForm.fullname.trim(),
        Email:    userForm.email.trim(),
        Role:     userForm.role,
        Status:   userForm.status,
      };
      if (modalMode === 'create-user') payload.Password = userForm.password;

      const res = await fetch(
        modalMode === 'create-user'
          ? `${API}/Api/register`
          : `${API}/Api/profile/${selectedUser!.id_user}`,
        { method: modalMode === 'create-user' ? 'POST' : 'PUT', headers: authHeader(), body: JSON.stringify(payload) }
      );

      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || 'Gagal menyimpan data');
      }

      showSuccess(modalMode === 'create-user' ? 'Pengguna berhasil ditambahkan' : 'Pengguna berhasil diupdate');
      closeModal();
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete user ──────────────────────────────────────────────────────────
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/Api/profile/${selectedUser.id_user}`, {
        method: 'DELETE',
        headers: authHeader(),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}
        throw new Error(msg || 'Gagal menghapus pengguna');
      }
      setUsers(prev => prev.filter(u => u.id_user !== selectedUser.id_user));
      showSuccess('Pengguna berhasil dihapus');
      closeModal();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Sub-components ───────────────────────────────────────────────────────
  const UserRow = ({ user }: { user: User }) => {
    const badge = getRoleBadge(user.role);
    return (
      <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {initials(user.full_name)}
            </div>
            <span className="font-medium text-sm">{user.full_name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-zinc-400 text-sm">{user.email}</td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${badge.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
            user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'
          }`}>
            {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <button onClick={() => openEditUser(user)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4 text-blue-400" />
            </button>
            <button onClick={() => openDeleteUser(user)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const UserCard = ({ user }: { user: User }) => {
    const badge = getRoleBadge(user.role);
    return (
      <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {initials(user.full_name)}
            </div>
            <div>
              <h3 className="font-medium text-sm">{user.full_name}</h3>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEditUser(user)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4 text-blue-400" />
            </button>
            <button onClick={() => openDeleteUser(user)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {user.role}
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'
          }`}>
            {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
      </div>
    );
  };

  // ─── Guards ───────────────────────────────────────────────────────────────
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  if (role !== 'Owner') return <ForbiddenPage role={role ?? 'unknown'} />;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 overflow-auto">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                  Manajemen Pengguna
                </h1>
                <p className="text-zinc-400 text-sm mt-1 hidden sm:block">Kelola data pengguna dan hak akses</p>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden sm:flex gap-2">
              <button onClick={fetchUsers} disabled={loading} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={openCreateUser} className="px-4 sm:px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Tambah Pengguna
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="sm:hidden flex flex-col gap-2 pt-4 border-t border-zinc-800">
                <button onClick={fetchUsers} disabled={loading} className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors flex items-center gap-2 justify-center">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
                <button onClick={openCreateUser} className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors flex items-center gap-2 justify-center">
                  <UserPlus className="w-5 h-5" /> Tambah Pengguna
                </button>
              </div>
            )}
          </div>
          <p className="text-zinc-400 text-sm mt-2 sm:hidden">Kelola data pengguna dan hak akses</p>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {apiError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span><span>{apiError}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" /><span>{successMsg}</span>
            </div>
          )}

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <RefreshCw className="w-8 h-8 text-zinc-600 animate-spin" />
                <p className="text-zinc-500">Memuat data pengguna...</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-left text-sm text-zinc-500">
                        <th className="px-6 py-4 font-medium">Pengguna</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Role</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center">
                            <UserPlus className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
                            <p className="text-zinc-500 mb-3">Belum ada pengguna</p>
                            <button onClick={openCreateUser} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-sm font-semibold transition-colors">
                              Tambah Pengguna
                            </button>
                          </td>
                        </tr>
                      ) : users.map(user => <UserRow key={user.id_user} user={user} />)}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3 p-4">
                  {users.length === 0 ? (
                    <div className="py-12 text-center">
                      <UserPlus className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
                      <p className="text-zinc-500 text-sm mb-3">Belum ada pengguna</p>
                      <button onClick={openCreateUser} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-sm font-semibold transition-colors">
                        Tambah Pengguna
                      </button>
                    </div>
                  ) : users.map(user => <UserCard key={user.id_user} user={user} />)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal Create/Edit */}
        {(modalMode === 'create-user' || modalMode === 'edit-user') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-zinc-800" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-zinc-900 flex items-center justify-between px-6 py-5 border-b border-zinc-800">
                <h2 className="text-xl font-bold">
                  {modalMode === 'create-user' ? 'Tambah Pengguna Baru' : `Edit — ${selectedUser?.full_name}`}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-zinc-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{formError}</div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Nama Lengkap <span className="text-red-400">*</span></label>
                  <input type="text" value={userForm.fullname}
                    onChange={e => { setUserForm(p => ({ ...p, fullname: e.target.value })); setFormError(''); }}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                    placeholder="John Doe" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email <span className="text-red-400">*</span></label>
                  <input type="email" value={userForm.email}
                    onChange={e => { setUserForm(p => ({ ...p, email: e.target.value })); setFormError(''); }}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                    placeholder="john@pospro.com" />
                </div>

                {modalMode === 'create-user' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input type={showPw ? 'text' : 'password'} value={userForm.password}
                          onChange={e => { setUserForm(p => ({ ...p, password: e.target.value })); setFormError(''); }}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 pr-12 text-sm"
                          placeholder="Min. 8 karakter" />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                          {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Konfirmasi Password <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <input type={showCpw ? 'text' : 'password'} value={userForm.confirmPassword}
                          onChange={e => { setUserForm(p => ({ ...p, confirmPassword: e.target.value })); setFormError(''); }}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 pr-12 text-sm"
                          placeholder="Ulangi password" />
                        <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                          {showCpw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Role <span className="text-red-400">*</span></label>
                  <select value={userForm.role}
                    onChange={e => { setUserForm(p => ({ ...p, role: e.target.value })); setFormError(''); }}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 text-sm">
                    <option value="">Pilih Role</option>
                    {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <div className="flex gap-6">
                    {[{ val: 'active', label: 'Aktif' }, { val: 'inactive', label: 'Nonaktif' }].map(s => (
                      <label key={s.val} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={s.val} checked={userForm.status === s.val}
                          onChange={e => setUserForm(p => ({ ...p, status: e.target.value }))}
                          className="w-4 h-4 accent-purple-500" />
                        <span className="text-sm">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-zinc-900 flex gap-3 px-6 py-4 border-t border-zinc-800">
                <button onClick={closeModal} disabled={saving} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold disabled:opacity-50">
                  Batal
                </button>
                <button onClick={handleSaveUser} disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create-user' ? 'Tambah' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Delete */}
        {modalMode === 'delete-user' && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-zinc-900 rounded-2xl p-6 max-w-sm w-full border border-zinc-800" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Konfirmasi Hapus</h2>
              <p className="text-zinc-400 text-center text-sm mb-6">
                Pengguna <span className="text-white font-semibold">"{selectedUser.full_name}"</span> akan dihapus permanen.
              </p>
              <div className="flex gap-3">
                <button onClick={closeModal} disabled={saving} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold disabled:opacity-50">
                  Batal
                </button>
                <button onClick={handleDeleteUser} disabled={saving} className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}