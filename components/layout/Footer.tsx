'use client';
import Link from 'next/link';
import { Globe, Smartphone, ShieldCheck, CreditCard, ChevronDown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 mt-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* 1. Brand & App Links Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-blue-900 font-black text-xl shadow-inner">
              GB
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Global Baniya
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Pune&apos;s fastest hyper-local e-commerce platform. Connecting you to your trusted neighborhood stores in under 15 minutes.
          </p>
          
          {/* App Download Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Download Our App</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2.5 rounded-lg transition">
                <Smartphone className="w-5 h-5 text-white" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none text-gray-400">GET IT ON</span>
                  <span className="text-sm font-bold leading-tight">Google Play</span>
                </div>
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2.5 rounded-lg transition">
                <span className="text-2xl leading-none">🍏</span> {/* Placeholder for Apple Icon */}
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] leading-none text-gray-400">Download on the</span>
                  <span className="text-sm font-bold leading-tight">App Store</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-yellow-400 transition">About Us</Link></li>
            <li><Link href="/vendor/register" className="hover:text-yellow-400 transition">Register as Vendor <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded ml-2 font-bold">NEW</span></Link></li>
            <li><Link href="/track" className="hover:text-yellow-400 transition">Track Your Order</Link></li>
            <li><Link href="/wallet" className="hover:text-yellow-400 transition">eWallet & Rewards</Link></li>
          </ul>
        </div>

        {/* 3. Legal Policies */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Legal & Policies</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/policies/terms" className="hover:text-yellow-400 transition flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gray-500" /> Terms of Service</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-yellow-400 transition flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gray-500" /> Privacy Policy</Link></li>
            <li><Link href="/policies/refund" className="hover:text-yellow-400 transition flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-500" /> Refund & Cancellation</Link></li>
            <li><Link href="/policies/shipping" className="hover:text-yellow-400 transition flex items-center gap-2"><Globe className="w-4 h-4 text-gray-500" /> Shipping Policy</Link></li>
          </ul>
        </div>

        {/* 4. Support & Language */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Support & Language</h3>
          <ul className="space-y-3 text-sm mb-6">
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">📞</span> <div><span className="block text-white font-bold">1800-890-1222</span><span className="text-xs text-gray-500">24/7 Toll-Free</span></div></li>
            <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✉️</span> support@globalbaniya.com</li>
          </ul>

          {/* Multi-language Toggle (EN/HI/MR) */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-1 inline-flex items-center gap-2 relative group cursor-pointer hover:bg-gray-700 transition">
            <div className="bg-gray-900 p-2 rounded flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-white pr-2 border-r border-gray-700">English</span>
            </div>
            <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm">
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="mr">मराठी (MR)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 mr-3" />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">More languages coming soon.</p>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Global Baniya Inc. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0 font-medium">
          <span>Made with ❤️ in Pune</span>
        </div>
      </div>
    </footer>
  );
}
