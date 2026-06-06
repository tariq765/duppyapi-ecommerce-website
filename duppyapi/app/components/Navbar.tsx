"use client";

import { useState, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false);

  // Handle hydration mismatch by ensuring cart badge only shows after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

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
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <HiSearch size={20} />
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  router.push("/");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <HiX size={18} />
              </button>
            )}
          </form>

          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="/products" className="hover:text-indigo-600 transition">
              Products
            </Link>
            {user && user.role.name === "admin" && (
              <Link href="/admin" className="hover:text-indigo-600 transition font-bold text-indigo-700">
                Admin
              </Link>
            )}
            {user && (
              <Link href="/orders" className="hover:text-indigo-600 transition">
                My Orders
              </Link>
            )}
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
              {isClient && cartCount > 0 && (
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
              {isClient && cartCount > 0 && (
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
        <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top duration-300">
          {/* Mobile Search Bar */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form onSubmit={(e) => { handleSearch(e); setOpen(false); }} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <HiSearch size={18} />
              </span>
            </form>
          </div>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
          >
            Home
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
          >
            Contact
          </Link>
          {user && user.role.name === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600"
            >
              🛠 Admin Dashboard
            </Link>
          )}
          {user && (
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
            >
              📦 My Orders
            </Link>
          )}
          {user ? (
            <div className="border-t border-gray-100 bg-gray-50/50">
              <div className="px-4 py-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Logged in as</span>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium border-t border-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 bg-indigo-600 text-white font-semibold text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 bg-indigo-50 hover:bg-indigo-100 font-semibold text-indigo-700 flex justify-between items-center"
          >
            <span className="flex items-center gap-2">🛒 My Cart</span>
            {isClient && cartCount > 0 && (
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
