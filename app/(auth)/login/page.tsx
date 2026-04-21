"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore"; 
import { Mail, CheckCircle2, Store, Lock, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper: Redirect users based on their DB role
  const redirectUser = (role: string) => {
    if (role === "retailer") router.push("/retailer/dashboard");
    else if (role === "wholesaler") router.push("/wholesaler/dashboard");
    else router.push("/");
  };

  // 1. Handle Login via Password
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();

      if (data.success) {
        login(data.userData); // Store user data from DB
        redirectUser(data.userData.role);
      } else {
        alert(data.error || "Invalid Credentials");
      }
    } catch (err) {
      alert("System connection error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Request OTP from Server
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }) 
      });

      const data = await res.json();

      if (data.success) {
        setStep(2); // Move to OTP input step
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Verify OTP and Login
  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (data.success) {
        login(data.userData); // User verified by DB
        redirectUser(data.userData.role);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to Global Baniya</p>
        </div>

        {/* --- PASSWORD LOGIN --- */}
        {loginMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" size="sm" className="text-xs text-emerald-600 font-medium">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all" />
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 transition-all shadow-lg shadow-emerald-100">
              {isProcessing ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-xs text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button type="button" onClick={() => setLoginMode('otp')} className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
              <KeyRound className="h-4 w-4" /> Login with OTP
            </button>
          </form>
        )}

        {/* --- OTP LOGIN: STEP 1 (Email) --- */}
        {loginMode === 'otp' && step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all" />
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 transition-all shadow-lg shadow-emerald-100">
              {isProcessing ? "Sending..." : "Get OTP"}
            </button>

            <button type="button" onClick={() => setLoginMode('password')} className="w-full py-2 text-sm text-gray-500 hover:text-emerald-600">Back to Password</button>
          </form>
        )}

        {/* --- OTP LOGIN: STEP 2 (Verify) --- */}
        {loginMode === 'otp' && step === 2 && (
          <form onSubmit={handleVerifyAndLogin} className="space-y-6">
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-emerald-800">OTP sent to <strong>{email}</strong></p>
            </div>

            <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••••" className="w-full rounded-xl border border-gray-200 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:border-emerald-500 outline-none" />

            <button type="submit" disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-all">
              {isProcessing ? "Verifying..." : "Verify & Login"}
            </button>

            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 underline">Change Email</button>
          </form>
        )}

        {/* Footer Link */}
        {(step === 1 || loginMode === 'password') && (
          <p className="mt-8 text-center text-sm text-gray-600">
            New to Global Baniya? <Link href="/register" className="font-semibold text-emerald-600 hover:underline">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
}