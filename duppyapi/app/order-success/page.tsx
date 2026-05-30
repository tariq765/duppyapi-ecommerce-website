"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
          <span className="text-4xl text-green-600">✓</span>
        </div>

        <h2 className="text-3xl font-black text-gray-900">Order Placed!</h2>
        <p className="text-gray-500 font-semibold text-sm">
          Thank you for your order. We have received it and will contact you soon for confirmation.
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 space-y-2 text-sm font-semibold text-gray-600">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="text-gray-900 font-bold">#{orderId || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="text-indigo-600 font-bold uppercase">Cash on Delivery</span>
          </div>
        </div>

        <Link
          href="/products"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-150 transition active:scale-[0.98]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
