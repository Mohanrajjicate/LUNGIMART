import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
    useEffect(() => {
    new Swiper('.swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }, []);

  const heroImages = [
    'https://picsum.photos/seed/hero1/1600/600',
    'https://picsum.photos/seed/hero2/1600/600',
    'https://picsum.photos/seed/hero3/1600/600',
  ];
  
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        <div className="swiper-container h-[50vh] md:h-[70vh] bg-gray-200">
          <div className="swiper-wrapper">
            {heroImages.map((src, index) => (
              <div key={index} className="swiper-slide">
                <img src={src} alt={`Hero Banner ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col items-start justify-center text-white p-8 md:p-16 lg:p-24">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg max-w-lg">The Komarapalayam Weave</h1>
                    <p className="mt-4 max-w-md text-lg md:text-xl drop-shadow-md">Experience tradition, comfort, and quality in every thread.</p>
                    <Link to="/shop" className="mt-8 bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary-dark transition-transform hover:scale-105 shadow-lg">
                        Shop Collection
                    </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev text-white"></div>
          <div className="swiper-button-next text-white"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map(category => (
            <Link key={category.id} to={`/shop/${category.slug}`} className="group block text-center p-4 bg-white rounded-lg border border-gray-200/0 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <img src={`https://picsum.photos/seed/${category.slug}/100/100`} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Promo Banners Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/shop/dhoti" className="group block rounded-lg overflow-hidden relative">
            <img src="https://picsum.photos/seed/promo1/800/400" alt="Dhoti Collection" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">Pristine Dhotis</h3>
            </div>
        </Link>
         <Link to="/shop/lungi" className="group block rounded-lg overflow-hidden relative">
            <img src="https://picsum.photos/seed/promo2/800/400" alt="Lungi Collection" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
             <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                <h3 className="text-2xl font-bold text-white">Casual Lungis</h3>
            </div>
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-8">Top Picks For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
         <div className="text-center mt-12">
             <Link to="/shop" className="bg-secondary text-white font-bold py-3 px-12 rounded-md hover:bg-secondary/90 transition-transform hover:scale-105">
                View All Products
            </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;