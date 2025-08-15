
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-800">
          {product.name}
        </h3>
        <p className="mt-1 text-md font-semibold text-gray-900">₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;