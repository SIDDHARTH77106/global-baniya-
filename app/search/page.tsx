'use client';

import { useState, useMemo } from 'react';
import { Filter, Star, MapPin, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

// 🚀 Maine data mein thodi variety daal di hai taaki search test kiya ja sake
const allStores = [
  { id: 1, name: "Sharma Kirana", price: 27, dist: 0.5, rating: 4.5, time: 10, item: "Amul Taaza Milk" },
  { id: 2, name: "Verma Mart", price: 210, dist: 1.2, rating: 4.2, time: 15, item: "Aashirvaad Atta" },
  { id: 3, name: "Pune Fresh", price: 28, dist: 0.2, rating: 4.8, time: 8, item: "Amul Taaza Milk" },
  { id: 4, name: "City Supermarket", price: 50, dist: 2.5, rating: 3.9, time: 25, item: "Britannia NutriChoice" },
  { id: 5, name: "Daily Needs", price: 30, dist: 0.8, rating: 4.0, time: 12, item: "Maggi 2-Minute Noodles" },
];

export default function SearchPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) => state.items.length);

  // 🚀 Naya State: Search Query store karne ke liye
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [maxDist, setMaxDist] = useState(3);

  const handleAdd = (store: any) => {
    addToCart({
      id: `${store.id}-${store.item}`,
      name: `${store.item} (${store.name})`,
      price: store.price,
      quantity: 1,
    });
    alert(`${store.item} added from ${store.name}!`);
  };

  // 🚀 Updated Logic: Ab ye Distance, Sort ke sath-sath Text Search bhi karega
  const sortedStores = useMemo(() => {
    let filtered = allStores.filter(s => {
      const matchesDistance = s.dist <= maxDist;
      // Search logic: Product ka naam ya Store ka naam match kare
      const matchesSearch = 
        s.item.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDistance && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'dist') return a.dist - b.dist;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [sortBy, maxDist, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & SEARCH BAR */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Explore Local Stores</h1>
              <p className="text-gray-500 font-medium">Find the best prices near you</p>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 font-bold text-sm">
              Cart items: {cartCount}
            </div>
          </div>

          {/* 🚀 Naya Search Bar UI */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for products (e.g. Milk, Atta) or stores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FILTERS PANEL */}
          <aside className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 font-black text-gray-900 mb-6 border-b pb-4">
                <Filter className="w-5 h-5 text-blue-600" /> Filters
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span>Max Distance</span>
                  <span className="text-blue-600">{maxDist} km</span>
                </div>
                <input 
                  type="range" min="0.5" max="5" step="0.5" 
                  value={maxDist} onChange={(e) => setMaxDist(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="mt-8 space-y-3">
                <label className="text-sm font-bold text-gray-700">Sort By</label>
                <select 
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm outline-none"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="dist">Distance: Nearest First</option>
                  <option value="rating">Rating: Highest First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* STORE LISTING */}
          <main className="lg:w-3/4 space-y-4">
            
            {/* 🚀 Agar koi result na mile toh ye message aayega */}
            {sortedStores.length === 0 && (
              <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-900">No results found</h3>
                <p className="text-gray-500 font-medium mt-1">Try adjusting your filters or search query.</p>
              </div>
            )}

            <AnimatePresence mode='popLayout'>
              {sortedStores.map((store, index) => (
                <motion.div
                  key={store.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white p-5 rounded-2xl shadow-sm border-2 flex flex-col md:flex-row items-center justify-between gap-6 relative ${index === 0 && sortedStores.length > 1 ? 'border-blue-600' : 'border-transparent'}`}
                >
                  {/* Store & Item Info */}
                  <div className="flex items-center gap-4 flex-1 w-full mt-3 md:mt-0">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🏬</div>
                    <div>
                      <h3 className="text-lg font-black text-gray-950 leading-tight">{store.item}</h3>
                      <p className="text-sm font-bold text-gray-500 mt-0.5">from {store.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><MapPin className="w-3 h-3" /> {store.dist} km</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-orange-500" /> {store.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & ADD Button */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-blue-700">₹{store.price}</div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">per unit</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAdd(store)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-blue-700 transition flex items-center gap-2 active:scale-95"
                    >
                      ADD <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Winner Badge */}
                  {index === 0 && sortedStores.length > 1 && (
                    <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                      {sortBy === 'price' ? 'Best Value 💎' : 'Top Choice ⭐'}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}