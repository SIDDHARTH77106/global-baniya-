import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRoleSession, normalizeRole, SESSION_COOKIE_NAME } from '@/lib/auth-session';
import { getRoleRedirect, isEmail, normalizePhone } from '@/lib/auth-flow';

export const dynamic = 'force-dynamic';

function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

function getUserWhere(identifier: string) {
  const value = identifier.trim().toLowerCase();
  return isEmail(value) ? { email: value } : { phone: normalizePhone(value) };
}

export async function POST(request: Request) {
  try {
    const { identifier, password, otp, method = 'password' } = await request.json();
    const normalizedIdentifier = String(identifier || '').trim();

    if (!normalizedIdentifier) {
      return NextResponse.json({ success: false, error: 'Email or phone is required.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: getUserWhere(normalizedIdentifier),
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    if (method === 'otp') {
      if (!otp || user.otp !== String(otp).trim()) {
        return NextResponse.json({ success: false, error: 'Invalid OTP.' }, { status: 401 });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { otp: null },
      });
    } else {
      if (!password || !user.password) {
        return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
      }

      const passwordMatches = await bcrypt.compare(String(password), user.password);

      if (!passwordMatches) {
        return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
      }
    }

    const role = normalizeRole(user.role);
    const response = NextResponse.json({
      success: true,
      redirectTo: getRoleRedirect(role),
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        role,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, createRoleSession(user), getSessionCookieOptions());

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Login failed.' }, { status: 500 });
  }
}
