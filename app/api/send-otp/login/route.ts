import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // 1. Check karna ki Email aayi hai ya nahi
    if (!email) {
      return NextResponse.json({ error: "Email zaroori hai!" }, { status: 400 });
    }

    // 2. MySQL mein user dhoondhna
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ error: "Is email se koi account nahi mila!" }, { status: 404 });
    }

    // 3. 6-digit ka secure OTP Generate karna
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. (Temporary) Abhi ke liye OTP ko hum terminal mein print kar rahe hain
    // Asli project mein yahan Email send karne ka code aayega
    console.log(`=================================`);
    console.log(`🚀 MOCK EMAIL SENT!`);
    console.log(`📧 To: ${email}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`=================================`);

    // TODO: Is OTP ko humein Database mein save karna hoga taaki verify kar sakein!

    return NextResponse.json({ 
      success: true, 
      message: "OTP aapke email par bhej diya gaya hai!" 
    }, { status: 200 });

  } catch (error) {
    console.error("OTP Send Error:", error);
    return NextResponse.json({ error: "Server error OTP bhejte waqt" }, { status: 500 });
  }
}