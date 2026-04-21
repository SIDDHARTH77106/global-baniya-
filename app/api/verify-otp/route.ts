import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // Check 1: User nahi mila ya OTP galat hai
    if (!user || user.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP!" }, { status: 400 });
    }

    // Check 2: OTP Expire toh nahi ho gaya?
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Success! Ab purane OTP ko delete kar do taaki dobara use na ho
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiry: null }
    });

    // Asli User data (Role ke sath) frontend ko bhej do
    return NextResponse.json({ 
      success: true, 
      userData: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });

  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}