
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/mockData';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useAppContext();

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }
  
  const relatedProducts = getRelatedProducts(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="space-y-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            <img src={product.images[activeImage]} alt={`${product.name} view ${activeImage + 1}`} className="w-full h-full object-cover object-center" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ring-2 transition ${activeImage === index ? 'ring-primary' : 'ring-transparent hover:ring-primary/50'}`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover object-center" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
            <p className="text-sm font-medium text-primary">{product.category.name}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-secondary mt-1">{product.name}</h1>
            
            <div className="flex items-baseline space-x-3 mt-4">
                <p className="text-3xl font-bold text-primary">₹{product.price}</p>
                {hasDiscount && <p className="text-xl text-gray-400 line-through">₹{product.originalPrice}</p>}
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
            
            <div className="mt-8">
                 <h3 className="text-lg font-semibold text-secondary mb-2">Details</h3>
                 <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {product.details.map((detail, i) => <li key={i}>{detail}</li>)}
                 </ul>
            </div>
            
            <div className="mt-auto pt-8">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                        <span className="px-4 py-2 font-semibold">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                    </div>
                    <button 
                        onClick={() => addToCart(product, quantity)}
                        className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      {/* Reviews and Related Products */}
       <div>
         <div className="border-b border-gray-200">
            <h2 className="text-2xl font-bold text-secondary pb-4">Reviews</h2>
         </div>
         <div className="mt-6 space-y-6">
            {product.reviews.length > 0 ? product.reviews.map(review => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-1">
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex items-center ml-4">
                           {Array.from({length: 5}).map((_, i) => (
                             <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-accent' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                           ))}
                        </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                </div>
            )) : <p className="text-gray-500">No reviews yet for this product.</p>}
         </div>
       </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
