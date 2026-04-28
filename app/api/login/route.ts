import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    return NextResponse.json({ 
      success: true, 
      userData: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}