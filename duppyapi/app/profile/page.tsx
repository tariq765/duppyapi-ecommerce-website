"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { FiUser, FiMail, FiCalendar, FiShield, FiLogOut, FiShoppingBag } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <FiUser size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Account Access</h1>
          <p className="text-gray-500 font-bold mb-8">Please login to view your profile and manage your orders.</p>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/login" className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
              Login
            </Link>
            <Link href="/signup" className="bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Cover/Header */}
          <div className="h-32 bg-indigo-600 w-full relative"></div>
          
          <div className="px-8 pb-10">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 mb-10">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-indigo-600 relative z-10">
                <FiUser size={48} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">
                  {user.role.name} Account
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-100 transition border border-red-100"
              >
                <FiLogOut /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FiShield className="text-indigo-600" /> Account Information
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg text-gray-400">
                      <FiMail />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p className="font-bold text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg text-gray-400">
                      <FiCalendar />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
                      <p className="font-bold text-gray-800">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FiShoppingBag className="text-indigo-600" /> My Shopping
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/orders" className="bg-indigo-50 hover:bg-indigo-100 p-6 rounded-2xl border border-indigo-100 transition group">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-black text-indigo-700">Order History</h3>
                        <p className="text-indigo-600/60 text-sm font-bold">Track and view your orders</p>
                      </div>
                      <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>

                  <Link href="/cart" className="bg-gray-50 hover:bg-gray-100 p-6 rounded-2xl border border-gray-100 transition group">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-black text-gray-900">Shopping Cart</h3>
                        <p className="text-gray-500 text-sm font-bold">View items in your cart</p>
                      </div>
                      <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
