
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
    useEffect(() => {
    const swiper = new Swiper('.swiper-container', {
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
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">The Komarapalayam Weave</h1>
                    <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">Experience tradition, comfort, and quality in every thread.</p>
                    <Link to="/shop" className="mt-8 bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-transform hover:scale-105">
                        Shop Now
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
            <Link key={category.id} to={`/shop/${category.slug}`} className="group block text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full overflow-hidden flex items-center justify-center mb-4">
                  <img src={`https://picsum.photos/seed/${category.slug}/100/100`} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Offers Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-8 rounded-lg flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-bold text-secondary">Bulk Orders</h3>
            <p className="mt-2 text-gray-600">Special pricing for weddings, events, and corporate gifting.</p>
            <Link to="/bulk-order" className="mt-4 bg-secondary text-white font-semibold py-2 px-6 rounded-lg hover:bg-secondary/90 transition-colors">
                Inquire Now
            </Link>
        </div>
         <div className="bg-gradient-to-r from-cyan-100 to-sky-100 p-8 rounded-lg flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-bold text-primary">Political Attire</h3>
            <p className="mt-2 text-gray-600">Wear your support with our special collection of party dhotis.</p>
            <Link to="/political-party" className="mt-4 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                Explore Collection
            </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-8">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
         <div className="text-center mt-12">
             <Link to="/shop" className="bg-secondary text-white font-bold py-3 px-12 rounded-full hover:bg-secondary/90 transition-transform hover:scale-105">
                View All Products
            </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
