import React from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const PoliticalPartyPage: React.FC = () => {
  const politicalProducts = getProductsByCategory('political-party');

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-500 via-black to-white text-center">
         <div className="absolute inset-0 bg-black/30"></div>
         <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Political Party Wear</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
                Show your support with our collection of high-quality dhotis and lungis, featuring authentic party colors and symbols.
            </p>
         </div>
      </section>

      {/* Products Grid */}
      <section>
        {politicalProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {politicalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">No political party products are available at this time.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
       <section className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-dark">Looking for a Different Party or Bulk Order?</h2>
            <p className="mt-2 text-gray-600">We can customize orders for various political parties and events.</p>
            <div className="mt-6 flex justify-center gap-4">
                 <Link to="/bulk-order" className="bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent-dark transition-colors">
                    Bulk Inquiry
                </Link>
                <Link to="/shop" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-colors">
                    Shop All Products
                </Link>
            </div>
        </section>
    </div>
  );
};

export default PoliticalPartyPage;