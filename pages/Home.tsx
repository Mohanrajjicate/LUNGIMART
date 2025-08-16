import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

declare var Swiper: any;

const HomePage: React.FC = () => {

  useEffect(() => {
    new Swiper('.hero-swiper', {
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
      effect: 'fade',
    });
  }, []);
  
  const heroSlides = [
    { img: 'https://picsum.photos/seed/hero1/1920/800', title: 'Authentic Weaves', subtitle: 'Experience the rich heritage of Komarapalayam', btnText: 'Shop Lungis' , link: '/shop/lungi' },
    { img: 'https://picsum.photos/seed/hero2/1920/800', title: 'Timeless Tradition', subtitle: 'Pure cotton dhotis for every occasion', btnText: 'Explore Dhotis', link: '/shop/dhoti' },
    { img: 'https://picsum.photos/seed/hero3/1920/800', title: 'Unmatched Comfort', subtitle: 'Soft, absorbent towels crafted with care', btnText: 'View Towels', link: '/shop/towel' },
    { img: 'https://picsum.photos/seed/hero4/1920/800', title: 'Wear Your Pride', subtitle: 'Dhotis and lungis for political supporters', btnText: 'Party Collections', link: '/political-party' },
  ];

  const featuredProducts = products.slice(0, 4);
  const mainCategories = categories.filter(c => ['lungi', 'dhoti', 'political-party', 'towel'].includes(c.slug));

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 h-[60vh] md:h-[80vh] bg-gray-200">
        <div className="swiper hero-swiper h-full">
          <div className="swiper-wrapper">
            {heroSlides.map((slide, index) => (
               <div key={index} className="swiper-slide">
                  <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center md:items-start justify-center text-white text-center md:text-left">
                      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{slide.title}</h1>
                      <p className="mt-4 text-lg md:text-xl max-w-lg">{slide.subtitle}</p>
                      <Link to={slide.link} className="mt-8 bg-accent text-white font-bold py-3 px-10 rounded-full hover:bg-accent-dark transition-colors duration-300">
                          {slide.btnText}
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
      
      {/* Category Highlights Section */}
      <section>
          <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-dark">Shop by Category</h2>
              <p className="text-gray-600 mt-2">Explore our main collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mainCategories.map(cat => (
                  <Link key={cat.id} to={`/shop/${cat.slug}`} className="relative group block overflow-hidden rounded-lg shadow-lg">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-white text-2xl font-bold tracking-wider">{cat.name}</h3>
                      </div>
                  </Link>
              ))}
          </div>
      </section>

      {/* Offer Columns Section */}
      <section className="bg-white rounded-lg shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM1 8h2m2 0h2m0 0h5.561a1 1 0 01.95 1.447l-1.5 2.5a1 1 0 01-.95.553H6.279a1 1 0 01-.949-1.447l1.5-2.5A1 1 0 015 8z" /></svg>
          <h3 className="mt-4 text-lg font-semibold text-dark">Free Shipping</h3>
          <p className="mt-1 text-gray-600 text-sm">On all orders above ₹1000</p>
        </div>
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="mt-4 text-lg font-semibold text-dark">Authentic Quality</h3>
          <p className="mt-1 text-gray-600 text-sm">Directly from Komarapalayam weavers</p>
        </div>
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="mt-4 text-lg font-semibold text-dark">24/7 Support</h3>
          <p className="mt-1 text-gray-600 text-sm">We are here to help you</p>
        </div>
      </section>

       {/* Featured Products Section */}
      <section>
          <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-dark">Featured Products</h2>
              <p className="text-gray-600 mt-2">Our most popular items</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
           <div className="text-center mt-12">
              <Link to="/shop" className="bg-primary text-white font-bold py-3 px-12 rounded-full hover:bg-primary-dark transition-colors duration-300">
                  Shop All Products
              </Link>
          </div>
      </section>
    </div>
  );
};

export default HomePage;