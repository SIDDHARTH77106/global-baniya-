import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, error: "Email zaroori hai!" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Naya User Register ho raha hai
      if (name) {
        user = await prisma.user.create({
          data: { email, name, otp, otpExpiry }
        });
      } else {
        return NextResponse.json({ success: false, error: "Is email se koi account nahi mila!" }, { status: 404 });
      }
    } else {
      // Purana user login kar raha hai, OTP update karo
      await prisma.user.update({
        where: { email },
        data: { otp, otpExpiry }
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'bobby77106@gmail.com', 
        pass: process.env.EMAIL_PASS || 'hilzgzpcceqtwmze' 
      }
    });

    const mailOptions = {
      from: '"Global Baniya" <bobby77106@gmail.com>', 
      to: email, 
      subject: 'Global Baniya - Login OTP',
      html: `<h2>Global Baniya</h2><p>Your secure OTP is: <b>${otp}</b></p>`
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true, message: 'OTP sent!' });

  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}