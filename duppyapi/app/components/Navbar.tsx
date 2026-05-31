"use client"; // ← ye must hai

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HiMenu, HiX, HiSearch } from "react-icons/hi";
import { useCart } from "@/app/context/CartContext";

import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Tariq MyShop
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <HiSearch size={20} />
            </span>
          </form>

          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-indigo-600 transition">
              Products
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition border border-red-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-indigo-600 transition font-medium">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              href="/cart"
              className="hover:text-indigo-600 transition flex items-center gap-1 font-semibold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm"
            >
              <span>🛒 Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1 min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/cart"
              className="hover:text-indigo-600 transition relative p-2"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <Link
            href="/"
            onClick={() => setOpen(false)} // ← ye ab correct hoga
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Contact
          </Link>
          {user ? (
            <>
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-500">Logged in as</span>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100 font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 bg-indigo-600 text-white font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 bg-indigo-50 hover:bg-indigo-100 font-semibold text-indigo-700 flex justify-between items-center"
          >
            <span>🛒 My Cart</span>
            {cartCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}
