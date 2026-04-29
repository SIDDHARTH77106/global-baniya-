'use client';

import { Store, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Next.js mein map ko bina SSR (Server-Side Rendering) ke import karna zaroori hai, 
// warna window is not defined ka error aa sakta hai.
const StoreMap = dynamic(() => import('@/components/ui/StoreMap'), { ssr: false });

export default function StoreMapSection() {
  return (
    <section className="pb-16 max-w-7xl mx-auto px-6">
      <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl border border-gray-800">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="z-10 md:w-1/2 space-y-4 pr-6">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Store className="w-6 h-6" /> Local Vendors
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">Find trusted stores <br/> near your location.</h2>
          <p className="text-gray-300">Support local businesses and get deliveries in under 15 minutes.</p>
          <button className="mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500 transition shadow-lg">
            <MapPin className="w-5 h-5" /> Auto-Detect Location
          </button>
        </div>
        
        <div className="z-10 mt-8 md:mt-0 w-full md:w-1/2 h-72 md:h-80 rounded-2xl border-4 border-gray-800 shadow-2xl overflow-hidden bg-gray-800 flex items-center justify-center relative">
          <StoreMap />
        </div>
      </div>
    </section>
  );
}