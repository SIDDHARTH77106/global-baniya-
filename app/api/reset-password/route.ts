import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      return NextResponse.json({ success: false, error: "Incorrect OTP!" }, { status: 400 });
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.json({ success: false, error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    // OTP theek hai, ab naya password save kar do aur OTP delete kar do
    await prisma.user.update({
      where: { email },
      data: { 
        password: newPassword, 
        otp: null, 
        otpExpiry: null 
      }
    });

    return NextResponse.json({ success: true, message: "Password reset successfully!" });

  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
  }
}