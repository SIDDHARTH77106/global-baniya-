"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
            <p className="mt-2 text-sm text-gray-500">Enter your registered mobile number to receive an OTP.</p>
            <input type="tel" placeholder="Mobile Number" maxLength={10} className="mt-6 w-full rounded-lg border p-3 outline-none focus:border-green-500" />
            <button onClick={() => setStep(2)} className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white">Send OTP</button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
            <p className="mt-2 text-sm text-gray-500">We sent a 6-digit code to your number.</p>
            <input type="text" placeholder="• • • • • •" maxLength={6} className="mt-6 w-full rounded-lg border py-3 text-center tracking-[1em] outline-none focus:border-green-500" />
            <button onClick={() => setStep(3)} className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white">Verify & Continue</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-500">Create a strong new password.</p>
            <input type="password" placeholder="New Password" className="mt-6 w-full rounded-lg border p-3 outline-none focus:border-green-500" />
            <input type="password" placeholder="Confirm Password" className="mt-4 w-full rounded-lg border p-3 outline-none focus:border-green-500" />
            <button className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white">Update Password</button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-green-600 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}