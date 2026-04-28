'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Edit, Save, X } from 'lucide-react';

interface UserProfile {
  id_user: number;
  tenant_id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getUserId(): string {
  return typeof window !== 'undefined' ? (localStorage.getItem('user_id') ?? '') : '';
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ full_name: '', email: '' });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/Api/profile`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: UserProfile = await res.json();
      setProfile(data);
      setForm({ full_name: data.full_name, email: data.email });
    } catch {
      try {
        const userId = getUserId();
        const res = await fetch(`${API_BASE}/Api/profile/${userId}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error();
        const data: UserProfile = await res.json();
        setProfile(data);
        setForm({ full_name: data.full_name, email: data.email });
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/Api/profile/${profile.id_user}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated: UserProfile = await res.json();
      setProfile(updated);
      setForm({ full_name: updated.full_name, email: updated.email });
      setIsEditing(false);
      setSuccess('Profil berhasil diperbarui');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError('Gagal menyimpan: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) setForm({ full_name: profile.full_name, email: profile.email });
    setIsEditing(false);
    setError('');
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <User className="w-7 h-7 text-purple-400" />
              Account
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Kelola informasi akun Anda</p>
          </div>
          {!loading && profile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors text-sm font-semibold"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profil</span>
            </button>
          )}
        </div>
      </header>

      <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{success}</div>
        )}

        {loading && (
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-zinc-800" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-zinc-800 rounded-lg w-40" />
                <div className="h-4 bg-zinc-800 rounded-lg w-24" />
              </div>
            </div>
          </div>
        )}

        {!loading && profile && (
          <>
            {/* Avatar + info */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-6 border border-zinc-800/50">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {getInitials(profile.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold truncate">{profile.full_name}</h2>
                  <p className="text-zinc-400 text-sm truncate">{profile.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                      {profile.role}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      profile.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {profile.status === 'active' ? 'Aktif' : profile.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-6 border border-zinc-800/50">
              <h3 className="text-lg font-bold mb-5">Informasi Akun</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Nama Lengkap</label>
                  <input
                    value={form.full_name}
                    disabled={!isEditing}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-50 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={form.email}
                      disabled={!isEditing}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-50 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Role</label>
                    <div className="px-4 py-2.5 bg-zinc-800/50 border border-zinc-800 rounded-xl text-sm text-zinc-500">
                      {profile.role}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Status</label>
                    <div className="px-4 py-2.5 bg-zinc-800/50 border border-zinc-800 rounded-xl text-sm text-zinc-500 capitalize">
                      {profile.status}
                    </div>
                  </div>
                </div>

                {profile.last_login_at && (
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Login Terakhir</label>
                    <div className="px-4 py-2.5 bg-zinc-800/50 border border-zinc-800 rounded-xl text-sm text-zinc-500">
                      {formatDate(profile.last_login_at)}
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl transition-colors text-sm font-semibold"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-zinc-700 pb-4">
              Akun dibuat {formatDate(profile.created_at)} · ID #{profile.id_user}
            </div>
          </>
        )}
      </div>
    </div>
  );
}