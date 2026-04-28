import { useState, useEffect } from 'react';
import type { UserProfile, ProfileForm } from './types';
import { fetchUserProfile, updateUserProfile } from './services';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<ProfileForm>({ full_name: '', email: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await fetchUserProfile();
      setProfile(data);
      setForm({ full_name: data.full_name, email: data.email });
    } catch {
      setError('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateUserProfile(profile.id_user, form);
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
  }

  function handleCancel() {
    if (profile) setForm({ full_name: profile.full_name, email: profile.email });
    setIsEditing(false);
    setError('');
  }

  return {
    profile,
    loading,
    saving,
    isEditing,
    setIsEditing,
    error,
    success,
    form,
    setForm,
    handleSave,
    handleCancel,
  };
}