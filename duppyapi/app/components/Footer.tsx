"use client";

import Link from "next/link";
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp, FaTwitter, FaSkype } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=100064853105892", icon: FaFacebook, color: "#1877F2" },
  { href: "https://www.youtube.com/@tariqasghar6893", icon: FaYoutube, color: "#FF0000" },
  { href: "https://www.instagram.com", icon: FaInstagram, color: "#E4405F" },
  { href: "https://wa.me/923402053859", icon: FaWhatsapp, color: "#25D366" },
  { href: "https://twitter.com", icon: FaTwitter, color: "#1DA1F2" },
  { href: "https://www.skype.com", icon: FaSkype, color: "#00AFF0" }
];

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/products" },
    { label: "Best Sellers", href: "/products" },
  ],
  account: [
    { label: "My Account", href: "/profile" },
    { label: "Order History", href: "/profile/orders" },
    { label: "Wishlist", href: "/profile/wishlist" },
    { label: "Track Order", href: "/profile/orders" },
  ],
  support: [
    { label: "Help Center", href: "/support" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/support" },
    { label: "Returns", href: "/policy/returns" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/policy/privacy" },
    { label: "Terms of Service", href: "/policy/terms" },
    { label: "Shipping Policy", href: "/policy/shipping" },
    { label: "Return Policy", href: "/policy/returns" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-400">
                Get the latest updates on new products and exclusive offers.
              </p>
            </div>
            <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info - 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">tariq asghar</h3>
            <p className="text-gray-400 mb-6">
              Your trusted destination for quality products at great prices. 
              We deliver excellence with every order.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <FiMapPin className="w-5 h-5 flex-shrink-0" />
                <span>123 Street, City, Country</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiPhone className="w-5 h-5 flex-shrink-0" />
                <span>03112194928</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FiMail className="w-5 h-5 flex-shrink-0" />
                <span>tariqasghar761@gmail.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map(({ href, icon: Icon, color }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-2xl"
                  style={{ color }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Links */}
          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} tariq asghar. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex gap-2">
                {["Visa", "MC", "Amex", "PayPal"].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
