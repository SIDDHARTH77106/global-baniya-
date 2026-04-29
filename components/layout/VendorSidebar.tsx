'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PackageOpen, 
  ClipboardList, 
  Settings, 
  ChevronRight,
  Store
} from 'lucide-react';

export default function VendorSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/retailer/dashboard' },
    { name: 'Inventory', icon: PackageOpen, href: '/admin/inventory' },
    { name: 'Orders', icon: ClipboardList, href: '/profile/orders' },
    { name: 'Store Settings', icon: Settings, href: '/retailer/settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 hidden lg:flex flex-col sticky top-0">
      {/* Branding */}
      <div className="p-6 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-sm">GB</div>
          <span className="text-lg font-black text-gray-900 tracking-tight">Vendor Portal</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-emerald-600"}`} />
                <span className="text-sm font-bold">{item.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
            </Link>
          );
        })}
      </nav>

      {/* Store Badge */}
      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-gray-900 uppercase">Pune Main Branch</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Retailer</p>
        </div>
      </div>
    </aside>
  );
}
