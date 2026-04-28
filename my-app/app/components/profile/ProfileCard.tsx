import type { UserProfile } from '@/app/admin/account/types';
import { getInitials } from '@/app/admin/account/utils';

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
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
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                profile.status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-zinc-500/20 text-zinc-400'
              }`}
            >
              {profile.status === 'active' ? 'Aktif' : profile.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}