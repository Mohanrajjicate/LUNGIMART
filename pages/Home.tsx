import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  
  const winterCollection = products.slice(5, 13);
  const featuredCollections = [
    { name: 'JEANS', img: 'https://picsum.photos/seed/jeans/600/750', slug: 'women' },
    { name: 'HOODIE', img: 'https://picsum.photos/seed/hoodie/600/750', slug: 'men' },
    { name: 'BAGS', img: 'https://picsum.photos/seed/bags/600/750', slug: 'accessories' },
    { name: 'T-SHIRTS', img: 'https://picsum.photos/seed/tshirts/600/750', slug: 'men' },
    { name: 'JACKET', img: 'https://picsum.photos/seed/jackets/600/750', slug: 'women' },
    { name: 'SNEAKERS', img: 'https://picsum.photos/seed/sneakers/600/750', slug: 'accessories' },
  ];

  return (
    <div className="space-y-12 md:space-y-24 -mt-6">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 h-[70vh] md:h-[90vh] bg-gray-200">
        <img src="https://picsum.photos/seed/hero-bg/1920/1080" alt="Models wearing modern outfits" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-4xl md:text-7xl font-light tracking-wider leading-tight">IN THE RIGHT OUTFIT<br/>ANYTHING IS POSSIBLE</h1>
            <Link to="/shop" className="mt-8 bg-black/50 text-white font-semibold py-3 px-10 rounded-full hover:bg-black transition-colors duration-300">
                SHOP NOW
            </Link>
        </div>
      </section>
      
      {/* Winter Collections Section */}
      <section>
          <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary">WINTER COLLECTIONS</h2>
              <p className="text-secondary-light mt-2">LET US LOVE WINTER FOR IT IS THE SPRING OF GENIUS</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {winterCollection.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
           <div className="text-center mt-10">
              <Link to="/shop" className="bg-primary text-white font-semibold py-3 px-12 rounded-full hover:bg-secondary transition-colors duration-300">
                  LOAD MORE PRODUCTS
              </Link>
          </div>
      </section>

      {/* Promo Banner 1 */}
      <section className="grid md:grid-cols-2 items-center gap-8">
        <div className="w-full h-full min-h-[300px] md:min-h-[600px] bg-gray-200">
          <img src="https://picsum.photos/seed/promo1/800/1000" alt="Clothing rack" className="w-full h-full object-cover"/>
        </div>
        <div className="text-left px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">FIND YOUR PERFECT LOOK AT LUNGIMART</h2>
          <p className="text-secondary-light mt-4 max-w-md">Discover the latest trends and timeless classics. Quality apparel for every occasion. Shop now and redefine your style.</p>
          <p className="text-6xl md:text-8xl font-extrabold text-secondary my-6">87%</p>
          <Link to="/shop" className="bg-primary text-white font-semibold py-3 px-12 rounded-full hover:bg-secondary transition-colors duration-300">
              FIND THE STORE
          </Link>
        </div>
      </section>

      {/* Promo Banner 2 */}
      <section className="relative h-[50vh] bg-gray-200">
        <img src="https://picsum.photos/seed/promo2/1920/800" alt="Models in winter wear" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-wider">WEAR TO WINTER</h2>
            <Link to="/shop/accessories" className="mt-6 bg-black/50 text-white font-semibold py-3 px-10 rounded-full hover:bg-black transition-colors duration-300 flex items-center space-x-2">
                <span>SHOP NOW</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
        </div>
      </section>

       {/* Featured Collections Section */}
       <section>
           <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary">FEATURED COLLECTIONS</h2>
              <p className="text-secondary-light mt-2">TOP NEW COLLECTIONS WITH LUNGIMART BRANDS EXPLORE NOW</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {featuredCollections.map(cat => (
                  <Link key={cat.name} to={`/shop/${cat.slug}`} className="relative group block overflow-hidden">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <h3 className="text-white text-3xl font-bold tracking-wider">{cat.name}</h3>
                          {cat.name === 'HOODIE' && <p className="text-white text-xs mt-1">OPEN WITH BUY AND APPLY CODE GET OFFERS</p>}
                        </div>
                      </div>
                  </Link>
              ))}
          </div>
      </section>

      {/* Gender Categories Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/shop/men" className="relative group block overflow-hidden h-[60vh]">
            <img src="https://picsum.photos/seed/men-cat/800/1000" alt="Men's collection" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-4xl font-bold tracking-wider">MEN</h3>
                <span className="mt-4 bg-white text-primary font-semibold py-2 px-8 rounded-full">SHOP NOW</span>
            </div>
        </Link>
        <Link to="/shop/women" className="relative group block overflow-hidden h-[60vh]">
            <img src="https://picsum.photos/seed/women-cat/800/1000" alt="Women's collection" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-4xl font-bold tracking-wider">WOMEN</h3>
                <span className="mt-4 bg-white text-primary font-semibold py-2 px-8 rounded-full">SHOP NOW</span>
            </div>
        </Link>
        <Link to="/shop/kids" className="relative group block overflow-hidden h-[60vh]">
            <img src="https://picsum.photos/seed/kids-cat/800/1000" alt="Kids' collection" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-4xl font-bold tracking-wider">KIDS</h3>
                <span className="mt-4 bg-white text-primary font-semibold py-2 px-8 rounded-full">SHOP NOW</span>
            </div>
        </Link>
      </section>

    </div>
  );
};

export default HomePage;
