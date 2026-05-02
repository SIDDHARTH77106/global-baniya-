'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'identifier' | 'reset'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, purpose: 'reset' }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP.');
      }

      setStep('reset');
      setMessage('OTP sent. Create a new password after verification.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      router.push('/login');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-gray-500 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Password reset</p>
          <h1 className="mt-2 text-3xl font-black text-gray-950">
            {step === 'identifier' ? 'Recover your account' : 'Create new password'}
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            {step === 'identifier'
              ? 'Enter your email or phone number and we will send an OTP.'
              : 'Enter the OTP and choose a fresh password.'}
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {message}
          </div>
        )}

        {step === 'identifier' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">Email or Phone Number</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
                  placeholder="name@example.com or 9876543210"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending OTP...' : 'Send Recovery OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                <p className="text-sm font-bold text-emerald-800">
                  OTP sent to the email linked with {identifier}.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">OTP</label>
              <input
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-center text-xl font-black tracking-[0.45em] outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="000000"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">Create New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
