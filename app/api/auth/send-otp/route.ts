import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOtp, isEmail, normalizePhone, sendOtpEmail } from '@/lib/auth-flow';

export const dynamic = 'force-dynamic';

function getUserWhere(identifier: string) {
  const value = identifier.trim().toLowerCase();
  return isEmail(value) ? { email: value } : { phone: normalizePhone(value) };
}

export async function POST(request: Request) {
  try {
    const { identifier, purpose = 'login' } = await request.json();
    const normalizedIdentifier = String(identifier || '').trim();

    if (!normalizedIdentifier) {
      return NextResponse.json({ success: false, error: 'Email or phone is required.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: getUserWhere(normalizedIdentifier),
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'No account found for this email or phone.' }, { status: 404 });
    }

    const otp = createOtp();

    await prisma.user.update({
      where: { id: user.id },
      data: { otp },
    });

    await sendOtpEmail(
      user.email,
      otp,
      purpose === 'reset' ? 'Reset your Global Baniya password' : 'Login to Global Baniya'
    );

    return NextResponse.json({
      success: true,
      message: 'OTP sent to the email linked with this account.',
    });
  } catch (error) {
    console.error('Send OTP API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send OTP.' }, { status: 500 });
  }
}
