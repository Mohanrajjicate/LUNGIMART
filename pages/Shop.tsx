
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { categories, getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [sortOption, setSortOption] = useState('featured');
  
  const activeCategorySlug = categorySlug || 'all';
  
  const activeCategory = useMemo(() => 
    categories.find(c => c.slug === activeCategorySlug) || { name: 'All Products', slug: 'all' },
    [activeCategorySlug]
  );
  
  const shopCategories = useMemo(() => {
    const allCat = categories.find(c => c.slug === 'all');
    const otherCats = categories.filter(c => c.slug !== 'all');
    return allCat ? [allCat, ...otherCats] : otherCats;
  }, []);

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

  // Category Scroller Logic
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
        const tolerance = 1;
        const isScrollable = el.scrollWidth > el.clientWidth + tolerance;
        setCanScrollLeft(el.scrollLeft > tolerance);
        setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance);
    }
  }, []);

  useEffect(() => {
      const el = scrollContainerRef.current;
      if (el) {
          const timer = setTimeout(checkScrollButtons, 100);
          el.addEventListener('scroll', checkScrollButtons);
          window.addEventListener('resize', checkScrollButtons);
          return () => {
              clearTimeout(timer);
              el.removeEventListener('scroll', checkScrollButtons);
              window.removeEventListener('resize', checkScrollButtons);
          };
      }
  }, [checkScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
      const el = scrollContainerRef.current;
      if (el) {
          const scrollAmount = el.clientWidth * 0.7;
          el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
  };
  
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Categories Section */}
      <section className="-mt-4 md:-mt-8">
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 snap-x no-scrollbar scroll-smooth"
        >
          {shopCategories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <NavLink 
                key={cat.id} 
                to={cat.slug === 'all' ? '/shop' : `/shop/${cat.slug}`} 
                end
                className="text-center group flex-shrink-0 snap-center"
              >
                <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 transform group-hover:scale-105 transition-all duration-300 ${isActive ? 'border-primary shadow-lg' : 'border-white shadow-md group-hover:shadow-xl'}`}>
                  <img src={cat.image || 'https://picsum.photos/seed/placeholder/400'} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <p className={`mt-3 font-semibold text-sm transition-colors w-24 md:w-28 break-words ${isActive ? 'text-primary' : 'text-slate-700 group-hover:text-primary'}`}>{cat.name}</p>
              </NavLink>
            );
          })}
        </div>
        <div className="mt-4 hidden md:flex justify-center items-center gap-4">
          <button
            onClick={() => handleScroll('left')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-default"
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-default"
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <main>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                  {activeCategory.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{filteredProducts.length} Products Found</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
                <label htmlFor="sort" className="text-sm font-medium text-slate-600 whitespace-nowrap">Sort by:</label>
                <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border-slate-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 text-sm py-2 pl-3 pr-8"
                >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Alphabetical</option>
                </select>
            </div>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="mt-4 text-xl text-slate-600">No products found.</p>
            <p className="text-slate-500 mt-2">Try selecting another category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;