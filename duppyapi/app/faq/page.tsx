"use client";

import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package. You can also view your order status in the 'My Account' section."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, Mastercard, American Express, PayPal, and Cash on Delivery (selected areas)."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unused products in their original packaging. Please visit our Return Policy page for more details."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Pakistan. We are planning to expand our services to other countries soon."
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery usually takes 3-5 business days. Express delivery (available in selected cities) takes 1-2 business days."
  },
  {
    question: "How can I cancel my order?",
    answer: "You can cancel your order within 2 hours of placing it by contacting our support team. Once the order is processed, it cannot be cancelled."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 text-gray-600 border-t border-gray-100 animate-in fade-in duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="mb-6">Our support team is always ready to help you.</p>
          <a
            href="/support"
            className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
