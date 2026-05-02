import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ClipboardList,
  LayoutDashboard,
  PackageOpen,
  Settings,
  ShieldCheck,
  Store,
  Truck,
} from 'lucide-react';
import { AppRole, SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';

type SidebarLink = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: AppRole[];
};

const links: SidebarLink[] = [
  {
    name: 'Dashboard',
    href: '/retailer/dashboard',
    icon: LayoutDashboard,
    roles: ['RETAILER'],
  },
  {
    name: 'Dashboard',
    href: '/wholesaler/dashboard',
    icon: Truck,
    roles: ['WHOLESALER'],
  },
  {
    name: 'Master Inventory',
    href: '/admin/inventory',
    icon: PackageOpen,
    roles: ['ADMIN', 'RETAILER'],
  },
  {
    name: 'Orders',
    href: '/profile/orders',
    icon: ClipboardList,
    roles: ['ADMIN', 'RETAILER', 'WHOLESALER'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'RETAILER', 'WHOLESALER'],
  },
];

function roleLabel(role: AppRole) {
  if (role === 'ADMIN') return 'Platform Admin';
  if (role === 'WHOLESALER') return 'Bulk Supplier';
  if (role === 'RETAILER') return 'Local Retailer';
  return 'Customer';
}

export default async function VendorSidebar() {
  const cookieStore = await cookies();
  const session = readRoleSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const role = session?.role ?? 'CUSTOMER';
  const visibleLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col lg:sticky lg:top-0">
      <div className="border-b border-gray-100 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-black text-white">
            GB
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-gray-950">Vendor Portal</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Global Baniya</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {visibleLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={`${item.href}-${item.name}`}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Icon className="h-5 w-5 text-gray-400" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              {role === 'ADMIN' ? <ShieldCheck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
            </div>
            <span className="text-xs font-black uppercase text-gray-900">{roleLabel(role)}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
            Session role: {role}
          </p>
        </div>
      </div>
    </aside>
  );
}
