"use client";

import React, { useState } from "react";
import { Product } from "@/app/interface";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <div className="flex gap-4">
      <motion.button
        whileHover={product.stock > 0 ? { scale: 1.03, y: -2 } : {}}
        whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`flex-1 font-semibold py-3 px-6 rounded-xl transition shadow-lg ${
          product.stock <= 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            : added
            ? "bg-green-600 text-white shadow-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-blue-200"
        }`}
      >
        {product.stock <= 0 ? "Out of Stock" : added ? "Added to Cart! ✓" : "Add to Cart"}
      </motion.button>
      <motion.button
        whileHover={product.stock > 0 ? { scale: 1.03, y: -2 } : {}}
        whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
        onClick={handleBuyNow}
        disabled={product.stock <= 0}
        className={`flex-1 border font-semibold py-3 px-6 rounded-xl transition ${
          product.stock <= 0
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
        }`}
      >
        Buy Now
      </motion.button>
    </div>
  );
}
