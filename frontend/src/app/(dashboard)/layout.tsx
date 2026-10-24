'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Heart, Users, Calendar, FileText, MessageSquare, BarChart3, Shield, Settings, LogOut, Megaphone } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Heart },
  { href: '/donations', label: 'My Donations', icon: Heart },
  { href: '/volunteering', label: 'Volunteering', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/petitions', label: 'Petitions', icon: FileText },
  { href: '/forums', label: 'Forums', icon: MessageSquare },
  { href: '/impact', label: 'Impact Stories', icon: BarChart3 },
  { href: '/communications', label: 'Notifications', icon: Megaphone },
  { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-white">
        <div className="border-b px-6 py-4">
          <Link href="/" className="text-xl font-bold text-primary-700">Civitas</Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.filter((i) => !i.adminOnly || user?.role === 'SUPER_ADMIN').map((item) => (
            <Link key={item.href} href={item.href} className={cn('mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition', pathname === item.href ? 'bg-primary-50 font-medium text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t px-3 py-3">
          <div className="mb-2 px-3 text-xs text-gray-500 truncate">{user?.email}</div>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
