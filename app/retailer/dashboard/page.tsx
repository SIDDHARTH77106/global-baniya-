'use client';

import { 
  Store, 
  Package, 
  TrendingUp, 
  IndianRupee, 
  ShoppingCart, 
  AlertCircle, 
  ArrowRight, 
  Clock 
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import VendorSidebar from "@/components/layout/VendorSidebar"; 

export default function RetailerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* 🚀 LEFT: Vendor Sidebar (Jo humne pehle banayi thi) */}
      <VendorSidebar />

      {/* 🚀 RIGHT: Main Dashboard Content */}
      <div className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Store className="w-8 h-8 text-emerald-600" /> 
              Store Overview
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome back, <strong className="text-gray-800">{user?.name || 'Retailer'}</strong>! Here's what's happening today.
            </p>
          </div>
          
          <Link href="/admin/inventory" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-md active:scale-95 whitespace-nowrap w-fit">
            <Package className="w-5 h-5" /> Update Stock
          </Link>
        </div>

        {/* 🚀 STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          
          {/* Stat 1: Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-emerald-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <IndianRupee className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1">Today's Revenue</p>
              <h3 className="text-3xl font-black text-gray-900">₹4,250</h3>
            </div>
          </div>

          {/* Stat 2: Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-blue-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1">Active Orders</p>
              <h3 className="text-3xl font-black text-gray-900">12</h3>
            </div>
          </div>

          {/* Stat 3: Low Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-orange-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1">Low Stock Items</p>
              <h3 className="text-3xl font-black text-gray-900">5</h3>
            </div>
          </div>

          {/* Stat 4: Pending Delivery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-purple-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1">Pending Deliveries</p>
              <h3 className="text-3xl font-black text-gray-900">3</h3>
            </div>
          </div>

        </div>

        {/* 🚀 RECENT ORDERS TABLE (Placeholder for now) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
            <Link href="/profile/orders" className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-500 uppercase">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Mock Row 1 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-gray-600">#ORD-9081</td>
                  <td className="p-4 font-bold text-gray-900">Rahul Sharma</td>
                  <td className="p-4 text-sm text-gray-500">2x Milk, 1x Atta</td>
                  <td className="p-4 font-black text-gray-900">₹320</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-yellow-100 text-yellow-700 uppercase">Preparing</span>
                  </td>
                </tr>
                {/* Mock Row 2 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-gray-600">#ORD-9080</td>
                  <td className="p-4 font-bold text-gray-900">Sneha Patil</td>
                  <td className="p-4 text-sm text-gray-500">1x Maggi, 2x Onion</td>
                  <td className="p-4 font-black text-gray-900">₹120</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase">Out for Delivery</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}