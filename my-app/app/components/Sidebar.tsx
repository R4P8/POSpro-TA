'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  ShoppingCart,
  Warehouse,
  Building2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// Definisi semua menu beserta role yang boleh lihat
const allMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'POS',
    icon: ShoppingCart,
    href: '/admin/pos',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'POS',
    icon: ShoppingCart,
    href: '/kasir/pos',
    badge: null,
    roles: ['Kasir'],
  },
  {
    title: 'Product',
    icon: Package,
    href: '/admin/product',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Product',
    icon: Package,
    href: '/kasir/product',
    badge: null,
    roles: ['Kasir'],
  },
  {
    title: 'Product',
    icon: Package,
    href: '/gudang/product',
    badge: null,
    roles: ['Gudang'],
  },
  {
    title: 'Laporan',
    icon: FileText,
    href: '/admin/laporan',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Manajemen Gudang',
    icon: Warehouse,
    href: '/admin/gudang',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Manajemen Gudang',
    icon: Warehouse,
    href: '/gudang/mgudang',
    badge: null,
    roles: ['Gudang'],
  },
  {
    title: 'Unit Bisnis',
    icon: Building2,
    href: '/admin/unit-bisnis',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Hak Akses',
    icon: ShieldCheck,
    href: '/admin/hak-akses',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Account',
    icon: User,
    href: '/admin/account',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Account',
    icon: User,
    href: '/kasir/account',
    badge: null,
    roles: ['Kasir'],
  },
  {
    title: 'Account',
    icon: User,
    href: '/gudang/account',
    badge: null,
    roles: ['Gudang'],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
    badge: null,
    roles: ['Owner'],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/kasir/settings',
    badge: null,
    roles: ['Kasir'],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/gudang/settings',
    badge: null,
    roles: ['Gudang'],
  },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') ?? '';
    setRole(storedRole);
  }, []);

  // Filter menu sesuai role
  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  // Tentukan href home berdasarkan role
  const homeHref =
    role === 'Owner' ? '/admin/dashboard' :
    role === 'Kasir' ? '/kasir/pos' :
    role === 'Gudang' ? '/gudang/mgudang' :
    '/login';

  const isActive = (href: string) => {
    // Exact match untuk root dashboard
    if (href === '/admin/dashboard' || href === '/kasir/pos' || href === '/gudang/mgudang') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-zinc-900 border-r border-zinc-800 transition-all duration-300 z-50 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800">
          {isOpen ? (
            <Link href={homeHref} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg">
                P
              </div>
              <div>
                <span className="font-bold text-lg">POS</span>
                <span className="text-purple-400 font-bold text-lg">Pro</span>
              </div>
            </Link>
          ) : (
            <div className="w-full flex justify-center">
              <Link href={homeHref}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg">
                  P
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-24 w-6 h-6 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Role Badge */}
        {isOpen && role && (
          <div className="mx-3 mt-4 mb-1 px-3 py-2 bg-zinc-800 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-zinc-400">
              Login sebagai{' '}
              <span className="text-purple-400 font-semibold">{role}</span>
            </span>
          </div>
        )}

        {/* Menu Items */}
        <nav
          className="mt-3 px-3 space-y-1 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-50" />
                )}
                <div className="relative flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium flex-1">{item.title}</span>
                  )}
                  {isOpen && item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Tooltip saat collapsed */}
                {!isOpen && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-zinc-700">
                    {item.title}
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-zinc-800">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="group w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition-all relative"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Logout</span>}

            {!isOpen && (
              <div className="absolute left-full ml-6 px-3 py-2 bg-zinc-800 text-red-400 text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-zinc-700">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}