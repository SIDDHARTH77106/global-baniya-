'use client';

import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import CategoryCircle from '@/components/ui/CategoryCircle'; // 🚀 UI Block connected

export default function Categories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 🚀 MEGA CATEGORY LIST
  const categoryCards = [
    { name: "Fresh\nFruits", images: "🍎", href: "fresh-fruits" },
    { name: "Fresh\nVegetables", images: "🥦", href: "fresh-vegetables" },
    { name: "Dairy, Bread\n& Eggs", images: "🥛", href: "dairy-bread-eggs" },
    { name: "Atta, Rice\n& Dals", images: "🌾", href: "atta-rice-dals" },
    { name: "Masala &\nSpices", images: "🌶️", href: "masala-spices" },
    { name: "Dry Fruits\n& Nuts", images: "🥜", href: "dry-fruits" },
    { name: "Cold Drinks\n& Juices", images: "🥤", href: "beverages" },
    { name: "Sweet\nCravings", images: "🍫", href: "sweets-chocolates" },
    { name: "Snacks &\nNamkeen", images: "🍟", href: "snacks" },
    { name: "Packaged\nFood", images: "🍜", href: "packaged-food" },
    { name: "Meat &\nFish", images: "🥩", href: "meat-fish" },
    { name: "Pharmacy\n& Wellness", images: "💊", href: "pharmacy-wellness" },
    { name: "Feminine\nHygiene", images: "🌸", href: "feminine-hygiene" },
    { name: "Sexual\nWellness", images: "❤️", href: "sexual-wellness" },
    { name: "Home\nNeeds", images: "🪴", href: "home-needs" },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = 300;

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        else scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        if (scrollLeft <= 10) scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        else scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => scroll('right'), 2500);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <section className="bg-white py-8 border-b border-gray-50">
        <div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h2 className="text-xl font-black text-gray-900 mb-5 tracking-tight flex items-center gap-2">
            Shop by Category 
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-wider">
              15+ Options
            </span>
          </h2>

          <div className="relative">
            <button onClick={() => scroll('left')} className="absolute -left-4 top-[40%] -translate-y-1/2 z-10 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 p-2.5 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center hover:bg-gray-50 hover:scale-110">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button onClick={() => scroll('right')} className="absolute -right-4 top-[40%] -translate-y-1/2 z-10 bg-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.25)] border border-gray-800 p-2.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center hover:bg-black hover:scale-110">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden"></div>

            <div ref={scrollRef} className="flex items-start gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-4 pt-1 px-1">
              {categoryCards.map((cat, idx) => (
                // 🚀 Cleaned up using CategoryCircle
                <CategoryCircle 
                  key={idx}
                  name={cat.name}
                  image={cat.images}
                  href={cat.href}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}