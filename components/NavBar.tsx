import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { products } from '../services/mockData';
import { Product } from '../types';

const SearchResult: React.FC<{ product: Product, onNavigate: () => void }> = ({ product, onNavigate }) => (
  <li>
    <Link 
      to={`/product/${product.slug}`} 
      onClick={onNavigate}
      className="flex items-center p-3 hover:bg-slate-100 rounded-lg transition-colors"
    >
      <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-md object-cover mr-4" />
      <div>
        <p className="font-semibold text-slate-800">{product.name}</p>
        <p className="text-sm text-slate-600">₹{product.price.toFixed(2)}</p>
      </div>
    </Link>
  </li>
);

const SearchOverlay: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        if (query.trim().length > 1) {
            const lowerCaseQuery = query.toLowerCase();
            const filteredProducts = products.filter(p => 
                p.name.toLowerCase().includes(lowerCaseQuery) || 
                p.category.name.toLowerCase().includes(lowerCaseQuery)
            );
            setResults(filteredProducts);
        } else {
            setResults([]);
        }
    }, [query]);
    
    // Prevent body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 sm:pt-24 p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
                             <ul className="space-y-2">
                                {results.map(product => <SearchResult key={product.id} product={product} onNavigate={onClose} />)}
                            </ul>
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


const NavBar: React.FC = () => {
  const { cartCount, wishlistCount } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
              LungiMart.in
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-500 hover:text-primary" aria-label="Open search">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
             <Link to="/profile" className="p-2 text-slate-500 hover:text-primary relative" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">{wishlistCount}</span>}
            </Link>
             <Link to="/cart" className="p-2 text-slate-500 hover:text-primary relative" aria-label="Shopping Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">{cartCount}</span>}
            </Link>
            <Link to="/profile" className="p-2 text-slate-500 hover:text-primary" aria-label="User Profile">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
    {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default NavBar;