import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isEmail, normalizePhone } from '@/lib/auth-flow';

export const dynamic = 'force-dynamic';

function getUserWhere(identifier: string) {
  const value = identifier.trim().toLowerCase();
  return isEmail(value) ? { email: value } : { phone: normalizePhone(value) };
}

export async function POST(request: Request) {
  try {
    const { identifier, otp, newPassword } = await request.json();
    const normalizedIdentifier = String(identifier || '').trim();
    const normalizedOtp = String(otp || '').trim();
    const password = String(newPassword || '');

    if (!normalizedIdentifier || !normalizedOtp || !password) {
      return NextResponse.json(
        { success: false, error: 'Email or phone, OTP, and new password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: getUserWhere(normalizedIdentifier),
    });

    if (!user || user.otp !== normalizedOtp) {
      return NextResponse.json({ success: false, error: 'Invalid OTP.' }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        otp: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset password.' }, { status: 500 });
  }
}
