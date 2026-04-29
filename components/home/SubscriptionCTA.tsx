'use client';

import { CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Subscribe for Daily Essentials</h2>
            <p className="text-gray-600 mt-1 font-medium">Get fresh milk, bread, and eggs delivered every morning at 7 AM.</p>
          </div>
        </div>
        
        <Link href="/subscribe" className="mt-6 md:mt-0 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-md whitespace-nowrap transition-colors">
          Start Subscription <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}