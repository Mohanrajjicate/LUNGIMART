import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useAppContext();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl">
      <div className="relative overflow-hidden pt-[125%]"> {/* 4:5 aspect ratio */}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
          aria-label="Toggle Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isInWishlist(product.id) ? 'text-accent' : 'text-dark'}`} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
           <button 
                onClick={handleAddToCart}
                className="w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent-dark transition-colors duration-300 text-sm"
            >
                Add to Cart
            </button>
        </div>
      </div>

      <div className="p-4 text-left">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category.name}</p>
        <h3 className="mt-1 text-base font-semibold text-dark truncate h-6">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
            <p className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p>
            {hasDiscount && <p className="text-sm text-gray-500 line-through">₹{product.originalPrice?.toFixed(2)}</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;