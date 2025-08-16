
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-surface rounded-md">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover object-center aspect-[3/4] transition-transform duration-300 group-hover:scale-105" 
        />
        {discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-white text-primary text-xs font-semibold px-2 py-1 rounded-full">
                {discountPercent}% OFF
            </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-xs text-secondary">{product.category.name}</p>
        <h3 className="text-sm font-semibold text-primary mt-1 truncate group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-secondary ml-1">{product.rating}</span>
        </div>
        <p className="mt-1 text-sm font-bold text-primary">
          ${product.price.toFixed(2)}
          {product.originalPrice && (
            <span className="text-xs text-secondary font-normal line-through ml-2">${product.originalPrice.toFixed(2)}</span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;