import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, otp, phone, role, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // Check 1: User DB mein nahi hai ya OTP galat daala
    if (!user || user.otp !== otp) {
      return NextResponse.json({ success: false, error: "Incorrect OTP! Please check your email." }, { status: 400 });
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.json({ success: false, error: "OTP expired. go back generate new otp." }, { status: 400 });
    }
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        otp: null, 
        otpExpiry: null,
        phone: phone || user.phone,
        role: role || user.role,
        password: password || user.password
      }
    });

    return NextResponse.json({ 
      success: true, 
      userData: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } 
    });

  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}