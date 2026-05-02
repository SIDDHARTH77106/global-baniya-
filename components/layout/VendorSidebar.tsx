import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  AlertTriangle,
  Building2,
  Boxes,
  ClipboardList,
  FileBarChart,
  FileText,
  LayoutDashboard,
  PackageOpen,
  ReceiptText,
  Settings,
  ShieldCheck,
  Truck,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { AppRole, SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';

type SidebarLink = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const adminLinks: SidebarLink[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Master Inventory', href: '/admin/inventory', icon: PackageOpen },
  { name: 'All Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Users', href: '/admin/users', icon: UsersRound },
  { name: 'Payouts', href: '/admin/payouts', icon: WalletCards },
  { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const vendorLinksByRole: Record<'RETAILER' | 'WHOLESALER', SidebarLink[]> = {
  RETAILER: [
    { name: 'Dashboard', href: '/retailer/dashboard', icon: LayoutDashboard },
    { name: 'Low Stock Alerts', href: '/retailer/alerts', icon: AlertTriangle },
    { name: 'Purchase Orders', href: '/retailer/purchase-orders', icon: ClipboardList },
    { name: 'My Earnings', href: '/retailer/earnings', icon: WalletCards },
  ],
  WHOLESALER: [
    { name: 'Dashboard', href: '/wholesaler/dashboard', icon: LayoutDashboard },
    { name: 'My Bulk Orders', href: '/wholesaler/orders', icon: ClipboardList },
    { name: 'Dispatch/Shipping', href: '/wholesaler/dispatch', icon: Truck },
    { name: 'Invoices', href: '/wholesaler/invoices', icon: ReceiptText },
    { name: 'Batch Tracking', href: '/wholesaler/batches', icon: FileText },
  ],
};

function getLinks(role: AppRole) {
  if (role === 'ADMIN') return adminLinks;
  if (role === 'RETAILER' || role === 'WHOLESALER') return vendorLinksByRole[role];
  return [];
}

function roleLabel(role: AppRole) {
  if (role === 'ADMIN') return 'Super Admin';
  if (role === 'WHOLESALER') return 'Wholesale Partner';
  if (role === 'RETAILER') return 'Retail Partner';
  return 'Customer';
}

export default async function VendorSidebar() {
  const cookieStore = await cookies();
  const session = readRoleSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const role = session?.role ?? 'CUSTOMER';
  const visibleLinks = getLinks(role);

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-white">
            GB
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">Global Baniya</p>
            <p className="text-[11px] font-black uppercase tracking-wide text-emerald-300">Command Center</p>
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
              {role === 'ADMIN' ? <ShieldCheck className="h-5 w-5" /> : role === 'WHOLESALER' ? <Building2 className="h-5 w-5" /> : <Boxes className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-black">{roleLabel(role)}</p>
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Session role</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 w-3/4 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 pb-4">
        {visibleLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-5 w-5 text-emerald-300" />
              {item.name}
            </Link>
          );
        })}

        {visibleLinks.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-bold text-slate-300">
            No dashboard links are available for this role.
          </div>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-emerald-500/10 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-300">Inventory Sync</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
            Variant stock updates revalidate admin, vendor, and storefront surfaces.
          </p>
        </div>
      </div>
    </aside>
  );
}
