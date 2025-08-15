import React from 'react';
import { getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const PoliticalPartyPage: React.FC = () => {
  const politicalProducts = getProductsByCategory('political-party');

  return (
    <div className="space-y-12">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-4xl font-extrabold text-secondary">Political Party Collection</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary-light">
          Show your allegiance with our specially crafted dhotis and towels, designed for comfort and style during rallies, meetings, and events.
        </p>
      </div>

      {politicalProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {politicalProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <p className="text-xl text-secondary-light">The Political Party collection is currently empty.</p>
          <p className="mt-2 text-gray-500">Please check back later for new additions.</p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link to="/shop" className="bg-secondary text-white font-bold py-3 px-12 rounded-md hover:bg-secondary/90 transition-transform hover:scale-105">
          Shop All Products
        </Link>
      </div>
    </div>
  );
};

export default PoliticalPartyPage;