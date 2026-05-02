'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, Store, UserRound } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type Role = 'CUSTOMER' | 'RETAILER' | 'WHOLESALER';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleRegistrationRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, password, role, action: 'request' }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      setStep('otp');
      setMessage('OTP sent. Verify it to activate your account.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOtpVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, action: 'verify' }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'OTP verification failed.');
      }

      login(data.userData);
      router.push(data.redirectTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:grid-cols-[440px_1fr]">
        <section className="hidden bg-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-emerald-700">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-black">Global Baniya</p>
                <p className="text-sm font-semibold text-emerald-100">Create a secure account.</p>
              </div>
            </div>
            <h1 className="text-5xl font-black leading-tight">Start selling, buying, or supplying locally.</h1>
            <p className="mt-5 text-base font-medium text-emerald-50">
              Your role controls your dashboard and permissions from the first sign-in.
            </p>
          </div>

          <div className="rounded-lg bg-white/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm font-black">Secure by default</p>
            </div>
            <p className="text-sm font-medium text-emerald-50">
              Passwords are hashed and accounts are created only after OTP verification.
            </p>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Create account</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">
                {step === 'details' ? 'Join Global Baniya' : 'Verify your email'}
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-500">
                {step === 'details'
                  ? 'Choose your role and secure your account.'
                  : 'Enter the 6-digit OTP sent to your email.'}
              </p>
            </div>

            {message && (
              <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                {message}
              </div>
            )}

            {step === 'details' ? (
              <form onSubmit={handleRegistrationRequest} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Name</label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Email or Phone</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
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

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Role</label>
                  <select
                    value={role}
                    onChange={(event) => setRole(event.target.value as Role)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-black text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="RETAILER">Retailer</option>
                    <option value="WHOLESALER">Wholesaler</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerification} className="space-y-5">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                    <p className="text-sm font-bold text-emerald-800">
                      We sent a verification code to {contact}.
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating account...' : 'Verify and Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setOtp('');
                    setMessage('');
                  }}
                  className="w-full py-2 text-sm font-bold text-gray-500 hover:text-emerald-700"
                >
                  Edit account details
                </button>
              </form>
            )}

            {step === 'details' && (
              <p className="mt-8 text-center text-sm font-medium text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-black text-emerald-700 hover:underline">
                  Log in
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
