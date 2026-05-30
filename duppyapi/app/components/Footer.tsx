"use client"; // client component for interactive icons (optional)

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-500 mb-2">MyShop</h2>
          <p className="text-gray-400">
            Your one-stop shop for the best products online. Quality guaranteed.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-indigo-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-indigo-500 transition">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-indigo-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="bg-gray-900 text-gray-500 text-center py-4">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </div>
    </footer>
  );
}
