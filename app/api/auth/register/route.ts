import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRoleSession, normalizeRole, SESSION_COOKIE_NAME } from '@/lib/auth-session';
import {
  createOtp,
  getRoleRedirect,
  isEmail,
  normalizePhone,
  PENDING_REGISTRATION_COOKIE,
  readPendingRegistration,
  sendOtpEmail,
  serializePendingRegistration,
} from '@/lib/auth-flow';

export const dynamic = 'force-dynamic';

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body.action || 'request');

    if (action === 'verify') {
      const otp = String(body.otp || '').trim();
      const pending = readPendingRegistration(request.cookies.get(PENDING_REGISTRATION_COOKIE)?.value);

      if (!pending || pending.otp !== otp) {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP.' }, { status: 400 });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: pending.email },
            ...(pending.phone ? [{ phone: pending.phone }] : []),
          ],
        },
      });

      if (existingUser) {
        return NextResponse.json({ success: false, error: 'Account already exists.' }, { status: 409 });
      }

      const user = await prisma.user.create({
        data: {
          name: pending.name,
          email: pending.email,
          phone: pending.phone,
          password: pending.passwordHash,
          role: pending.role,
          otp: null,
        },
      });

      const response = NextResponse.json({
        success: true,
        redirectTo: getRoleRedirect(normalizeRole(user.role)),
        userData: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone ?? undefined,
          role: normalizeRole(user.role),
        },
      });

      response.cookies.set(SESSION_COOKIE_NAME, createRoleSession(user), getCookieOptions(60 * 60 * 24 * 7));
      response.cookies.set(PENDING_REGISTRATION_COOKIE, '', getCookieOptions(0));

      return response;
    }

    const name = String(body.name || '').trim();
    const contact = String(body.contact || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = normalizeRole(body.role);
    const phone = body.phone ? normalizePhone(String(body.phone)) : undefined;

    if (!name || !contact || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (!isEmail(contact)) {
      return NextResponse.json(
        { success: false, error: 'Registration requires an email address so we can send the OTP.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: contact },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Account already exists.' }, { status: 409 });
    }

    const otp = createOtp();
    const passwordHash = await bcrypt.hash(password, 12);

    await sendOtpEmail(contact, otp, 'Verify your Global Baniya account');

    const response = NextResponse.json({
      success: true,
      message: 'OTP sent. Verify it to create your account.',
    });

    response.cookies.set(
      PENDING_REGISTRATION_COOKIE,
      serializePendingRegistration({
        name,
        email: contact,
        phone,
        passwordHash,
        role,
        otp,
        issuedAt: Date.now(),
      }),
      getCookieOptions(10 * 60)
    );

    return response;
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed.' }, { status: 500 });
  }
}
