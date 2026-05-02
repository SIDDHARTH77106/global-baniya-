import Link from 'next/link';
import { Heart, MapPin, PackageCheck } from 'lucide-react';

const links = [
  { label: 'My Orders', href: '/profile/orders', icon: PackageCheck },
  { label: 'Saved Addresses', href: '/profile/addresses', icon: MapPin },
  { label: 'Wishlist', href: '/profile/wishlist', icon: Heart },
];

export default function ProfileShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 px-2 text-lg font-black text-gray-950">Your Account</h2>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>
          <h1 className="mb-5 text-3xl font-black text-gray-950">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
