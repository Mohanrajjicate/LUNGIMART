
import React, { useState, useMemo } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { products, categories, getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [sortOption, setSortOption] = useState('featured');
  
  const activeCategorySlug = categorySlug || 'all';
  const activeCategory = categories.find(c => c.slug === activeCategorySlug) || { name: 'All Products' };

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
        end
        className={({ isActive }) => 
            `block py-2 text-sm transition-colors ${
                isActive ? 'font-semibold text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'
            }`
        }
    >
        {name}
    </NavLink>
  );

  return (
    <div>
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tighter">{activeCategory.name}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="sticky top-24">
                <h3 className="font-semibold text-lg text-black mb-4">Categories</h3>
                <div className="space-y-2">
                    <CategoryLink slug="all" name="All Products" />
                    {categories.map(cat => (
                      <CategoryLink key={cat.id} slug={cat.slug} name={cat.name} />
                    ))}
                </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{filteredProducts.length} products</p>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black text-sm py-2 pl-3 pr-8"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Alphabetical</option>
                    </select>
                </div>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-gray-500">No products found in this category.</p>
              </div>
            )}
          </main>
        </div>
    </div>
  );
};

export default ShopPage;