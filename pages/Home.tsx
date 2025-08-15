
import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-gray-100">
        <img 
            src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1974&auto=format&fit=crop" 
            alt="Traditional Wear" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative text-white px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter">Pure Cotton Comfort</h1>
            <p className="mt-4 text-lg">Authentic traditional wear from the looms of Komarapalayam.</p>
            <Link 
                to="/shop" 
                className="mt-8 inline-block bg-white text-black font-semibold py-3 px-8 uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
                Shop Now
            </Link>
        </div>
      </section>
      
      {/* Featured Products */}
      <section>
          <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-2">Discover our best-selling traditional wear</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
      </section>
    </div>
  );
};

export default HomePage;