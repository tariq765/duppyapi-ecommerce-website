"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Order {
  total_amount: number;
}

export default function AdminDashboard() {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken && user?.role.name === 'admin') {
      fetch(`${API_URL}/orders/admin/all`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      })
      .then(res => res.json())
      .then((data: Order[]) => {
        const totalSales = data.reduce((acc: number, order: Order) => acc + order.total_amount, 0);
        setStats({
          totalOrders: data.length,
          totalSales: totalSales,
          totalUsers: 0 // We'd need a separate endpoint for this, but for now we can estimate
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
    }
  }, [accessToken, user]);

  if (!user || user.role.name !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-red-100 max-w-md">
          <h1 className="text-4xl font-black text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-500 font-bold mb-6">You do not have permission to view the admin dashboard.</p>
          <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 font-bold mt-2">Welcome back, {user.name}. Here is what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-sm font-black uppercase tracking-widest block mb-2">Total Sales</span>
            <span className="text-4xl font-black text-indigo-600">
              {loading ? "..." : `$${stats.totalSales.toFixed(2)}`}
            </span>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-sm font-black uppercase tracking-widest block mb-2">Orders</span>
            <span className="text-4xl font-black text-indigo-600">
              {loading ? "..." : stats.totalOrders}
            </span>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-sm font-black uppercase tracking-widest block mb-2">Growth</span>
            <span className="text-4xl font-black text-green-500">+12%</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/admin/orders" className="group bg-indigo-600 p-8 rounded-3xl shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Manage Orders</h3>
                <p className="text-indigo-100 font-bold">View, track and update customer orders.</p>
              </div>
              <span className="text-4xl group-hover:scale-110 transition-transform">📦</span>
            </div>
          </Link>

          <Link href="/studio" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all transform hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Inventory (Sanity)</h3>
                <p className="text-gray-500 font-bold">Add, edit or delete products from the store.</p>
              </div>
              <span className="text-4xl group-hover:scale-110 transition-transform">🏷️</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
