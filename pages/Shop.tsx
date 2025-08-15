
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  
  const [activeFilters, setActiveFilters] = useState({
    category: categorySlug || 'all',
    price: { min: 0, max: 250 },
    colors: [] as string[],
    sizes: [] as string[],
  });
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const handleCategoryChange = (slug: string) => {
    setActiveFilters(prev => ({ ...prev, category: slug }));
  };

  const handleColorToggle = (colorName: string) => {
     setActiveFilters(prev => ({
        ...prev,
        colors: prev.colors.includes(colorName)
            ? prev.colors.filter(c => c !== colorName)
            : [...prev.colors, colorName]
     }));
  };

  const handleSizeToggle = (size: string) => {
     setActiveFilters(prev => ({
        ...prev,
        sizes: prev.sizes.includes(size)
            ? prev.sizes.filter(s => s !== size)
            : [...prev.sizes, size]
     }));
  };
  
  const filteredProducts = useMemo(() => {
    let productsToShow = products;

    if (activeFilters.category !== 'all') {
        productsToShow = productsToShow.filter(p => p.category.slug === activeFilters.category);
    }

    productsToShow = productsToShow.filter(p => p.price >= activeFilters.price.min && p.price <= activeFilters.price.max);

    if (activeFilters.colors.length > 0) {
        productsToShow = productsToShow.filter(p => p.colors.some(c => activeFilters.colors.includes(c.name)));
    }

    if (activeFilters.sizes.length > 0) {
        productsToShow = productsToShow.filter(p => p.sizes.some(s => activeFilters.sizes.includes(s)));
    }
    
    return [...productsToShow].sort((a, b) => {
        switch (sortOption) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            default: return 0;
        }
    });
  }, [activeFilters, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const availableColors = ['Black', 'Grey', 'Pink', 'White', 'Blue', 'Green'];
  const availableSizes = ['M', 'L', 'XL', 'XXL', '4XL', 'XS'];

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <div className="text-sm text-text-muted">
        Woman Fashion &gt; Hadetta Coat Beige &gt; <span className="text-primary font-semibold">Brows products</span>
      </div>

      {/* Hero */}
      <section className="bg-accent rounded-lg flex items-center p-8 md:p-12 min-h-[300px]">
        <div className="w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">SAVE UP TO 50% ON YOUR FAVORITE PRODUCTS</h1>
            <button className="mt-8 bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors">
                Buy Now
            </button>
        </div>
        <div className="w-1/2 flex justify-center">
            {/* Image would go here if needed */}
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
            <h2 className="text-xl font-bold mb-6">Filter Options</h2>
            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2 text-sm">
                    {['Men', 'Women', 'T-shirts', 'Hoodies', 'Jackets and Coats', 'Watches', 'Hat'].map(cat => (
                        <div key={cat} className="flex items-center">
                            <input type="radio" id={cat} name="category" className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                            <label htmlFor={cat} className="ml-3 text-text-muted">{cat}</label>
                        </div>
                    ))}
                </div>
            </div>
             {/* Price Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3">Price</h3>
                <p className="text-sm text-text-muted">${activeFilters.price.min} — ${activeFilters.price.max}</p>
                 <input type="range" min="0" max="250" defaultValue="225" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            {/* Color Filter */}
            <div className="mb-6">
                <h3 className="font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                    {availableColors.map(color => (
                        <button key={color} onClick={() => handleColorToggle(color)} className={`h-6 w-6 rounded-full border-2 ${activeFilters.colors.includes(color) ? 'border-primary' : 'border-transparent'}`} style={{backgroundColor: color.toLowerCase()}}></button>
                    ))}
                </div>
            </div>
            {/* Size Filter */}
             <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                        <button key={size} onClick={() => handleSizeToggle(size)} className={`px-3 py-1 border rounded-md text-sm ${activeFilters.sizes.includes(size) ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}>
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </aside>

        {/* Product Grid Area */}
        <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <p className="text-sm text-text-muted">Showing {paginatedProducts.length} of {filteredProducts.length} results</p>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm text-text-muted">Sort by:</label>
                    <select id="sort" value={sortOption} onChange={e => setSortOption(e.target.value)} className="border-border rounded-md shadow-sm text-sm py-2 pl-3 pr-8 focus:ring-primary focus:border-primary">
                        <option value="default">Default Sorting</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>

            {/* Pagination */}
            <nav className="flex justify-center items-center space-x-2 mt-12">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50">&lt;</button>
                {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 text-sm rounded-md ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}>
                        {i + 1}
                    </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50">&gt;</button>
            </nav>
        </main>
      </div>

      {/* Limited Offer Banner */}
      <section className="bg-primary text-white rounded-lg flex items-center justify-between p-8 md:p-12">
        <div>
            <p className="uppercase tracking-widest">Limited Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">35% OFF ONLY THIS FRIDAY<br/>AND GET SPECIAL GIFT</h2>
        </div>
        <button className="bg-white text-primary font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors">
            Shop Now
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 text-center py-8">
        <div>
            <h3 className="font-bold text-lg">Free Shipping</h3>
            <p className="text-sm text-text-muted">Free shipping for order above 180</p>
        </div>
        <div>
            <h3 className="font-bold text-lg">Flexible Payment</h3>
            <p className="text-sm text-text-muted">Multiple secure payment options</p>
        </div>
        <div>
            <h3 className="font-bold text-lg">24 x 7 Support</h3>
            <p className="text-sm text-text-muted">We support online 24 hours a day</p>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;