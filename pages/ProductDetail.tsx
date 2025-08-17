
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/mockData';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';

const SocialShareIcon: React.FC<{ href: string; children: React.ReactNode; label: string }> = ({ href, children, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
        {children}
    </a>
);


const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { reviews, addToCart, toggleWishlist, isInWishlist } = useAppContext();
  
  const product = useMemo(() => getProductBySlug(slug || '', reviews), [slug, reviews]);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };
  
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const relatedProducts = getRelatedProducts(product.id, reviews);

  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const handleReviewsLinkClick = () => {
      setActiveTab('reviews');
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="space-y-16">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 justify-center">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden ring-2 transition ${activeImage === index ? 'ring-primary' : 'ring-transparent hover:ring-primary/50'}`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
             <div className="flex-grow aspect-w-1 aspect-h-1 bg-slate-100 rounded-lg overflow-hidden">
              <img src={product.images[activeImage]} alt={`${product.name} view ${activeImage + 1}`} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
              <div>
                <Link to={`/shop/${product.category.slug}`} className="text-sm font-medium text-primary hover:underline uppercase tracking-wider">{product.category.name}</Link>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-1">{product.name}</h1>
                <div className="mt-2">
                    <StarRating rating={product.rating || 0} reviewCount={product.reviewCount} onReviewClick={handleReviewsLinkClick} />
                </div>
              </div>
              
              <div className="flex items-baseline space-x-3">
                  <p className="text-3xl font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
                  {hasDiscount && <p className="text-xl text-slate-400 line-through">₹{product.originalPrice?.toFixed(2)}</p>}
                  {hasDiscount && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md">{discountPercentage}% OFF</span>}
              </div>
              
              <p className="text-base text-slate-600 leading-relaxed">{product.description}</p>
              
              <p className="font-semibold text-green-600">In Stock</p>

              <div className="flex items-center space-x-4">
                  <p className="text-sm font-medium text-slate-700">Quantity:</p>
                  <div className="flex items-center border border-slate-300 rounded-lg">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg text-slate-600 hover:bg-slate-100 rounded-l-lg transition">-</button>
                      <span className="px-5 py-2 font-semibold text-lg">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-lg text-slate-600 hover:bg-slate-100 rounded-r-lg transition">+</button>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                      onClick={() => addToCart(product, quantity)}
                      className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      ADD TO CART
                  </button>
                   <button 
                      onClick={handleBuyNow}
                      className="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      BUY NOW
                  </button>
              </div>
               <button 
                    onClick={handleToggleWishlist}
                    className="w-full border-2 border-slate-200 text-slate-600 font-bold py-3 px-6 rounded-lg hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={inWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
              
              <div className="border-t border-slate-200 pt-4 flex items-center gap-4">
                  <p className="font-semibold text-slate-800">Share:</p>
                  <div className="flex gap-2">
                    <SocialShareIcon href={`https://wa.me/?text=Check%20out%20this%20product:%20${window.location.href}`} label="Share on WhatsApp">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.512 1.924 6.362l-1.212 4.422 4.572-1.195z" /></svg>
                    </SocialShareIcon>
                    <SocialShareIcon href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} label="Share on Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" /></svg>
                    </SocialShareIcon>
                     <SocialShareIcon href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check%20out%20this%20product:`} label="Share on Twitter">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.432.23-2.164.083.608 1.923 2.368 3.268 4.448 3.306-1.785 1.4-4.037 2.223-6.392 2.223-.414 0-.82-.024-1.22-.074 2.298 1.474 5.031 2.34 8.016 2.34 9.621 0 14.885-7.98 14.885-14.886v-.672c1.016-.732 1.885-1.649 2.582-2.678z" /></svg>
                    </SocialShareIcon>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* Description, Details, Reviews Tabs */}
       <div ref={reviewsRef} className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
         <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Details</button>
                <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Reviews ({product.reviews.length})</button>
            </nav>
         </div>
         <div className="mt-6 text-slate-600 leading-relaxed">
            {activeTab === 'details' && <ul className="list-disc list-inside space-y-2">{product.details.map((detail, i) => <li key={i}>{detail}</li>)}</ul>}
            {activeTab === 'reviews' && (
                <div className="space-y-6">
                    {product.reviews.length > 0 ? product.reviews.map(review => (
                        <div key={review.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                            <div className="flex flex-wrap items-center mb-2 gap-x-4 gap-y-1">
                                <p className="font-semibold text-slate-800">{review.author}</p>
                                <div className="flex-shrink-0">
                                   <StarRating rating={review.rating} />
                                </div>
                                <time className="text-xs text-slate-500" dateTime={review.date}>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                            </div>
                            {review.verifiedBuyer && <p className="text-xs font-semibold text-green-600 mb-2">✓ Verified Buyer</p>}
                            <p>{review.comment}</p>
                        </div>
                    )) : <p>No reviews yet for this product.</p>}
                 </div>
            )}
         </div>
       </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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