"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface OrderItem {
  product_title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_name: string;
  user_email: string;
  total_amount: number;
  status: string;
  payment_method: string;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  created_at: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { accessToken, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (accessToken) {
      fetch(`${API_URL}/orders/admin/all`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [accessToken]);

  if (!user || user.role.name !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-red-100">
          <h1 className="text-4xl font-black text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-500 font-bold mb-6">You do not have permission to view this page.</p>
          <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">📦 Customer Orders</h1>
            <p className="text-gray-500 font-bold mt-1">Manage and track all customer purchases.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-gray-400 text-sm font-bold block uppercase tracking-wider">Total Orders</span>
            <span className="text-2xl font-black text-indigo-600">{orders.length}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-bold">
            ⚠️ {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
            <span className="text-6xl mb-4 block">🛒</span>
            <h2 className="text-2xl font-black text-gray-900">No orders found!</h2>
            <p className="text-gray-500 font-bold mt-2">When customers start buying, their orders will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-indigo-100">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                          order.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 
                          order.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                          'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900">{order.user_name}</h3>
                      <p className="text-sm font-bold text-gray-400">{order.user_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="text-3xl font-black text-indigo-600">${order.total_amount.toFixed(2)}</p>
                      <span className="text-xs font-bold text-gray-400 block mt-1">via {order.payment_method.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        🛍️ Ordered Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                              <span className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-indigo-600 border border-gray-100">
                                {item.quantity}x
                              </span>
                              <span className="font-bold text-gray-700">{item.product_title}</span>
                            </div>
                            <span className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Details */}
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        📍 Shipping Address
                      </h4>
                      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-2 text-sm font-bold text-gray-700">
                        <p className="text-indigo-600 font-black">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.postalCode}</p>
                        <p className="pt-2 flex items-center gap-2">
                          <span className="text-gray-400">📞</span> {order.shipping_address.phone}
                        </p>
                        <p className="text-[10px] text-gray-300 pt-4 uppercase">Placed on: {new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
