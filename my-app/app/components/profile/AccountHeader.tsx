import { User, Edit } from 'lucide-react';

interface AccountHeaderProps {
  showEditButton: boolean;
  onEdit: () => void;
}

export function AccountHeader({ showEditButton, onEdit }: AccountHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <User className="w-7 h-7 text-purple-400" />
            Account
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Kelola informasi akun Anda</p>
        </div>
        {showEditButton && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors text-sm font-semibold"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit Profil</span>
          </button>
        )}
      </div>
    </header>
  );
}