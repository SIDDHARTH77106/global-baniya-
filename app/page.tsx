'use client';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, MapPin, Clock, ShieldCheck, ChevronRight, 
  Wallet, Zap, TrendingUp, Plus, Store, CalendarDays, ArrowRight 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link'; // 🚀 Yeh import zaroori hai Link tag ke liye

// Map ko bina SSR (Server Side Rendering) ke import karna zaroori hai
const StoreMap = dynamic(() => import('../components/ui/StoreMap'), { ssr: false });

export default function HomePage() {
  return (
    <div className="w-full font-sans bg-gray-50 pb-16">
      
      {/* 🚀 SECTION 1: ULTIMATE PROMOTIONAL HERO BANNER SECTION */}
      <section className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-16 md:py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10"
        >
          <div className="lg:w-3/5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-black shadow-md border border-yellow-300">
               <Zap className="w-4 h-4" /> Pune's Fastest Quick Commerce!
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Aapka Local Bazar,<br/> Ab <span className="text-yellow-400">10 Minute</span> Mein!
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 font-medium leading-relaxed max-w-3xl">
              Fresh groceries, daily milk, and essentials from trusted neighborhood stores delivered instantly.
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-yellow-400 text-blue-900 px-10 py-5 rounded-xl font-black text-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6" /> Explore Stores Near Me
                </button>
                <button className="bg-blue-800 text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-blue-900 transition flex items-center justify-center gap-2">
                   See Daily Milk Subscriptions
                </button>
            </div>
          </div>

          <div className="lg:w-2/5 mt-12 lg:mt-0 w-full flex flex-col md:flex-row lg:flex-col gap-6 items-center">
            
            <motion.div 
                whileHover={{ translateY: -10 }}
                className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl flex items-start gap-4 border border-gray-100 w-full max-w-sm"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner border border-blue-100 shrink-0">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <span className="text-blue-600 text-xs font-black uppercase tracking-wider">NEW USER OFFER</span>
                <h3 className="text-4xl font-black text-blue-900 mt-1">₹100 Credit</h3>
                <p className="text-sm text-gray-600 mt-2 font-medium">Get ₹100 Wallet Credit on your very first order. Shop Now!</p>
              </div>
            </motion.div>
            
            <motion.div 
                whileHover={{ translateY: -10 }}
                className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl flex items-start gap-4 border border-gray-100 w-full max-w-sm"
            >
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shadow-inner border border-yellow-100 shrink-0">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <span className="text-yellow-600 text-xs font-black uppercase tracking-wider">INSTANT DELIVERY</span>
                <h3 className="text-4xl font-black text-blue-900 mt-1">10-Min</h3>
                <p className="text-sm text-gray-600 mt-2 font-medium">Order groceries from nearest stores and get it in under 15 minutes.</p>
              </div>
            </motion.div>
            
          </div>
        </motion.div>
      </section>

      {/* 🚀 SECTION 2: PLATFORM FEATURES (Icon Bar) */}
      <section className="py-10 bg-white shadow-sm border-b border-gray-200 relative z-10 -mt-6 rounded-t-3xl max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Zap, title: "Quick Delivery", text: "10-Min at your doorstep" },
            { icon: MapPin, title: "Local Discovery", text: "Trusted vendors near you" },
            { icon: ShieldCheck, title: "Direct Payment", text: "Secure P2P to vendor" },
            { icon: ShoppingCart, title: "Essentials", text: "Daily milk & groceries" },
          ].map((Feature, idx) => (
             <div key={idx} className="flex flex-col items-center p-3 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shadow-inner border border-blue-100">
                  <Feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-gray-950 text-md leading-tight">{Feature.title}</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">{Feature.text}</p>
             </div>
          ))}
        </div>
      </section>

      {/* 🚀 SECTION 3: MEGA CATEGORY GRID (Dynamic Mock Data) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight">Shop by Category</h2>
              <p className="text-gray-500 font-medium mt-1">Fresh items delivered to your door</p>
            </div>
            <button className="text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-1.5 text-sm md:text-lg bg-blue-50 px-4 py-2 rounded-lg">
                View All <ChevronRight className="w-5 h-5" />
            </button>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {[
            { name: 'Fresh Fruits', icon: '🍎', bg: 'bg-red-50', border: 'border-red-100', hover: 'hover:border-red-300' },
            { name: 'Vegetables', icon: '🥦', bg: 'bg-green-50', border: 'border-green-100', hover: 'hover:border-green-300' },
            { name: 'Dairy & Bread', icon: '🥛', bg: 'bg-blue-50', border: 'border-blue-100', hover: 'hover:border-blue-300' },
            { name: 'Snacks & Chips', icon: '🍟', bg: 'bg-yellow-50', border: 'border-yellow-100', hover: 'hover:border-yellow-300' },
            { name: 'Cold Drinks', icon: '🥤', bg: 'bg-cyan-50', border: 'border-cyan-100', hover: 'hover:border-cyan-300' },
            { name: 'Meat & Eggs', icon: '🥚', bg: 'bg-orange-50', border: 'border-orange-100', hover: 'hover:border-orange-300' },
            { name: 'Personal Care', icon: '🧴', bg: 'bg-pink-50', border: 'border-pink-100', hover: 'hover:border-pink-300' },
            { name: 'Home Care', icon: '🧹', bg: 'bg-purple-50', border: 'border-purple-100', hover: 'hover:border-purple-300' },
            { name: 'Sweet Tooth', icon: '🍫', bg: 'bg-rose-50', border: 'border-rose-100', hover: 'hover:border-rose-300' },
            { name: 'Masala & Oil', icon: '🌶️', bg: 'bg-amber-50', border: 'border-amber-100', hover: 'hover:border-amber-300' },
            { name: 'Baby Care', icon: '🍼', bg: 'bg-teal-50', border: 'border-teal-100', hover: 'hover:border-teal-300' },
            { name: 'Stationery', icon: '✏️', bg: 'bg-indigo-50', border: 'border-indigo-100', hover: 'hover:border-indigo-300' },
          ].map((cat, i) => (
            <motion.div 
              whileHover={{ scale: 1.05, translateY: -5 }}
              key={i} 
              className={`bg-white border ${cat.border} ${cat.hover} p-4 rounded-2xl flex flex-col items-center justify-start cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 group`}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 ${cat.bg} rounded-full mb-3 flex items-center justify-center text-3xl md:text-4xl shadow-inner transition-transform duration-300 group-hover:rotate-6`}>
                {cat.icon}
              </div>
              <span className="font-bold text-gray-800 text-center text-xs md:text-sm leading-tight">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 SECTION 4: TRENDING IN PUNE (Frequently Bought Together) */}
      <section className="pb-16 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-950 tracking-tight">Trending in Pune</h2>
                <p className="text-gray-500 font-medium mt-1">Frequently bought together in your area</p>
              </div>
            </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { id: 1, name: "Amul Taaza Toned Fresh Milk", weight: "500 ml", price: 27, oldPrice: 28, icon: "🥛", tag: "HOT" },
            { id: 2, name: "Aashirvaad Shudh Chakki Atta", weight: "5 kg", price: 210, oldPrice: 250, icon: "🌾", tag: "16% OFF" },
            { id: 3, name: "Farm Fresh Onion (Kanda)", weight: "1 kg", price: 45, oldPrice: 60, icon: "🧅", tag: "" },
            { id: 4, name: "Maggi 2-Minute Noodles", weight: "140 g", price: 30, oldPrice: 30, icon: "🍜", tag: "FAST SELLING" },
            { id: 5, name: "Britannia NutriChoice Digestives", weight: "250 g", price: 50, oldPrice: 65, icon: "🍪", tag: "" }
          ].map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col relative group">
              
              {product.tag && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm z-10">
                  {product.tag}
                </span>
              )}

              <div className="w-full h-36 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                {product.icon}
              </div>
              
              <span className="text-xs text-gray-500 font-bold mb-1">{product.weight}</span>
              <h3 className="font-bold text-gray-800 text-sm leading-snug mb-3 line-clamp-2 h-10">
                {product.name}
              </h3>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-black text-lg text-gray-950">₹{product.price}</span>
                  {product.oldPrice > product.price && (
                    <span className="text-xs text-gray-400 font-semibold line-through decoration-gray-300">₹{product.oldPrice}</span>
                  )}
                </div>
                
                <button className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 px-4 py-2 rounded-lg font-black text-sm flex items-center gap-1 transition-colors">
                  ADD <Plus className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 🚀 SECTION 5: HYPER-LOCAL MAP VIEW (Stores Near You) */}
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
          
          {/* ACTUAL MAP COMPONENT */}
          <div className="z-10 mt-8 md:mt-0 w-full md:w-1/2 h-72 md:h-80 rounded-2xl border-4 border-gray-800 shadow-2xl">
            <StoreMap />
          </div>
        </div>
      </section>

      {/* 🚀 SECTION 6: SUBSCRIPTION CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Subscribe for Daily Essentials</h2>
              <p className="text-gray-600 mt-1 font-medium">Get fresh milk, bread, and eggs delivered every morning at 7 AM.</p>
            </div>
          </div>
          
          {/* 🚀 Yahan humne Button ko hatakar Link tag laga diya hai */}
          <Link href="/subscribe" className="mt-6 md:mt-0 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md whitespace-nowrap">
            Start Subscription <ArrowRight className="w-5 h-5" />
          </Link>

        </div>
      </section>

    </div>
  );
}