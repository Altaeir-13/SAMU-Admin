'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/shifts', label: 'Escalas', icon: '📅' },
    { href: '/dashboard/fleet', label: 'Frotas', icon: '🚑' },
    { href: '/dashboard/inventory', label: 'Estoque', icon: '📦' },
  ];

  return (
    <aside className="w-64 bg-red-700 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-red-600">
        <h1 className="text-xl font-bold">🚨 SAMU Admin</h1>
        <p className="text-sm text-red-200">Sistema de Gestão</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-red-800 text-white'
                    : 'hover:bg-red-600'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-red-600">
        <div className="mb-4">
          <p className="text-sm font-medium">{session?.user?.name}</p>
          <p className="text-xs text-red-200">{session?.user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full px-4 py-2 bg-red-800 hover:bg-red-900 rounded-lg transition-colors text-sm"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
