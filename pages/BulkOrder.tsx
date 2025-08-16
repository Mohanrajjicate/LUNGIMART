import React from 'react';

const BulkOrderPage: React.FC = () => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your inquiry! We will get back to you shortly.");
    // In a real app, this would send the form data to a server.
    const form = e.target as HTMLFormElement;
    form.reset();
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-dark mb-4">Bulk Orders</h1>
        <p className="text-lg text-gray-600 mb-8">
          Interested in placing a bulk order for your business, event, or institution? <br/>Fill out the form below and our team will get in touch with you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company / Institution Name</label>
          <input type="text" name="company" id="company" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" name="phone" id="phone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product of Interest</label>
          <select id="product" name="product" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20">
            <option>Lungi</option>
            <option>Dhoti</option>
            <option>Matching Dhoti Sets</option>
            <option>Political Party Wear</option>
            <option>Towels</option>
            <option>Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Estimated Quantity</label>
            <input type="number" name="quantity" id="quantity" min="20" required placeholder="Minimum 20 units" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Additional Details / Message</label>
          <textarea name="message" id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary/20"></textarea>
        </div>
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Submit Inquiry
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkOrderPage;