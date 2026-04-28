"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Send OTP
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
        setStep(2);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to send OTP.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password successfully changed!");
        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to reset password.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-8 shadow-sm border border-gray-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === 1 ? "Enter your email to receive a recovery code." : "Enter OTP and your new password."}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter registered email" 
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white" 
              />
            </div>
            <button type="submit" disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 transition-all">
              {isProcessing ? "Sending..." : "Send Recovery OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-emerald-800">OTP sent to <strong>{email}</strong></p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">ENTER 6-DIGIT OTP</label>
              <input 
                required 
                type="text" 
                maxLength={6} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                placeholder="••••••" 
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-center text-xl font-bold tracking-[0.5em] outline-none focus:border-emerald-500 focus:bg-white" 
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">NEW PASSWORD</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password" 
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-sm outline-none focus:border-emerald-500 focus:bg-white" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-emerald-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70 transition-all mt-2">
              {isProcessing ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-emerald-600 hover:underline">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}