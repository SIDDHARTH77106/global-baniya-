'use client';
import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function LiveSearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fake database for search
  const allProducts = [
    { id: 1, name: "Amul Taaza Milk", icon: "🥛", cat: "Dairy" },
    { id: 2, name: "Aashirvaad Atta", icon: "🌾", cat: "Grocery" },
    { id: 3, name: "Farm Fresh Onion", icon: "🧅", cat: "Vegetables" },
    { id: 4, name: "Maggi Noodles", icon: "🍜", cat: "Snacks" },
    { id: 5, name: "Britannia Biscuits", icon: "🍪", cat: "Snacks" },
    { id: 6, name: "Mother Dairy Milk", icon: "🥛", cat: "Dairy" },
  ];

  // Filter logic
  const suggestions = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.cat.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-xl hidden md:block">
      {/* 🚀 Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search 'Milk', 'Atta'..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full bg-gray-100 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 text-gray-800 font-bold outline-none transition-all shadow-sm"
        />
      </div>

      {/* 🚀 Live Suggestions Dropdown */}
      {showSuggestions && query.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[150] overflow-hidden">
          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map(item => (
                <li key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                  <Link href={`/search?q=${item.name}`} onClick={() => setShowSuggestions(false)} className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-[10px] font-black text-emerald-600 uppercase">{item.cat}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500 font-medium">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
