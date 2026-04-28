import { Mail, Save, X } from 'lucide-react';
import type { UserProfile, ProfileForm as ProfileFormType } from '@/app/admin/account/types';
import { formatDate } from '@/app/admin/account/utils';

interface ProfileFormProps {
  profile: UserProfile;
  form: ProfileFormType;
  isEditing: boolean;
  saving: boolean;
  onChange: (form: ProfileFormType) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileForm({
  profile,
  form,
  isEditing,
  saving,
  onChange,
  onSave,
  onCancel,
}: ProfileFormProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 rounded-2xl p-6 border border-zinc-800/50">
      <h3 className="text-lg font-bold mb-5">Informasi Akun</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Nama Lengkap</label>
          <input
            value={form.full_name}
            disabled={!isEditing}
            onChange={(e) => onChange({ ...form, full_name: e.target.value })}
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
              onChange={(e) => onChange({ ...form, email: e.target.value })}
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
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Batal
          </button>
          <button
            onClick={onSave}
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
  );
}