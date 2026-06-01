import React from "react";

export default function ShippingPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Shipping Areas</h2>
            <p>
              We currently ship to all major cities across <strong>Pakistan</strong>. 
              We are working on expanding our delivery network to include remote areas and international destinations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Processing Time</h2>
            <p>
              All orders are processed within <strong>1-2 business days</strong>. 
              Orders are not shipped or delivered on weekends or holidays.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Shipping Rates & Delivery Estimates</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Standard Shipping:</strong> 3-5 business days - PKR 200 (Free for orders over PKR 5000).</li>
              <li><strong>Express Shipping:</strong> 1-2 business days - PKR 400 (Selected cities only).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Shipment Confirmation & Tracking</h2>
            <p>
              You will receive a shipment confirmation email containing your tracking number(s) once your order has shipped. 
              The tracking number will be active within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Damages</h2>
            <p>
              <strong>tariq asghar</strong> is not liable for any products damaged or lost during shipping. 
              If you received your order damaged, please contact the shipment carrier to file a claim.
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
