
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useAppContext();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200">
         <Link to={`/product/${product.slug}`}>
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
         </Link>
      </div>
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
          {discount}% OFF
        </div>
      )}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all"
        aria-label="Add to wishlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link to={`/product/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-gray-500">{product.category.name}</p>
        <div className="flex flex-1 flex-col justify-end">
            <div className="flex items-baseline space-x-2">
                <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                {hasDiscount && <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>}
            </div>
        </div>
      </div>
       <div className="p-4 pt-0">
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-secondary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add to Bag
          </button>
       </div>
    </div>
  );
};

export default ProductCard;
