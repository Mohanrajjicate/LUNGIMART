
import React, { useState, useMemo } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { products, categories, getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  
  const activeCategorySlug = categorySlug || 'all';

  const filteredProducts = useMemo(() => {
    let productsToShow = activeCategorySlug === 'all' 
      ? products 
      : getProductsByCategory(activeCategorySlug);

    return [...productsToShow].sort((a, b) => {
        switch (sortOption) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            default:
                return 0; // 'featured'
        }
    });
  }, [activeCategorySlug, sortOption]);

  const CategoryLink: React.FC<{ slug: string, name: string }> = ({ slug, name }) => (
    <NavLink
        to={slug === 'all' ? '/shop' : `/shop/${slug}`}
        className={({ isActive }) => 
            `block w-full text-left px-4 py-2 rounded-md transition-colors ${
                isActive ? 'bg-primary text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`
        }
    >
        {name}
    </NavLink>
  );

  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg text-secondary mb-4">Categories</h3>
        <div className="space-y-2">
            <CategoryLink slug="all" name="All Products" />
            {categories.map(cat => (
              <CategoryLink key={cat.id} slug={cat.slug} name={cat.name} />
            ))}
        </div>
      </div>
      <div>
         <h3 className="font-bold text-lg text-secondary mb-4">Sort By</h3>
         <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical</option>
          </select>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {showFilters ? 'Hide' : 'Show'} Filters & Categories
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {showFilters && (
        <aside className="md:hidden w-full bg-white p-6 rounded-lg shadow-lg mb-6">
          {sidebarContent}
        </aside>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
        {sidebarContent}
      </aside>

      {/* Products Grid */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-3xl font-bold text-secondary mb-6 capitalize">
            {activeCategorySlug.replace('-', ' ')}
        </h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;
