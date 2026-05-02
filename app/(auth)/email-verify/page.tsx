"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function EmailOtpPage() {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(30);
  const [isError, setIsError] = useState(false);
  const canResend = showOtp && timeLeft === 0;

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtp && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtp, timeLeft]);

  // 1. Send OTP to Email
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Email Regex Check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsError(true);
      return;
    }
    
    setIsError(false);
    console.log("Sending OTP to Email:", email);
    // Yahan API call aayegi: axios.post('/api/auth/send-email-otp', { email })

    setShowOtp(true);
    setTimeLeft(30); // Start 30 sec timer
  };

  // 2. Resend OTP
  const handleResendOtp = () => {
    console.log("Resending OTP to:", email);
    // API Call again
    setTimeLeft(30);
  };

  // 3. Verify OTP inside the app
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      console.log("Verifying OTP:", otp);
      // API call: axios.post('/api/auth/verify-email-otp', { email, otp })
      alert("Email Verified Successfully! Redirecting...");
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {showOtp ? "Check your Inbox" : "Verify your Email"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {showOtp 
              ? `We have sent a 6-digit OTP to ${email}` 
              : "Enter your registered email to receive an OTP securely."}
          </p>
        </div>

        {/* Form toggles based on showOtp state */}
        {!showOtp ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsError(false);
                }}
                placeholder="name@example.com"
                className={`mt-2 w-full rounded-lg border p-3 outline-none transition-all focus:ring-2 ${
                  isError ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {isError && <p className="mt-1 text-xs text-red-500">Sahi email address daalein.</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              Send OTP to Email
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Sirf numbers allow karega
                placeholder="• • • • • •"
                className="mt-2 w-full rounded-lg border border-gray-300 py-3 px-4 text-center text-xl tracking-[1em] outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-95 shadow-md"
            >
              Verify OTP & Continue
            </button>

            {/* Resend OTP Logic */}
            <div className="text-center mt-4">
              {canResend ? (
                <p className="text-sm text-gray-500">
                  Did not receive the email?{" "}
                  <button type="button" onClick={handleResendOtp} className="font-semibold text-blue-600 hover:underline">
                    Resend OTP
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend OTP in <span className="font-bold text-gray-800">00:{timeLeft.toString().padStart(2, '0')}</span>
                </p>
              )}
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:underline">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
