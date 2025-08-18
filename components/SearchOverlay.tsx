import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SearchOverlay: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const { products } = useAppContext();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (query.trim().length > 1) {
            const lowerCaseQuery = query.toLowerCase();
            return products.filter(p => 
                p.name.toLowerCase().includes(lowerCaseQuery) || 
                p.category.name.toLowerCase().includes(lowerCaseQuery)
            );
        }
        return [];
    }, [query, products]);

    const quickResults = useMemo(() => results.slice(0, 5), [results]);
    
    // Prevent body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 sm:pt-24 p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-6 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for lungis, dhotis, etc."
                        className="w-full p-5 text-lg placeholder-slate-400 focus:outline-none"
                        autoFocus
                    />
                     <button type="button" onClick={onClose} className="p-6 text-slate-500 hover:text-slate-800" aria-label="Close search">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </form>

                {query.trim().length > 1 ? (
                    <div className="max-h-[60vh] overflow-y-auto">
                        {quickResults.length > 0 ? (
                            <div>
                                <ul className="divide-y divide-slate-100">
                                    {quickResults.map(product => (
                                        <li key={product.id}>
                                            <Link to={`/product/${product.slug}`} onClick={onClose} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                                <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-slate-800">{product.name}</p>
                                                    <p className="text-sm text-slate-500">₹{product.price.toFixed(2)}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                {results.length > quickResults.length && (
                                    <div className="p-4 border-t border-slate-100">
                                        <Link 
                                            to={`/search?q=${encodeURIComponent(query)}`} 
                                            onClick={onClose}
                                            className="w-full block text-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                                        >
                                            View all {results.length} results
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-600">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        <p>Start typing to see product suggestions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;