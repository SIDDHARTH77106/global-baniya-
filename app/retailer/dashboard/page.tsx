"use client";
import { Store, Package, LogOut } from "lucide-react";
import Link from "next/link";

export default function RetailerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Retailer Portal</h1>
              <p className="text-sm text-gray-500">Manage your local shop inventory & orders</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-red-600 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition">
            <LogOut className="w-4 h-4" /> Exit
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="font-bold text-lg">Today's Orders</h3>
            <p className="text-3xl font-black text-blue-600 mt-2">12</p>
          </div>
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="font-bold text-lg">Low Stock Items</h3>
            <p className="text-3xl font-black text-orange-600 mt-2">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}