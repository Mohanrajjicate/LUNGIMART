import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, categories, availableColors, availableSizes } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const ITEMS_PER_PAGE = 9;

const ShopPage: React.FC = () => {
    const { categorySlug } = useParams<{ categorySlug?: string }>();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setSelectedCategories(categorySlug ? [categorySlug] : []);
        setCurrentPage(1);
    }, [categorySlug]);

    const handleCategoryChange = (slug: string) => {
        setSelectedCategories(prev => prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]);
    };

    const handleColorChange = (colorName: string) => {
        setSelectedColors(prev => prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]);
    };

    const handleSizeChange = (size: string) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    };
    
    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: 100});
        setSelectedColors([]);
        setSelectedSizes([]);
    };

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(slug => product.category.slug === slug);
            const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
            const colorMatch = selectedColors.length === 0 || selectedColors.some(color => product.colors.map(c => c.name).includes(color));
            const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size));
            return categoryMatch && priceMatch && colorMatch && sizeMatch;
        });

        return [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating': return b.rating - a.rating;
                default: return b.id - a.id; // newest
            }
        });
    }, [selectedCategories, priceRange, selectedColors, selectedSizes, sortOption]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const activeFiltersCount = selectedCategories.length + selectedColors.length + selectedSizes.length + (priceRange.min !== 0 || priceRange.max !== 100 ? 1 : 0);

    const FilterPill: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
        <span className="flex items-center bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
            {label}
            <button onClick={onRemove} className="ml-2 text-white hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </span>
    );
    
    return (
        <div>
            <div className="text-center bg-surface py-12 px-4 rounded-md">
                <h1 className="text-4xl font-bold text-primary">Our Finest Collection</h1>
                <div className="text-sm text-secondary mt-2">
                    <Link to="/" className="hover:text-primary">Home</Link> / <span>Shop</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <h3 className="font-bold text-lg text-primary mb-4">Filter Options</h3>
                    {/* Category Filter */}
                    <div>
                        <h4 className="font-semibold text-primary mb-3">Category</h4>
                        <div className="space-y-2 text-sm">
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center text-secondary hover:text-primary cursor-pointer">
                                    <input type="checkbox" checked={selectedCategories.includes(cat.slug)} onChange={() => handleCategoryChange(cat.slug)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                    <span className="ml-3">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Price Filter */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-primary mb-3">Price</h4>
                         <div className="flex items-center space-x-2">
                            <input type="number" placeholder="Min" value={priceRange.min} onChange={e => setPriceRange(p => ({...p, min: Number(e.target.value)}))} className="w-full border-gray-300 rounded-md shadow-sm text-sm" />
                            <span>-</span>
                            <input type="number" placeholder="Max" value={priceRange.max} onChange={e => setPriceRange(p => ({...p, max: Number(e.target.value)}))} className="w-full border-gray-300 rounded-md shadow-sm text-sm" />
                        </div>
                    </div>
                     {/* Color Filter */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-primary mb-3">Color</h4>
                        <div className="flex flex-wrap gap-2">
                            {availableColors.map(color => (
                                <button key={color.name} onClick={() => handleColorChange(color.name)} className={`h-8 w-8 rounded-full border-2 ${selectedColors.includes(color.name) ? 'border-accent' : 'border-light-border'}`} style={{ backgroundColor: color.hex, outline: '1px solid rgba(0,0,0,0.1)', outlineOffset: '2px' }} aria-label={color.name}></button>
                            ))}
                        </div>
                    </div>
                     {/* Size Filter */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-primary mb-3">Size</h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {availableSizes.map(size => (
                                <button key={size} onClick={() => handleSizeChange(size)} className={`px-3 py-1 border rounded-md ${selectedSizes.includes(size) ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-light-border'}`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="w-full md:w-3/4 lg:w-4/5">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-light-border">
                        <p className="text-sm text-secondary mb-2 sm:mb-0">Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} results</p>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm text-secondary">Sort by:</label>
                            <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent text-sm py-2 pl-3 pr-8">
                                <option value="newest">Newest</option>
                                <option value="rating">Top Rated</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-sm font-medium">Active Filter:</span>
                            {selectedCategories.map(slug => {
                                const cat = categories.find(c=>c.slug === slug);
                                return cat ? <FilterPill key={slug} label={cat.name} onRemove={() => handleCategoryChange(slug)} /> : null
                            })}
                            {selectedColors.map(color => <FilterPill key={color} label={color} onRemove={() => handleColorChange(color)} />)}
                            {selectedSizes.map(size => <FilterPill key={size} label={size} onRemove={() => handleSizeChange(size)} />)}
                             {(priceRange.min !== 0 || priceRange.max !== 100) && <FilterPill label={`$${priceRange.min} - $${priceRange.max}`} onRemove={() => setPriceRange({min:0, max:100})} />}
                            <button onClick={clearFilters} className="text-sm text-accent hover:underline">Clear All</button>
                        </div>
                    )}
                    
                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                {paginatedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="mt-12 flex justify-center">
                                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                        &larr;
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === i+1 ? 'z-10 bg-accent text-white border-accent' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-lg text-secondary">No products found matching your criteria.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShopPage;