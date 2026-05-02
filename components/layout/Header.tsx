'use client';

import { Search, ShoppingCart, User, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/authStore"; 

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // 🚀 Search States
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null); // Search bar ka ref
  const router = useRouter();

  // 🚀 Fake database for search dropdown (Later replace with API)
  const searchSuggestions = [
    { id: 1, name: "Amul Taaza Milk", icon: "🥛", cat: "Dairy" },
    { id: 2, name: "Aashirvaad Atta", icon: "🌾", cat: "Grocery" },
    { id: 3, name: "Farm Fresh Onion", icon: "🧅", cat: "Vegetables" },
    { id: 4, name: "Maggi Noodles", icon: "🍜", cat: "Snacks" },
    { id: 5, name: "Britannia Biscuits", icon: "🍪", cat: "Snacks" },
    { id: 6, name: "Mother Dairy Milk", icon: "🥛", cat: "Dairy" },
  ];

  const filteredSuggestions = searchSuggestions.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.cat.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close User Menu if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      // Close Search Suggestions if clicked outside
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
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

  // 🚀 Navigate to Search Page when form is submitted
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      {/* Logout Modal */}
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

      {/* LE HEADER */}
      <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          
          {/* ==================================================== */}
          {/* DESKTOP VIEW */}
          {/* ==================================================== */}
          <div className="hidden md:flex items-center justify-between gap-6 lg:gap-8">
            
            {/* 1. Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                GB
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight hidden lg:block">
                Global Baniya
              </span>
            </Link>

            {/* 2. Location */}
            <div className="flex flex-col cursor-pointer group shrink-0">
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wide">Delivery in 10 min</span>
              <span className="text-sm font-bold text-gray-800 flex items-center group-hover:text-emerald-700 transition-colors">
                Pune, Maharashtra <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </span>
            </div>

            {/* 3. 🚀 LIVE SEARCH BAR (Desktop) */}
            <div className="flex-1 max-w-3xl relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full bg-gray-100 rounded-2xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:shadow-md transition-all">
                <Search className="w-5 h-5 text-gray-500 shrink-0" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search for 'Atta', 'Dal', 'Milk'..." 
                  className="w-full bg-transparent px-3 outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-medium" 
                />
              </form>

              {/* 🚀 DROPDOWN SUGGESTIONS */}
              {showSuggestions && query.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[150] overflow-hidden">
                  {filteredSuggestions.length > 0 ? (
                    <ul>
                      {filteredSuggestions.map(item => (
                        <li key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors">
                          <Link 
                            href={`/search?q=${item.name}`} 
                            onClick={() => {
                              setShowSuggestions(false);
                              setQuery(item.name);
                            }} 
                            className="flex items-center gap-4 p-4"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{item.icon}</div>
                            <div>
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.cat}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-gray-500 font-medium">No results found for &quot;{query}&quot;</div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Actions (Login, Cart) */}
            <div className="flex items-center gap-4 shrink-0">
              
              {!isAuthenticated ? (
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-emerald-600 transition px-2">
                  Login
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition p-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-bold">{user?.name.split(' ')[0]}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2">
                      <div className="px-5 py-3 border-b border-gray-100">
                        <p className="text-sm font-black text-gray-900">{user?.name}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">{user?.role}</p>
                      </div>
                      <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="block px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">My Orders</Link>
                      <button onClick={() => setIsLogoutModalOpen(true)} className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50">Sign Out</button>
                    </div>
                  )}
                </div>
              )}

              <Link href="/cart" className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition active:scale-95 shadow-md shadow-emerald-200">
                <ShoppingCart className="w-5 h-5" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-black tracking-wider leading-none">2 Items</span>
                  <span className="text-sm leading-tight mt-0.5">₹345</span>
                </div>
              </Link>
              
            </div>
          </div>

          {/* ==================================================== */}
          {/* MOBILE VIEW */}
          {/* ==================================================== */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col cursor-pointer">
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wide">Delivery in 10 min</span>
                <span className="text-sm font-bold text-gray-900 flex items-center">
                  Pune, MH <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
                </span>
              </div>
              
              <Link href="/cart" className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold shadow-md">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">₹345</span>
              </Link>
            </div>

            {/* 🚀 LIVE SEARCH BAR (Mobile) */}
            <div className="relative w-full">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full bg-gray-100 rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <Search className="w-5 h-5 text-gray-500 shrink-0" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search 'Atta', 'Dal'..." 
                  className="w-full bg-transparent px-2 outline-none text-sm font-semibold text-gray-800" 
                />
              </form>

              {/* Mobile Suggestions Dropdown */}
              {showSuggestions && query.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[150] overflow-hidden">
                  {filteredSuggestions.length > 0 ? (
                    <ul>
                      {filteredSuggestions.map(item => (
                        <li key={item.id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                          <Link 
                            href={`/search?q=${item.name}`} 
                            onClick={() => {
                              setShowSuggestions(false);
                              setQuery(item.name);
                            }} 
                            className="flex items-center gap-3 p-3"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">{item.icon}</div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                              <p className="text-[9px] font-black text-emerald-600 uppercase">{item.cat}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm font-medium">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </header>
    </>
  );
}
