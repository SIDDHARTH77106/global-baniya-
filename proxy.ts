import { NextRequest, NextResponse } from 'next/server';
import { AppRole, SESSION_COOKIE_NAME, readRoleSession } from '@/lib/auth-session';

const protectedRoutes: Array<{ prefix: string; roles: AppRole[] }> = [
  { prefix: '/admin', roles: ['ADMIN', 'RETAILER'] },
  { prefix: '/retailer', roles: ['RETAILER', 'ADMIN'] },
  { prefix: '/wholesaler', roles: ['WHOLESALER', 'ADMIN'] },
];

function getRequiredRoles(pathname: string) {
  return protectedRoutes.find((route) => pathname.startsWith(route.prefix))?.roles;
}

function getRoleHome(role: AppRole) {
  if (role === 'ADMIN') return '/admin/inventory';
  if (role === 'RETAILER') return '/retailer/dashboard';
  if (role === 'WHOLESALER') return '/wholesaler/dashboard';
  return '/';
}

export function proxy(request: NextRequest) {
  const requiredRoles = getRequiredRoles(request.nextUrl.pathname);
  if (!requiredRoles) return NextResponse.next();

  const session = readRoleSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!requiredRoles.includes(session.role)) {
    return NextResponse.redirect(new URL(getRoleHome(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/retailer/:path*', '/wholesaler/:path*'],
};
