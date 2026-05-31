"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

import { useAuth } from "@/app/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { accessToken } = useAuth();
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "payfast"
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = cartTotal > 100 ? 0 : 10;
  const estimatedTax = cartTotal * 0.05;
  const orderTotal = cartTotal + shippingCost + estimatedTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !address || !city || !postalCode || !phone) {
      setValidationError("Please fill out all shipping fields.");
      return;
    }

    if (!accessToken) {
      setValidationError("Please login to place an order.");
      return;
    }

    setIsSubmitting(true);
    setValidationError("");

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: orderTotal,
        shipping_address: { firstName, lastName, email, address, city, postalCode, phone },
        payment_method: paymentMethod
      };

      const res = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to create order");
      }

      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/order-success?order_id=${data.order_id}`);
      } else {
        // PayFast Redirection
        // We need to submit a form to PayFast
        const { payfast_params } = data;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payfast_params.checkout_url;

        // Add all params as hidden inputs
        Object.keys(payfast_params).forEach(key => {
          if (key !== 'checkout_url') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = payfast_params[key];
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err: any) {
      setValidationError(err.message || "An error occurred while placing the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center bg-gray-50">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4 font-black">No items to checkout</h2>
        <Link href="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition">
          Go Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/cart" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-8 transition">
          ← Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Shipping Information</h2>

              {validationError && (
                <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-200">
                  ⚠️ {validationError}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                  />
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                  />
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Karachi"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="75300"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm bg-gray-50 text-gray-900"
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-bold text-gray-700">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">Cash on Delivery</span>
                        <span className="text-xs text-gray-500">Pay when you receive</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'payfast' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="payfast" 
                        checked={paymentMethod === 'payfast'} 
                        onChange={() => setPaymentMethod('payfast')}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">Pay via Card / Wallet</span>
                        <span className="text-xs text-gray-500">Powered by PayFast.pk</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-150 transition active:scale-[0.98] flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  paymentMethod === 'cod' ? 'Confirm Order (COD)' : `Pay Now $${orderTotal.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Items Summary</h2>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex justify-between items-center text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">{item.quantity}x</span>
                    <span className="text-gray-700 line-clamp-1">{item.product.title}</span>
                  </div>
                  <span className="text-indigo-600 font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-900">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-150 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                <span>Order Total</span>
                <span className="text-indigo-600">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
