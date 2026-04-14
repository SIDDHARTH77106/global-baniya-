'use client';
import { Search, ShoppingCart, User, MapPin, Menu, ChevronDown, Wallet, Heart, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* MAIN NAVBAR */}
      <div className="bg-blue-600 w-full py-3 px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <Menu className="text-white w-6 h-6 md:hidden cursor-pointer" />
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-blue-900 font-black text-xl shadow-inner">
              GB
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight hidden sm:block">
              Global Baniya
            </span>
          </Link>
        </div>

        {/* Smart Location Selector (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-lg cursor-pointer transition">
          <MapPin className="w-5 h-5 text-yellow-400" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold opacity-80 leading-none">Deliver to</span>
            <span className="font-bold text-sm leading-tight flex items-center gap-1">
              Kothrud, Pune <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl bg-white rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
          <input 
            type="text" 
            placeholder="Search for 'Amul Milk', 'Aata', or 'Sharma Kirana'..." 
            className="w-full px-4 py-2.5 outline-none text-gray-700 text-sm font-medium"
          />
          <button className="bg-yellow-400 text-blue-900 px-6 py-2.5 font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>

        {/* User Actions (Cart & Profile) */}
        <div className="flex items-center gap-6 text-white">
          
          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 group-hover:text-yellow-400 transition" />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-md border border-white">
                2
              </span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold opacity-80 leading-none">Total</span>
              <span className="font-bold text-sm leading-tight">₹345</span>
            </div>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-yellow-200 transition"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="bg-blue-800 p-1.5 rounded-full">
                <User className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm hidden md:block">Siddharath <ChevronDown className="w-3 h-3 inline" /></span>
            </div>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 text-gray-800 overflow-hidden py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-bold">Siddharath Gautam</p>
                  <p className="text-xs text-gray-500 font-medium">+91 98765 43210</p>
                </div>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold hover:bg-blue-50 transition">
                  <Wallet className="w-4 h-4 text-blue-600" /> Wallet Balance: <span className="text-green-600">₹100</span>
                </Link>
                <Link href="/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-sm font-medium">
                  <ShoppingCart className="w-4 h-4 text-gray-400" /> My Orders
                </Link>
                <Link href="/saved" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition text-sm font-medium">
                  <Heart className="w-4 h-4 text-gray-400" /> Saved Stores
                </Link>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition w-full text-left text-sm font-medium">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}