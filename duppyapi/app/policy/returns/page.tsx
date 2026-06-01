import React from "react";

export default function ReturnPolicy() {
  return (
    <div className="bg-white min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Return & Refund Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Returns</h2>
            <p>
              You have <strong>7 calendar days</strong> to return an item from the date you received it. 
              To be eligible for a return, your item must be unused and in the same condition that you received it. 
              Your item must be in the original packaging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Refunds</h2>
            <p>
              Once we receive your item, we will inspect it and notify you that we have received your returned item. 
              If your return is approved, we will initiate a refund to your original method of payment (or bank transfer). 
              You will receive the credit within a certain amount of days, depending on your card issuer's policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Shipping Costs</h2>
            <p>
              You will be responsible for paying for your own shipping costs for returning your item. 
              Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Non-Returnable Items</h2>
            <p>
              Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), 
              custom products (such as special orders or personalized items), and personal care goods (such as beauty products).
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
