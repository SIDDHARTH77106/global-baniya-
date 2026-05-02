import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const isDevelopment = process.env.NODE_ENV !== 'production';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, error: "Email zaroori hai!" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Naya User Register ho raha hai
      if (name) {
        user = await prisma.user.create({
          data: { email, name, otp }
        });
      } else {
        return NextResponse.json({ success: false, error: "Is email se koi account nahi mila!" }, { status: 404 });
      }
    } else {
      // Purana user login kar raha hai, OTP update karo
      await prisma.user.update({
        where: { email },
        data: { otp }
      });
    }

    // Gmail setup:
    // 1. Enable 2-Step Verification in the sender Google account.
    // 2. Create an App Password from Google Account > Security > App passwords.
    // 3. Add these to .env:
    //    EMAIL_USER=yourgmail@gmail.com
    //    EMAIL_PASS=your_16_character_google_app_password
    //    EMAIL_FROM="Global Baniya <yourgmail@gmail.com>"
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      if (isDevelopment) {
        console.log(`[DEV OTP] ${email}: ${otp}`);
        return NextResponse.json({
          success: true,
          message: 'OTP generated. Check the terminal for the development OTP.',
        });
      }

      return NextResponse.json(
        { success: false, error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Global Baniya" <${emailUser}>`, 
      to: email, 
      subject: 'Global Baniya - Login OTP',
      html: `<h2>Global Baniya</h2><p>Your secure OTP is: <b>${otp}</b></p>`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("OTP Mail Error:", mailError);

      if (isDevelopment) {
        console.log(`[DEV OTP] ${email}: ${otp}`);
        return NextResponse.json({
          success: true,
          message: 'OTP generated. Email failed locally, so check the terminal for the OTP.',
        });
      }

      return NextResponse.json(
        { success: false, error: 'OTP generated, but email could not be sent. Please try again.' },
        { status: 502 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'OTP sent!' });

  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
