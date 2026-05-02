import Link from 'next/link';
import { cookies } from 'next/headers';
import { Bell, ChevronDown, Home, Search, UserRound } from 'lucide-react';
import VendorSidebar from '@/components/layout/VendorSidebar';
import { SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';
import { prisma } from '@/lib/prisma';

type Breadcrumb = {
  label: string;
  href?: string;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = readRoleSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.userId) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
}

export default async function DashboardLayout({
  children,
  title,
  subtitle,
  breadcrumbs,
}: DashboardLayoutProps) {
  const user = await getSessionUser();
  const initials = (user?.name ?? 'GB')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <VendorSidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <nav className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-500">
                <Link href="/" className="inline-flex items-center gap-1 transition hover:text-emerald-700">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
                {breadcrumbs.map((crumb) => (
                  <span key={`${crumb.label}-${crumb.href ?? 'current'}`} className="inline-flex items-center gap-2">
                    <span className="text-slate-300">/</span>
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition hover:text-emerald-700">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-700">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
              <h1 className="truncate text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden h-10 w-72 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-400 xl:flex">
                <Search className="h-4 w-4" />
                Search products, orders, users
              </div>

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500" />
              </button>

              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition hover:border-emerald-200 hover:bg-emerald-50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-black text-white">
                    {initials || <UserRound className="h-4 w-4" />}
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="max-w-32 truncate text-sm font-black text-slate-900">{user?.name ?? 'Global Baniya'}</p>
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                      {user?.role ?? 'Guest'}
                    </p>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 transition group-open:rotate-180 md:block" />
                </summary>

                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-black text-slate-950">{user?.name ?? 'Unsigned session'}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">{user?.email ?? 'No email available'}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="mt-2 block rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
                  >
                    Account settings
                  </Link>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Switch account
                  </Link>
                </div>
              </details>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
