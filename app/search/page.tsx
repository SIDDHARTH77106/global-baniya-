'use client';
import { useState, useMemo } from 'react';
import { Filter, Star, MapPin, Clock, ArrowUpDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCartStore } from '@/store/cartStore';

const allStores = [
  { id: 1, name: "Sharma Kirana", price: 27, dist: 0.5, rating: 4.5, time: 10, item: "Amul Taaza Milk" },
  { id: 2, name: "Verma Mart", price: 26, dist: 1.2, rating: 4.2, time: 15, item: "Amul Taaza Milk" },
  { id: 3, name: "Pune Fresh", price: 28, dist: 0.2, rating: 4.8, time: 8, item: "Amul Taaza Milk" },
  { id: 4, name: "City Supermarket", price: 25, dist: 2.5, rating: 3.9, time: 25, item: "Amul Taaza Milk" },
  { id: 5, name: "Daily Needs", price: 27.5, dist: 0.8, rating: 4.0, time: 12, item: "Amul Taaza Milk" },
];

export default function SearchPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) => state.items.length);

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

  const sortedStores = useMemo(() => {
    let filtered = allStores.filter(s => s.dist <= maxDist);
    return filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'dist') return a.dist - b.dist;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [sortBy, maxDist]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Search Results for "Amul Milk"</h1>
              <p className="text-gray-500 font-medium">Comparing prices from {sortedStores.length} local stores</p>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 font-bold text-sm">
              Cart items: {cartCount}
            </div>
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
            <AnimatePresence mode='popLayout'>
              {sortedStores.map((store, index) => (
                <motion.div
                  key={store.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`bg-white p-5 rounded-2xl shadow-sm border-2 flex flex-col md:flex-row items-center justify-between gap-6 relative ${index === 0 ? 'border-blue-600' : 'border-transparent'}`}
                >
                  {/* Store Info */}
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🏬</div>
                    <div>
                      <h3 className="text-lg font-black text-gray-950">{store.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-500"><MapPin className="w-3 h-3" /> {store.dist} km</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-500"><Star className="w-3 h-3 fill-orange-500" /> {store.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & ADD Button */}
                  <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <div className="text-center md:text-right flex-1 md:flex-none">
                      <div className="text-2xl font-black text-blue-700">₹{store.price}</div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">per unit</span>
                    </div>
                    
                    {/* 4. Asli ADD button jo handleAdd function call karega */}
                    <button 
                      onClick={() => handleAdd(store)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-blue-700 transition flex items-center gap-2 active:scale-95"
                    >
                      ADD <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Winner Badge */}
                  {index === 0 && (
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