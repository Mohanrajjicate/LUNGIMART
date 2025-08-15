
import React from 'react';
import { getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const PoliticalPartyPage: React.FC = () => {
  const politicalProducts = getProductsByCategory('political-party');

  return (
    <div className="space-y-12">
      <div className="text-center p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tighter">Political Party Collection</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Show your allegiance with our specially crafted dhotis and towels.
        </p>
      </div>

      {politicalProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {politicalProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">The Political Party collection is currently empty.</p>
          <p className="mt-2 text-gray-500">Please check back later for new additions.</p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link to="/shop" className="bg-black text-white font-semibold py-3 px-12 rounded-md hover:bg-gray-800 transition-colors uppercase tracking-wider">
          Shop All
        </Link>
      </div>
    </div>
  );
};

export default PoliticalPartyPage;