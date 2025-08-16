import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useAppContext();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white">
      <div className="relative overflow-hidden border border-light-border">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-[4/5]" 
        />
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
          aria-label="Toggle Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="pt-4 text-center">
        <h3 className="text-sm font-semibold text-secondary truncate">
          {product.name}
        </h3>
        <p className="text-xs text-secondary-light mt-1">MRP inclusive of all Taxes</p>
        <div className="mt-2 flex items-baseline justify-center gap-2">
            <p className="text-md font-bold text-secondary">₹{product.price.toFixed(2)}</p>
            {hasDiscount && <p className="text-sm text-secondary-light line-through">₹{product.originalPrice?.toFixed(2)}</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
