import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../contexts/AppContext';

const PoliticalPartyPage: React.FC = () => {
  const { products } = useAppContext();
  const politicalProducts = products.filter(p => p.category.slug === 'political-party');

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Political Party Wear</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Show your support with our collection of high-quality dhotis and lungis, featuring authentic party colors and symbols.
        </p>
      </section>

      {/* Products Grid */}
      <section>
        {politicalProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {politicalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-xl text-slate-600">No political party products are available at this time.</p>
            <p className="text-slate-500 mt-2">Please check back later.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
       <section className="bg-white p-8 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-slate-900">Looking for a Different Party or Bulk Order?</h2>
            <p className="mt-2 text-slate-600">We can customize orders for various political parties and events.</p>
            <div className="mt-6 flex justify-center gap-4">
                 <Link to="/bulk-order" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                    Bulk Inquiry
                </Link>
                <Link to="/shop" className="bg-slate-100 text-slate-800 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors">
                    Shop All Products
                </Link>
            </div>
        </section>
    </div>
  );
};

export default PoliticalPartyPage;
