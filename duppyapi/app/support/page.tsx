"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from "react-icons/fi";
import { sendEmail } from "@/app/actions/email";

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = await sendEmail(data);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError("Failed to send message. Please try again later.");
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
            <FiCheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. We have received your message and will get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Contact Us & Support
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Have a question? We're here to help. Send us a message or use our contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  name="subject"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="Order Inquiry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              {error && (
                <p className="text-red-500 text-sm italic">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <FiMail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                <p className="text-gray-600">tariqasghar761@gmail.com</p>
                <p className="text-sm text-gray-400 mt-1">Response time: Within 24 hours</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-xl text-green-600">
                <FiPhone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Call/WhatsApp</h3>
                <p className="text-gray-600">03112194928</p>
                <p className="text-sm text-gray-400 mt-1">Available: 9 AM - 9 PM (PST)</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <FiMapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Our Location</h3>
                <p className="text-gray-600">123 Street, Karachi, Pakistan</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <FiClock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Working Hours</h3>
                <p className="text-gray-600">Mon - Sat: 9:00 AM - 9:00 PM</p>
                <p className="text-gray-600">Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

