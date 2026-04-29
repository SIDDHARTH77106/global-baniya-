'use client';
import { motion } from 'framer-motion';
import { MapPin, Clock, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-16 md:py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10"
      >
        <div className="lg:w-3/5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-emerald-900 px-4 py-2 rounded-full text-sm font-black shadow-md border border-yellow-300">
             <Zap className="w-4 h-4" /> Pune's Fastest Quick Commerce!
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
            Aapka Local Bazar,<br/> Ab <span className="text-yellow-400">10 Minute</span> Mein!
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-50 font-medium leading-relaxed max-w-3xl">
            Fresh groceries, daily milk, and essentials from trusted neighborhood stores delivered instantly.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-yellow-400 text-emerald-900 px-10 py-5 rounded-xl font-black text-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6" /> Explore Stores Near Me
              </button>
              <Link href="/subscribe" className="bg-emerald-800 text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-emerald-900 transition flex items-center justify-center gap-2">
                 See Daily Milk Subscriptions
              </Link>
          </div>
        </div>

        <div className="lg:w-2/5 mt-12 lg:mt-0 w-full flex flex-col md:flex-row lg:flex-col gap-6 items-center">
          {/* Offer Card 1 */}
          <motion.div whileHover={{ translateY: -10 }} className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl flex items-start gap-4 border border-gray-100 w-full max-w-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner border border-emerald-100 shrink-0">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <span className="text-emerald-600 text-xs font-black uppercase tracking-wider">NEW USER OFFER</span>
              <h3 className="text-4xl font-black text-emerald-900 mt-1">₹100 Credit</h3>
              <p className="text-sm text-gray-600 mt-2 font-medium">Get ₹100 Wallet Credit on your very first order.</p>
            </div>
          </motion.div>
          
          {/* Offer Card 2 */}
          <motion.div whileHover={{ translateY: -10 }} className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl flex items-start gap-4 border border-gray-100 w-full max-w-sm">
            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shadow-inner border border-yellow-100 shrink-0">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-yellow-600 text-xs font-black uppercase tracking-wider">INSTANT DELIVERY</span>
              <h3 className="text-4xl font-black text-emerald-900 mt-1">10-Min</h3>
              <p className="text-sm text-gray-600 mt-2 font-medium">Order groceries from nearest stores and get it in under 15 minutes.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}