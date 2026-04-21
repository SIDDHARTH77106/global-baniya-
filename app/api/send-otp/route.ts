import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email zaroori hai!" }, { status: 400 });

    // 1. Check karein ki MySQL mein user hai ya nahi?
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Is email se koi account nahi mila!" }, { status: 404 });

    // 2. 6-Digit OTP aur 10 Minute ki Expiry banayein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // 3. MySQL mein OTP Save karein
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry }
    });

    // 4. Nodemailer se Email Bhejein
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bobby77106@gmail.com', 
        pass: 'hilzgzpcceqtwmze' 
      }
    });

    const mailOptions = {
      from: '"Global Baniya" <bobby77106@gmail.com>', 
      to: email, 
      subject: 'Global Baniya - Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #10b981; text-align: center;">Global Baniya</h2>
          <p>Hi ${user.name},</p>
          <p>Your secure verification OTP is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; background: #f3f4f6; padding: 10px 20px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 12px; color: #6b7280; text-align: center;">Valid for 10 minutes. Do not share it.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // 🔴 NOTICE: Humne yahan se OTP frontend ko bhejna band kar diya hai (Security)
    return NextResponse.json({ success: true, message: 'OTP sent to your email!' });

  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: 'Server error failed to send OTP' }, { status: 500 });
  }
}