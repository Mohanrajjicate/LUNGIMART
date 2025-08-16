import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative overflow-hidden pt-[100%] bg-slate-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
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
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;