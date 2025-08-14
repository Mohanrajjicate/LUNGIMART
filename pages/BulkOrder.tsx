
import React, { useState } from 'react';

const BulkOrderPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-secondary">Thank You!</h1>
        <p className="mt-2 text-gray-600">Your inquiry has been submitted. Our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-secondary mb-2">Bulk Order Inquiry</h1>
      <p className="text-center text-gray-600 mb-8">Planning for a wedding, event, or corporate needs? Fill out the form below.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" id="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"/>
        </div>
        <div>
          <label htmlFor="products" className="block text-sm font-medium text-gray-700">Products of Interest (e.g., Lungi, Dhoti)</label>
          <input type="text" id="products" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"/>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Estimated Quantity</label>
          <input type="number" id="quantity" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"/>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Additional Details</label>
          <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Submit Inquiry
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkOrderPage;
