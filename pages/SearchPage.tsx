import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../contexts/AppContext';

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { products } = useAppContext();
    
    const query = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(query);

    const filteredProducts = useMemo(() => {
        if (!query.trim()) {
            return [];
        }
        const lowerCaseQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerCaseQuery) ||
            p.category.name.toLowerCase().includes(lowerCaseQuery) ||
            p.description.toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, products]);
    
    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`, { replace: true });
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="w-full text-lg p-4 pl-12 rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                        />
                         <button type="submit" aria-label="Submit search" className="absolute top-1/2 right-2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <main>
                <div className="mb-6">
                    {query ? (
                        <>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Search results for "<span className="text-primary">{query}</span>"
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">{filteredProducts.length} Product{filteredProducts.length !== 1 && 's'} Found</p>
                        </>
                    ) : (
                         <h1 className="text-3xl font-bold text-slate-900">
                            Search Products
                        </h1>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    query && (
                        <div className="text-center py-24 bg-white rounded-xl shadow-sm">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h2 className="mt-4 text-2xl font-bold text-slate-900">No Results Found</h2>
                            <p className="text-slate-500 mt-2">We couldn't find any products matching "{query}".</p>
                            <Link to="/shop" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                                Browse All Products
                            </Link>
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default SearchPage;