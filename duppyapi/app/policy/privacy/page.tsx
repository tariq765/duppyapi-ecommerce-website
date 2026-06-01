import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong>tariq asghar</strong>. We value your privacy and are committed to protecting your personal data. 
              This policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, make a purchase, 
              or contact our support team. This may include:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Name, email address, and phone number.</li>
              <li>Shipping and billing addresses.</li>
              <li>Payment information (processed securely via our payment partners).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Process and fulfill your orders.</li>
              <li>Communicate with you regarding your account or purchases.</li>
              <li>Send you marketing updates (only if you opt-in).</li>
              <li>Improve our website and customer service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. Your payment information is 
              encrypted and processed through secure payment gateways like Stripe or PayPal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can manage your 
              preferences in your account settings or contact us for assistance.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <p className="text-sm">
              Last Updated: June 2026<br />
              If you have any questions, contact us at <strong>tariqasghar761@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
