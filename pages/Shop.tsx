import React, { useState, useMemo, useEffect } from 'react';
import { useParams, NavLink, useLocation } from 'react-router-dom';
import { products, categories, getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  
  const activeCategorySlug = categorySlug || 'all';
  const activeCategory = categories.find(c => c.slug === activeCategorySlug) || { name: 'All Products', slug: 'all' };
  
  // Close filter panel on route change
  useEffect(() => {
    setIsFilterOpen(false);
  }, [location.pathname]);
  
  // Prevent body scroll when filter panel is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);


  const filteredProducts = useMemo(() => {
    let productsToShow = getProductsByCategory(activeCategorySlug);

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

  const CategoryLink: React.FC<{ slug: string, name: string, onClick?: () => void }> = ({ slug, name, onClick }) => (
    <NavLink
        to={slug === 'all' ? '/shop' : `/shop/${slug}`}
        end // Important for 'All Products' link to not stay active
        onClick={onClick}
        className={({ isActive }) => 
            `block w-full text-left px-4 py-2 rounded-md transition-colors font-medium ${
                isActive ? 'bg-primary/10 text-primary font-bold' : 'text-dark hover:bg-light-200'
            }`
        }
    >
        {name}
    </NavLink>
  );
  
  const shopCategories = categories.filter(c => c.slug !== 'all');

  const sidebarContent = (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-xl text-dark mb-4 px-4">Categories</h3>
        <div className="space-y-1">
            <CategoryLink slug="all" name="All Products" onClick={() => setIsFilterOpen(false)} />
            {shopCategories.map(cat => (
              <CategoryLink key={cat.id} slug={cat.slug} name={cat.name} onClick={() => setIsFilterOpen(false)} />
            ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between">
         <h1 className="text-2xl font-bold text-dark capitalize">
            {activeCategory.name}
        </h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-dark bg-white hover:bg-light-200"
        >
          <span>Filters</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Mobile Filter Panel (Off-canvas) */}
      <div className={`fixed inset-0 z-50 transition-transform duration-300 transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative z-10 w-4/5 max-w-sm h-full bg-white p-6 overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {sidebarContent}
          </div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 bg-white p-4 rounded-lg self-start sticky top-28 shadow-sm">
        {sidebarContent}
      </aside>

      {/* Products Grid */}
      <main className="w-full lg:w-3/4 xl:w-4/5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex-1">
              <h1 className="hidden lg:block text-3xl font-bold text-dark">
                  {activeCategory.name}
              </h1>
              <p className="text-sm text-gray-500">{filteredProducts.length} Products Found</p>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-600">Sort by:</label>
                <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-2 text-sm py-2 pl-3 pr-8"
                >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Alphabetical</option>
                </select>
            </div>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-lg shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="mt-4 text-xl text-gray-600">No products found.</p>
            <p className="text-gray-500 mt-2">Try selecting another category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;