import React, { useState, useEffect, useMemo } from 'react';
import { getAllProducts } from '../services/mockData';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useAppContext } from '../contexts/AppContext';

const SearchOverlay: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const { reviews } = useAppContext();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);

    const allProducts = useMemo(() => getAllProducts(reviews), [reviews]);

    useEffect(() => {
        if (query.trim().length > 1) {
            const lowerCaseQuery = query.toLowerCase();
            const filteredProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(lowerCaseQuery) || 
                p.category.name.toLowerCase().includes(lowerCaseQuery)
            );
            setResults(filteredProducts);
        } else {
            setResults([]);
        }
    }, [query, allProducts]);
    
    // Prevent body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 sm:pt-24 p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center border-b border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for lungis, dhotis, etc."
                        className="w-full p-5 text-lg placeholder-slate-400 focus:outline-none"
                        autoFocus
                    />
                     <button onClick={onClose} className="p-6 text-slate-500 hover:text-slate-800" aria-label="Close search">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                {query.trim().length > 1 && (
                    <div className="max-h-[60vh] overflow-y-auto p-4">
                        {results.length > 0 ? (
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {results.map(product => (
                                    <div key={product.id} onClick={onClose}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-600">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;