"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore"; 
import { Mail, Smartphone, CheckCircle2, Store } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Customer (Buy Groceries)", 
  });
  
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Asli OTP save karne ke liye
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔴 ASLI API WALA REQUEST FUNCTION
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (formData.phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.firstName })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedOtp(data.otp); 
        setIsProcessing(false);
        setStep(2); 
      } else {
        alert("Failed to send OTP. Check email settings.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error! Make sure API route is correct.");
      setIsProcessing(false);
    }
  };

  // 🔴 ASLI OTP VERIFY FUNCTION
  const handleVerifyAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (otp === generatedOtp) { 
      const userData = {
        id: "GB-" + Math.random().toString(36).substr(2, 9),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: formData.role.includes("Retailer") ? "retailer" 
              : formData.role.includes("Wholesaler") ? "wholesaler" 
              : "customer",
      };

      login(userData); 
      
      if (userData.role === "retailer") router.push("/retailer/dashboard");
      else if (userData.role === "wholesaler") router.push("/wholesaler/dashboard");
      else router.push("/");
    } else {
      alert("Incorrect OTP! Please check your email.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Store className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Join Global Baniya</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {step === 1 ? "Enter your details to get started" : "Verify your identity"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 sm:space-y-5">
            {/* 🔴 FULL RESPONSIVE FIX: grid-cols-1 on small mobile, grid-cols-2 on SM and above */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="John" className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Doe" className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {/* 🔴 PADDING FIX */}
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="name@example.com" className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 font-medium text-gray-500">+91</span>
                </div>
                {/* 🔴 PADDING FIX */}
                <input required name="phone" maxLength={10} value={formData.phone} onChange={handleChange} type="tel" placeholder="9876543210" className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-20 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700">Select Your Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10">
                <option value="Customer (Buy Groceries)">Customer (Buy Groceries)</option>
                <option value="Retailer (Local Shop)">Retailer (Local Shop)</option>
                <option value="Wholesaler (Bulk Supply)">Wholesaler (Bulk Supply)</option>
              </select>
            </div>

            <button type="submit" disabled={isProcessing} className="mt-2 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.98] disabled:opacity-70">
              {isProcessing ? "Sending OTP..." : "Get Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-6">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  We've sent a secure 6-digit OTP to your email.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-center text-xs sm:text-sm font-semibold tracking-wide text-gray-600">ENTER OTP</label>
              <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} placeholder="••••••" className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
            </div>

            <button type="submit" disabled={isProcessing} className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.98] disabled:opacity-70">
              {isProcessing ? "Verifying..." : "Verify & Create Account"}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-emerald-600">
                Wrong details? Edit here
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}