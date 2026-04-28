'use client';

import { useProfile } from './useProfile';
import { formatDate } from './utils';
import { AccountHeader } from '@/app/components/profile/AccountHeader';
import { ProfileCard } from '@/app/components/profile/ProfileCard';
import { ProfileForm } from '@/app/components/profile/ProfileForm';

export default function AccountPage() {
  const {
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
  } = useProfile();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AccountHeader
        showEditButton={!loading && !!profile && !isEditing}
        onEdit={() => setIsEditing(true)}
      />

      <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-5">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
            {success}
          </div>
        )}

        {loading && <ProfileSkeleton />}

        {!loading && profile && (
          <>
            <ProfileCard profile={profile} />

            <ProfileForm
              profile={profile}
              form={form}
              isEditing={isEditing}
              saving={saving}
              onChange={setForm}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            <div className="text-center text-xs text-zinc-700 pb-4">
              Akun dibuat {formatDate(profile.created_at)} · ID #{profile.id_user}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-zinc-800" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-zinc-800 rounded-lg w-40" />
          <div className="h-4 bg-zinc-800 rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}