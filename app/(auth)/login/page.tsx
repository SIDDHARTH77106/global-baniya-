'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, Mail, Phone, ShoppingBag, Store } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type LoginMode = 'password' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [mode, setMode] = useState<LoginMode>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed.');
      }

      login(data.userData);
      router.push(data.redirectTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendOtp() {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, purpose: 'login' }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP.');
      }

      setOtpSent(true);
      setMessage('OTP sent to the email linked with this account.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOtpLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, method: 'otp' }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'OTP login failed.');
      }

      login(data.userData);
      router.push(data.redirectTo);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'OTP login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:grid-cols-[1fr_440px]">
        <section className="hidden bg-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-emerald-700">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-black">Global Baniya</p>
                <p className="text-sm font-semibold text-emerald-100">Local commerce, one login.</p>
              </div>
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-tight">
              Groceries, stores, and supply teams in sync.
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium text-emerald-50">
              Sign in once and land exactly where your role belongs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['Customers', 'Retailers', 'Wholesalers'].map((item) => (
              <div key={item} className="rounded-lg bg-white/10 p-4">
                <ShoppingBag className="mb-3 h-5 w-5" />
                <p className="text-sm font-black">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10">
          <div className="w-full">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 lg:hidden">
                <Store className="h-6 w-6" />
              </div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">Sign in to continue</h2>
              <p className="mt-2 text-sm font-medium text-gray-500">Use your email or phone number.</p>
            </div>

            {message && (
              <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                {message}
              </div>
            )}

            {mode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
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

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">Password</label>
                    <Link href="/forgot-password" className="text-xs font-black text-emerald-700 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-sm font-semibold outline-none transition focus:border-emerald-500 focus:bg-white"
                      placeholder="Enter your password"
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
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('otp');
                    setMessage('');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-black text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <KeyRound className="h-4 w-4" />
                  Login with OTP instead
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Email or Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
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
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting || !identifier}
                  className="w-full rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {otpSent ? 'Send OTP Again' : 'Send Login OTP'}
                </button>

                {otpSent && (
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
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !otpSent}
                  className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify and Login'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('password');
                    setOtpSent(false);
                    setOtp('');
                    setMessage('');
                  }}
                  className="w-full py-2 text-sm font-bold text-gray-500 hover:text-emerald-700"
                >
                  Back to password login
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm font-medium text-gray-600">
              Do not have an account?{' '}
              <Link href="/register" className="font-black text-emerald-700 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
