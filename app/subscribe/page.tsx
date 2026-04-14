'use client';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Subscriptions</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-blue-600 p-8 md:p-12 text-white text-center">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">Daily Essentials, On Autopilot.</h1>
            <p className="text-lg text-blue-100 font-medium">Set it and forget it. Fresh milk and bread delivered everyday before 7:00 AM.</p>
          </div>

          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Choose Your Daily Plan</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plan 1 */}
              <motion.div whileHover={{ scale: 1.02 }} className="border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-600 transition relative">
                <div className="text-5xl mb-4">🥛</div>
                <h3 className="text-xl font-bold text-gray-900">Only Milk Plan</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">1 Litre Amul Taaza Daily</p>
                <div className="text-3xl font-black text-blue-600 mb-6">₹65 <span className="text-sm text-gray-400 font-medium">/ day</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500" /> Delivery before 7 AM</li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500" /> Pause anytime</li>
                </ul>
                <button className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition">Select Plan</button>
              </motion.div>

              {/* Plan 2 */}
              <motion.div whileHover={{ scale: 1.02 }} className="border-2 border-blue-600 bg-blue-50/50 rounded-2xl p-6 cursor-pointer relative shadow-md">
                <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-xs font-black px-3 py-1 rounded-bl-xl rounded-tr-xl">MOST POPULAR</div>
                <div className="text-5xl mb-4">🥛🍞</div>
                <h3 className="text-xl font-bold text-gray-900">Morning Breakfast Plan</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">1L Milk + 1 Britannia Bread</p>
                <div className="text-3xl font-black text-blue-600 mb-6">₹105 <span className="text-sm text-gray-400 font-medium">/ day</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500" /> Delivery before 7 AM</li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500" /> Pause anytime</li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500" /> Flat ₹10 Off daily</li>
                </ul>
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Select Plan</button>
              </motion.div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}