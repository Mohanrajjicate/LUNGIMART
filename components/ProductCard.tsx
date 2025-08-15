import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const saveAmount = hasDiscount ? (product.originalPrice! - product.price).toFixed(2) : '0';

  return (
    <Link to={`/product/${product.slug}`} className="group block overflow-hidden bg-white rounded-lg border border-light-border/80 hover:shadow-lg transition-shadow duration-300">
      <div className="relative p-2">
        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
        </div>
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-secondary truncate">
          {product.name}
        </h3>
        <div className="mt-2">
            <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-secondary">₹{product.price}</p>
                {hasDiscount && <p className="text-sm text-secondary-light line-through">₹{product.originalPrice}</p>}
            </div>
            {hasDiscount && <p className="mt-1 text-sm text-green-600 font-medium">Save ₹{saveAmount}</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;