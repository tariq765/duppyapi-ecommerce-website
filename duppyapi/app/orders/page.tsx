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
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { accessToken, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (accessToken) {
      fetch(`${API_URL}/orders/me`, {
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
    } else {
        setLoading(false);
    }
  }, [accessToken]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-500 font-bold mb-6">Please sign in to view your order history.</p>
          <Link href="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
            Sign In
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">📦 My Orders</h1>
          <p className="text-gray-500 font-bold mt-2">Track and manage your recent purchases.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-bold">
            ⚠️ {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
            <span className="text-6xl mb-4 block">🛒</span>
            <h2 className="text-2xl font-black text-gray-900">No orders yet!</h2>
            <p className="text-gray-500 font-bold mt-2">Start shopping to see your orders here.</p>
            <Link href="/products" className="inline-block mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-3xl font-black text-gray-900">${order.total_amount.toFixed(2)}</p>
                      <span className="text-xs font-bold text-gray-400 block mt-1 uppercase">via {order.payment_method}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-6">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
                      Items In Order
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-indigo-600 border border-gray-100">
                              {item.quantity}x
                            </span>
                            <span className="font-bold text-gray-700 truncate max-w-[150px]">{item.product_title}</span>
                          </div>
                          <span className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
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
