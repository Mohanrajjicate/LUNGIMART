import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useAppContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }
  
  const inWishlist = isInWishlist(product.id);

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-lg relative">
      <div className="relative overflow-hidden pt-[100%] bg-slate-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <button 
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 ${inWishlist ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4 text-left">
        <h3 className="text-base font-semibold text-slate-800 truncate">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
            <button 
                onClick={handleAddToCart}
                className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                aria-label="Add to cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;