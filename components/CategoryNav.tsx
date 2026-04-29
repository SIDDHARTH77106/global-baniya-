'use client';

import Link from 'next/link';
import { 
  LayoutGrid, Wheat, Droplet, Leaf, Star, Package, 
  CupSoda, Sparkles, Beaker, Apple, Cake, Droplets, 
  Home, Baby, Dog, HeartPulse, Flame, Zap, Utensils, 
  Brush, Flower2, Gift
} from 'lucide-react';

export default function CategoryNav() {
  const allCategories = [
    { name: "All Categories", icon: LayoutGrid, active: true },
    { 
      name: "Fruits & Veggies", icon: Apple, active: false, badge: "FRESH",
      subCategories: ["Fresh Fruits", "Fresh Vegetables", "Exotics", "Organic", "Cuts & Sprouts"]
    },
    { 
      name: "Dairy & Bread", icon: Beaker, active: false,
      subCategories: ["Milk", "Bread", "Paneer", "Cheese", "Butter", "Curd", "Eggs"]
    },
    { 
      name: "Atta, Rice & Dal", icon: Wheat, active: false,
      subCategories: ["Atta", "Rice", "Dals", "Flours", "Suji & Rava", "Grains"]
    },
    { 
      name: "Oil & Masala", icon: Droplet, active: false,
      subCategories: ["Cooking Oils", "Ghee", "Spices", "Salt & Sugar", "Jaggery"]
    },
    { 
      name: "Snacks", icon: Flame, active: false, badge: "HOT 🔥",
      subCategories: ["Chips", "Namkeen", "Biscuits", "Popcorn", "Nuts"]
    },
    { 
      name: "Chocolates & Ice Cream", icon: Star, active: false,
      subCategories: ["Chocolates", "Ice Creams", "Desserts", "Cakes", "Munchies"]
    },
    { 
      name: "Cold Drinks & Juices", icon: CupSoda, active: false,
      subCategories: ["Soft Drinks", "Fruit Juices", "Energy Drinks", "Water & Soda", "Health Drinks"]
    },
    { 
      name: "Instant Food", icon: Package, active: false,
      subCategories: ["Noodles", "Pasta", "Ready to Eat", "Breakfast Cereals", "Frozen Food"]
    },
    { 
      name: "Personal Care", icon: Sparkles, active: false,
      subCategories: ["Bath & Body", "Hair Care", "Skin Care", "Oral Care", "Deos", "Hygiene"]
    },
    { 
      name: "Cleaning", icon: Droplets, active: false,
      subCategories: ["Detergents", "Cleaners", "Dishwashers", "Repellents", "Fresheners"]
    },
    { 
      name: "Home & Pooja", icon: Flower2, active: false,
      subCategories: ["Pooja Essentials", "Agarbatti", "Pooja Oil", "Diya", "Camphor"]
    },
    { 
      name: "Baby Care", icon: Baby, active: false,
      subCategories: ["Diapers", "Baby Food", "Skin Care", "Wipes", "Baby Accessories"]
    },
    { 
      name: "Pet Care", icon: Dog, active: false, badge: "NEW 🌟",
      subCategories: ["Dog Food", "Cat Food", "Grooming", "Toys"]
    },
    { 
      name: "Health & Pharma", icon: HeartPulse, active: false,
      subCategories: ["OTC", "Wellness", "Vitamins", "Pain Relief", "First Aid"]
    },
    { 
      name: "Kitchenware", icon: Utensils, active: false,
      subCategories: ["Cookware", "Storage", "Tools", "Tableware"]
    },
    { 
      name: "Electricals", icon: Zap, active: false,
      subCategories: ["Batteries", "Bulbs", "Plugs", "Small Appliances"]
    },
    { 
      name: "Stationery", icon: Brush, active: false,
      subCategories: ["Notebooks", "Pens", "Art Supplies", "Office Needs"]
    },
    { 
      name: "Gifting", icon: Gift, active: false,
      subCategories: ["Gift Packs", "Flowers", "Cards", "Gift Wraps"]
    }
  ];

  const staticCats = allCategories.slice(0, 6);
  const slidingCats = allCategories.slice(6);
  const marqueeItems = [...slidingCats, ...slidingCats, ...slidingCats];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-[72px] md:top-[84px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          
          {/* 🚀 ROW 1: STATIC TOP CATEGORIES */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-4">
            {staticCats.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="relative group">
                  <Link href="#"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-300 ${
                      cat.active 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" 
                        : "bg-white border-gray-100 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${cat.active ? "text-emerald-600" : "text-gray-500 group-hover:text-emerald-600"}`} />
                    <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                  </Link>

                  {/* 🚀 Static Dropdown (Bina Arrow Ke Khulega) */}
                  {cat.subCategories && (
                    <div className="absolute left-0 top-full pt-2 w-56 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] border border-gray-100 py-2">
                        {cat.subCategories.map((sub, i) => (
                          <Link key={i} href="#" className="block px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 🚀 ROW 2: AUTO-SLIDING CATEGORIES */}
          {/* 🔴 Fix: overflow-hidden ki jagah overflow-x-clip use kiya hai taaki dropdown niche khul sake */}
          <div className="relative w-full overflow-x-clip overflow-y-visible border-t border-gray-50 pt-3 group/marquee">
            
            {/* Edge Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-marquee gap-3">
              {marqueeItems.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={idx} className="relative group/item px-1">
                    
                    <Link href="#"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-100 bg-white text-gray-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-sm"
                    >
                      <Icon className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-600 transition-colors" />
                      <span className="text-xs font-bold whitespace-nowrap">{cat.name}</span>
                      
                      {cat.badge && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ml-1 bg-red-100 text-red-600">{cat.badge}</span>
                      )}
                    </Link>

                    {/* 🚀 Sliding Item Dropdown (Bina Arrow Ke Khulega) */}
                    {cat.subCategories && (
                      <div className="absolute left-0 top-full pt-2 w-52 opacity-0 translate-y-2 invisible group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:visible transition-all duration-300 z-[100]">
                        <div className="bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] border border-gray-100 py-1.5">
                          {cat.subCategories.map((sub, i) => (
                            <Link key={i} href="#" className="block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}