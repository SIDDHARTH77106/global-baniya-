import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import nodemailer from 'nodemailer';
import { AppRole, normalizeRole } from '@/lib/auth-session';

export const PENDING_REGISTRATION_COOKIE = 'global-baniya-pending-registration';

export type PendingRegistration = {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: AppRole;
  otp: string;
  issuedAt: number;
};

const OTP_TTL_MS = 10 * 60 * 1000;

function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'global-baniya-dev-secret-change-me';
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string) {
  return createHmac('sha256', getAuthSecret()).update(payload).digest('base64url');
}

export function createOtp() {
  return randomInt(100000, 1000000).toString();
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

export function serializePendingRegistration(data: PendingRegistration) {
  const payload = base64UrlEncode(JSON.stringify(data));
  return `${payload}.${sign(payload)}`;
}

export function readPendingRegistration(token?: string | null) {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const pending = JSON.parse(base64UrlDecode(payload)) as PendingRegistration;
    if (!pending.email || !pending.passwordHash || !pending.otp || !pending.name) return null;
    if (Date.now() - pending.issuedAt > OTP_TTL_MS) return null;

    return {
      ...pending,
      role: normalizeRole(pending.role),
    };
  } catch {
    return null;
  }
}

export function getRoleRedirect(role: AppRole) {
  if (role === 'RETAILER') return '/retailer/dashboard';
  if (role === 'WHOLESALER') return '/wholesaler/dashboard';
  if (role === 'ADMIN') return '/admin/inventory';
  return '/';
}

export async function sendOtpEmail(to: string, otp: string, subject = 'Global Baniya verification code') {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV OTP] ${to}: ${otp}`);
      return;
    }

    throw new Error('Email service is not configured.');
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

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Global Baniya" <${emailUser}>`,
    to,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Global Baniya</h2>
        <p>Your secure verification code is:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}
