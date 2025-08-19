import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const { products, addToCart, toggleWishlist, isInWishlist, coupons } = useAppContext();
  
  const product = useMemo(() => products.find(p => p.slug === slug), [slug, products]);
  
  const availableCoupons = useMemo(() => {
    if (!product) return [];
    return coupons.filter(coupon => {
        if (!coupon.isActive || coupon.trigger !== 'none') return false;
        if (!coupon.applicableProductIds || coupon.applicableProductIds.length === 0) return true;
        return coupon.applicableProductIds.includes(product.id);
    });
  }, [product, coupons]);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyCoupon = (code: string) => {
      navigator.clipboard.writeText(code).then(() => {
          setCopySuccess(code);
          setTimeout(() => setCopySuccess(''), 2000); // Hide message after 2 seconds
      }, () => {
          alert('Failed to copy coupon code.');
      });
  };

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
  const relatedProducts = products.filter(p => p.id !== product.id && p.category.id === product.category.id).slice(0, 4);

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
              
              {availableCoupons.length > 0 && (
                <div className="border-t border-dashed border-slate-200 pt-4">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5c0 .512.195 1.024.586 1.414l4.414 4.414" /></svg>
                        Available Coupons
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {availableCoupons.map(coupon => (
                            <button
                                key={coupon.id}
                                onClick={() => handleCopyCoupon(coupon.code)}
                                className="bg-green-50 border border-green-200 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors flex items-center gap-2"
                                title={coupon.description}
                            >
                                {coupon.code}
                                {copySuccess === coupon.code ? (
                                    <span className="text-green-600">Copied!</span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
              )}
              
              {product.stock > 0 ? (
                <p className={`font-semibold ${product.stock < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                    {product.stock < 10 ? `Only ${product.stock} left in stock!` : 'In Stock'}
                </p>
              ) : (
                <p className="font-semibold text-red-500">Out of Stock</p>
              )}

              {product.stock > 0 && (
                <>
                <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium text-slate-700">Quantity:</p>
                    <div className="flex items-center border border-slate-300 rounded-lg">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg text-slate-600 hover:bg-slate-100 rounded-l-lg transition">-</button>
                        <span className="px-5 py-2 font-semibold text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(q => Math.min(q + 1, product.stock))} className="px-4 py-2 text-lg text-slate-600 hover:bg-slate-100 rounded-r-lg transition">+</button>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        BUY NOW
                    </button>
                </div>
                </>
              )}
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
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.58C8.75 21.38 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 9.28 20.94 6.8 19.19 4.98C17.44 3.17 14.87 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.38 20.28 11.91C20.28 16.44 16.56 20.15 12.04 20.15C10.56 20.15 9.14 19.78 7.9 19.09L7.22 18.7L3.62 19.82L4.76 16.31L4.44 15.6C3.68 14.34 3.3 12.9 3.3 11.91C3.3 7.38 7.01 3.67 12.04 3.67M9.13 8.03C8.93 8.03 8.73 8.04 8.55 8.07C8.37 8.1 8.08 8.21 7.81 8.47C7.54 8.74 7.15 9.12 7.03 9.3C6.91 9.48 6.8 9.68 6.8 9.91C6.8 10.14 6.89 10.38 7.06 10.6C7.23 10.82 7.55 11.16 7.91 11.53C8.27 11.9 8.94 12.54 9.69 13.2C10.96 14.38 11.83 14.72 12.23 14.88C12.63 15.04 13.23 15 13.5 14.73C13.77 14.46 14.24 13.91 14.41 13.6C14.58 13.29 14.58 13.04 14.48 12.91C14.38 12.78 14.28 12.71 14.04 12.58C13.8 12.45 12.6 11.85 12.38 11.76C12.16 11.67 12.01 11.64 11.86 11.87C11.71 12.1 11.26 12.63 11.11 12.79C10.96 12.95 10.81 12.98 10.6 12.85C10.39 12.72 9.68 12.48 8.81 11.66C8.11 11.01 7.62 10.22 7.49 9.95C7.36 9.68 7.48 9.53 7.6 9.4C7.72 9.27 7.86 9.12 8.01 8.95C8.16 8.78 8.21 8.68 8.31 8.5C8.41 8.32 8.38 8.17 8.31 8.03C8.24 7.89 7.72 6.64 7.5 6.12C7.28 5.6 7.06 5.61 6.89 5.61" /></svg>
                    </SocialShareIcon>
                    <SocialShareIcon href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} label="Share on Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" /></svg>
                    </SocialShareIcon>
                     <SocialShareIcon href={`https://x.com/intent/post?url=${window.location.href}&text=Check%20out%20this%20product:`} label="Share on X">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
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
