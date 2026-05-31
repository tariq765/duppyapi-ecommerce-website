"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  const shippingCost = cartTotal > 100 ? 0 : 10;
  const estimatedTax = cartTotal * 0.05; // 5% tax
  const orderTotal = cartTotal + shippingCost + estimatedTax;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center bg-gray-50">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Go check out some amazing products!</p>
        <Link
          href="/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-150 transition active:scale-[0.98]"
        >
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">{cart.length} Items</span>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/products/${item.product.slug.current}`} className="font-bold text-gray-900 hover:text-indigo-600 transition line-clamp-1">
                          {item.product.title}
                        </Link>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">
                          {item.product.brand || "Generic"}
                        </p>
                        <p className="text-indigo-600 font-extrabold mt-1">${item.product.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-6 items-center w-full sm:w-auto justify-between sm:justify-start">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-200 text-gray-600 transition font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-200 text-gray-600 transition font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100 mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm font-semibold text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-900">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-150 pt-4 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-150 transition active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>
            
            <p className="text-center text-xs text-gray-400 mt-4 font-semibold">
              Prices exclude custom duties if applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
