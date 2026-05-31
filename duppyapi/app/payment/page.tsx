"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import StripeWrapper from "@/app/components/StripeWrapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function PaymentContent() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  // Payment Status Flow
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [shippingDetails, setShippingDetails] = useState<any>(null);

  useEffect(() => {
    // Retrieve shipping info from checkout
    const info = sessionStorage.getItem("shippingInfo");
    if (info) {
      setShippingDetails(JSON.parse(info));
    }
  }, []);

  const shippingCost = cartTotal > 100 ? 0 : 10;
  const estimatedTax = cartTotal * 0.05;
  const orderTotal = cartTotal + shippingCost + estimatedTax;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setStatus("processing");
    setErrorMessage("");

    try {
      // 1. Create Payment Intent on backend
      const res = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(orderTotal * 100), // Amount in cents
          currency: "usd",
        }),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");
      const { clientSecret } = await res.json();

      // 2. Confirm Payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingDetails ? `${shippingDetails.firstName} ${shippingDetails.lastName}` : "Customer",
            email: shippingDetails?.email || "",
          },
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setStatus("success");
        clearCart();
        sessionStorage.removeItem("shippingInfo");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred");
    }
  };

  if (cart.length === 0 && status !== "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center bg-gray-50">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">No active payment session</h2>
        <Link href="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition">
          Browse Products
        </Link>
      </div>
    );
  }

  // Success view
  if (status === "success") {
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
            <span className="text-4xl text-green-600 animate-bounce">✓</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900">Payment Successful!</h2>
          <p className="text-gray-500 font-semibold text-sm">
            Thank you for your purchase. Your order has been placed and is currently being processed.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 divide-y divide-gray-200 text-sm font-semibold text-gray-600 space-y-3">
            <div className="pb-3 flex justify-between">
              <span>Order Number</span>
              <span className="text-gray-900 font-bold">#DS-{orderNum}</span>
            </div>
            {shippingDetails && (
              <div className="py-3 space-y-1">
                <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold">Delivery Address</span>
                <span className="block text-gray-950 font-bold">
                  {shippingDetails.firstName} {shippingDetails.lastName}
                </span>
                <span className="block text-gray-700 text-xs">
                  {shippingDetails.address}, {shippingDetails.city}
                </span>
              </div>
            )}
            <div className="pt-3 flex justify-between text-base font-extrabold text-indigo-600">
              <span>Amount Paid</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/products")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-150 transition active:scale-[0.98]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Processing view
  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5 text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Processing Secure Payment...</h2>
        <p className="text-gray-500 font-semibold text-sm">Please do not close or refresh this page.</p>
      </div>
    );
  }

  // Default input view
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/checkout" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-8 transition">
          ← Back to Checkout
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Payment Gateway</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handlePay} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Secure Payment Details</h2>

              {status === "error" && (
                <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-200">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1a1a1a',
                          '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#dc2626' },
                      },
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!stripe}
                className="w-full bg-indigo-600 disabled:bg-gray-400 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-150 transition active:scale-[0.98]"
              >
                Pay Securely ${orderTotal.toFixed(2)}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Final Bill</h2>
            <div className="space-y-3 text-sm font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-950">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-950">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="text-gray-950">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-indigo-600">
                <span>Total Amount</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-xs font-semibold text-indigo-700 flex gap-2">
              <span className="text-base">🛡️</span>
              <span>SSL 256-Bit Secure Encryption. Your payment details are fully tokenized via Stripe.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <StripeWrapper>
      <PaymentContent />
    </StripeWrapper>
  );
}
