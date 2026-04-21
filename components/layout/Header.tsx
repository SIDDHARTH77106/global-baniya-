'use client';

import { Search, ShoppingCart, User, MapPin, Menu, ChevronDown, Wallet, LogOut, X, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/authStore"; 

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    setIsUserMenuOpen(false);
    router.push('/login'); 
  };

  return (
    <>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
              <button onClick={() => setIsLogoutModalOpen(false)} className="rounded-full p-2 hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Hey <strong>{user?.name.split(' ')[0]}</strong>, are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleLogout} className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 shadow-lg shadow-red-100 transition active:scale-95">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="bg-blue-600 w-full py-3 px-4 md:px-8 flex items-center justify-between gap-3 md:gap-4">
          
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white hover:text-yellow-400 transition">
              <Menu className="w-7 h-7" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-900 font-black text-lg md:text-xl shadow-inner">
                GB
              </div>
              <span className="text-xl md:text-2xl font-black text-white tracking-tighter hidden sm:block">
                Global Baniya
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-white bg-blue-700/50 hover:bg-blue-800 px-3 py-2 rounded-xl cursor-pointer transition border border-blue-500/30">
            <MapPin className="w-5 h-5 text-yellow-400" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-black opacity-80 tracking-wide">Deliver to</span>
              <span className="font-bold text-xs flex items-center">Pune, MH <ChevronDown className="w-3 h-3 ml-1" /></span>
            </div>
          </div>

          <form className="hidden md:flex flex-1 max-w-2xl bg-white rounded-xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all ml-4">
            <input type="text" placeholder="Search for groceries, brands, or local shops..." className="w-full px-5 py-3 outline-none text-sm font-medium text-gray-700" />
            <button type="submit" className="bg-yellow-400 text-blue-900 px-6 font-black hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" /> Search
            </button>
          </form>

          <div className="flex items-center gap-5 md:gap-6 text-white ml-auto md:ml-0">
            
            <Link href="/wishlist" className="hidden lg:block text-white hover:text-yellow-400 transition">
              <Heart className="w-6 h-6" />
            </Link>

            <Link href="/cart" className="flex items-center gap-2 group relative">
              <div className="relative">
                <ShoppingCart className="w-7 h-7 md:w-6 md:h-6 group-hover:text-yellow-400 transition" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-black rounded-full w-5 h-5 md:w-4 md:h-4 flex items-center justify-center border-2 border-blue-600 shadow-sm">
                  2
                </span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[9px] font-black opacity-80 uppercase">Cart</span>
                <span className="font-bold text-xs">₹345</span>
              </div>
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold hover:text-yellow-400 hidden sm:block transition">
                  Login
                </Link>
                <Link href="/register" className="bg-yellow-400 text-blue-900 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-black hover:bg-yellow-500 transition shadow-lg shadow-blue-800/20 active:scale-95">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 outline-none hover:opacity-80 transition"
                >
                  <div className="bg-blue-800 p-2 rounded-full border border-blue-400 shadow-sm">
                    <User className="w-5 h-5 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-[9px] font-black opacity-80 uppercase tracking-widest text-yellow-400">{user?.role}</span>
                    <span className="font-bold text-xs flex items-center">{user?.name.split(' ')[0]} <ChevronDown className="w-3 h-3 ml-1" /></span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 text-gray-800 overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-base font-black text-gray-900">{user?.name}</p>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.role} Account</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition text-sm font-bold text-gray-700">
                      <Wallet className="w-5 h-5 text-blue-600" /> Wallet Balance: <span className="text-green-600 ml-auto">₹100</span>
                    </Link>
                    <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition text-sm font-bold text-gray-700">
                      <ShoppingCart className="w-5 h-5 text-gray-400" /> My Orders
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 w-full text-left text-sm font-bold transition"
                      >
                        <LogOut className="w-5 h-5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden bg-blue-600 px-4 pb-4">
          <form className="flex w-full bg-white rounded-xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
            <input type="text" placeholder="Search products or stores..." className="w-full px-4 py-3 outline-none text-sm font-medium text-gray-700" />
            <button type="submit" className="bg-yellow-400 text-blue-900 px-5 flex items-center justify-center hover:bg-yellow-500 transition-colors">
              <Search className="w-5 h-5 font-black" />
            </button>
          </form>
        </div>
      </header>
    </>
  );
}