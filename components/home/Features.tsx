'use client';
import { ShoppingCart, MapPin, ShieldCheck, Zap } from 'lucide-react';

export default function Features() {
  const featureList = [
    { icon: Zap, title: "Quick Delivery", text: "10-Min at your doorstep" },
    { icon: MapPin, title: "Local Discovery", text: "Trusted vendors near you" },
    { icon: ShieldCheck, title: "Direct Payment", text: "Secure P2P to vendor" },
    { icon: ShoppingCart, title: "Essentials", text: "Daily milk & groceries" },
  ];

  return (
    <section className="py-10 bg-white shadow-sm border-b border-gray-200 relative z-10 -mt-6 rounded-t-3xl max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {featureList.map((Feature, idx) => (
           <div key={idx} className="flex flex-col items-center p-3 group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition duration-300 shadow-inner border border-emerald-100">
                <Feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-gray-950 text-md leading-tight">{Feature.title}</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">{Feature.text}</p>
           </div>
        ))}
      </div>
    </section>
  );
}