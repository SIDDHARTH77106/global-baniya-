import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, createRoleSession, normalizeRole } from '@/lib/auth-session';

export async function POST(request: Request) { 
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email aur Password dono zaroori hain!" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: "Galat Email ya Password." }, { status: 401 });
    }

    const response = NextResponse.json({ 
      success: true, 
      userData: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: normalizeRole(user.role)
      } 
    });

    response.cookies.set(SESSION_COOKIE_NAME, createRoleSession(user), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
