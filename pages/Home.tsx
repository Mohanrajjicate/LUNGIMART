import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const heroSwiperRef = useRef(null);
  const brandsSwiperRef = useRef(null);
  
  useEffect(() => {
    heroSwiperRef.current = new Swiper('.hero-swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.hero-swiper-pagination', clickable: true },
      navigation: { nextEl: '.hero-swiper-button-next', prevEl: '.hero-swiper-button-prev' },
    });
    
    brandsSwiperRef.current = new Swiper('.brands-swiper-container', {
      modules: [Pagination],
      slidesPerView: 1.5,
      spaceBetween: 16,
      pagination: { el: '.brands-swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2.5, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1024: { slidesPerView: 4, spaceBetween: 24 },
      }
    });

    return () => {
      if(heroSwiperRef.current) (heroSwiperRef.current as any).destroy();
      if(brandsSwiperRef.current) (brandsSwiperRef.current as any).destroy();
    }
  }, []);
  
  const heroBanners = [
      { 
          title: "Best Deal Online on smart watches", 
          subtitle: "SMART WEARABLE.", 
          offer: "UP to 80% OFF", 
          img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop" 
      },
      { 
          title: "Latest Collection of Traditional Wear", 
          subtitle: "PURE COMFORT.", 
          offer: "Starting at ₹499", 
          img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop"
      }
  ];

  const topCategories = categories.slice(0, 6);
  const lungiProducts = products.filter(p => p.category.slug === 'lungi');
  const dhotiProducts = products.filter(p => p.category.slug === 'dhoti');

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
        <div className="hero-swiper-container h-[50vh] md:h-[60vh] bg-gray-200">
          <div className="swiper-wrapper">
            {heroBanners.map((banner, index) => (
              <div key={index} className="swiper-slide relative">
                <img src={banner.img} alt={`Hero Banner ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>
                <div className="absolute inset-0 container mx-auto px-8 sm:px-12 lg:px-16 flex flex-col items-start justify-center text-white">
                    <p className="font-semibold">{banner.title}</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold my-2 uppercase">{banner.subtitle}</h1>
                    <p className="text-2xl font-semibold opacity-90">{banner.offer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-swiper-pagination swiper-pagination !bottom-4"></div>
          <div className="hero-swiper-button-prev swiper-button-prev text-white !hidden sm:!flex"></div>
          <div className="hero-swiper-button-next swiper-button-next text-white !hidden sm:!flex"></div>
        </div>
      </section>
      
      {/* Product Section 1 */}
      <section>
          <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-secondary">Grab the best deal on <span className="text-primary">Lungis</span></h2>
              <Link to="/shop/lungi" className="text-sm font-semibold text-primary hover:underline">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {lungiProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
      </section>
      
      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-secondary">Shop From <span className="text-primary">Top Categories</span></h2>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {topCategories.map(category => (
            <Link key={category.id} to={`/shop/${category.slug}`} className="group block text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden flex items-center justify-center mb-2 shadow-md group-hover:shadow-lg border-2 border-transparent group-hover:border-primary">
                  <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-sm text-secondary">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Brands Section */}
      <section>
           <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">Top <span className="text-primary">Ethnic Brands</span></h2>
           <div className="brands-swiper-container">
                <div className="swiper-wrapper">
                    <div className="swiper-slide"><img src="https://picsum.photos/seed/brand1/500/250" className="rounded-lg"/></div>
                    <div className="swiper-slide"><img src="https://picsum.photos/seed/brand2/500/250" className="rounded-lg"/></div>
                    <div className="swiper-slide"><img src="https://picsum.photos/seed/brand3/500/250" className="rounded-lg"/></div>
                    <div className="swiper-slide"><img src="https://picsum.photos/seed/brand4/500/250" className="rounded-lg"/></div>
                    <div className="swiper-slide"><img src="https://picsum.photos/seed/brand5/500/250" className="rounded-lg"/></div>
                </div>
                <div className="brands-swiper-pagination swiper-pagination !relative mt-4"></div>
           </div>
      </section>
      
      {/* Product Section 2 */}
      <section>
          <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-secondary">Exquisite <span className="text-primary">Dhotis</span></h2>
              <Link to="/shop/dhoti" className="text-sm font-semibold text-primary hover:underline">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {dhotiProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
      </section>
    </div>
  );
};

export default HomePage;