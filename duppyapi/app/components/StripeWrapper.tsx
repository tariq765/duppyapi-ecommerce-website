"use client";

import React, { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function StripeWrapper({ children }: { children: React.ReactNode }) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/payment/config`)
      .then((r) => r.json())
      .then((data) => {
        const { publishableKey } = data;
        setStripePromise(loadStripe(publishableKey));
      })
      .catch(err => console.error("Failed to load stripe config", err));
  }, []);

  if (!stripePromise) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5 text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Initializing Payment Gateway...</h2>
        </div>
      );
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
}
