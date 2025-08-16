import React from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {

  const featuredProducts = products.slice(0, 8);
  const exclusiveProducts = products.slice(8, 11);
  const mainCategories = [
    { name: 'T-Shirts', image: 'https://picsum.photos/seed/cat-tshirt/200' },
    { name: 'Hoodies', image: 'https://picsum.photos/seed/cat-hoodie/200' },
    { name: 'Jeans', image: 'https://picsum.photos/seed/cat-jeans/200' },
    { name: 'Polo T Shirt', image: 'https://picsum.photos/seed/cat-polo/200' },
    { name: 'Shirts', image: 'https://picsum.photos/seed/cat-shirt/200' },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative -mt-8 md:-mt-12 -mx-4 sm:-mx-6 lg:-mx-8 p-6 bg-white rounded-b-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">Discover the <br/> Art of <span className="text-primary">Branding</span></h1>
                <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto md:mx-0">Discover premium designs crafted to express your individuality.</p>
                <div className="mt-8 flex justify-center md:justify-start space-x-4">
                    <Link to="/shop" className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                        Shop now
                    </Link>
                    <Link to="#" className="bg-white text-primary font-semibold py-3 px-6 rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors">
                        Customize Your Style
                    </Link>
                </div>
            </div>
            <div className="relative h-64 md:h-auto md:aspect-[4/3] rounded-2xl overflow-hidden">
                <img src="https://picsum.photos/seed/hero-main/800/600" alt="Clothing rack" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10"></div>
            </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Categories</h2>
        <div className="flex justify-center items-center gap-4 md:gap-8 overflow-x-auto pb-4">
          {mainCategories.map((cat, index) => (
            <Link key={index} to="/shop" className="text-center group flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <p className="mt-4 font-semibold text-slate-700 group-hover:text-primary transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* The Best items of Our Collection */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900">The Best items of<br/>Our Collection</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Discover styles for every occasion and make them your own</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                See next products
            </Link>
        </div>
      </section>
      
      {/* Why Our Products Section */}
      <section className="bg-white p-8 rounded-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Why Our Products Are Worth Your Investment?</h2>
          <p className="text-slate-600 mt-2">Focuses on the value proposition, encouraging customers to consider the quality and long-term benefits.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-light text-center p-6 rounded-xl">
            <h3 className="font-bold text-lg text-slate-800">Top-Quality Craftsmanship</h3>
            <p className="text-sm text-slate-600 mt-2">Our products are built to last, crafted with attention to detail and the finest materials.</p>
          </div>
          <div className="bg-primary text-white text-center p-6 rounded-xl shadow-lg shadow-primary/30">
            <h3 className="font-bold text-lg">Easy Returns and Exchanges</h3>
            <p className="text-sm text-blue-100 mt-2">Our products are built to last, crafted with attention to detail and the finest materials.</p>
          </div>
          <div className="bg-light text-center p-6 rounded-xl">
            <h3 className="font-bold text-lg text-slate-800">Affordability Meets Quality</h3>
            <p className="text-sm text-slate-600 mt-2">We provide the best value for your money.</p>
          </div>
        </div>
      </section>
      
      {/* Exclusive Collection */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Our Exclusive Collection</h2>
            <p className="text-slate-600 mt-2">Handpicked Styles, Unmatched Quality</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {exclusiveProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Hear from Our Happy Customers</h2>
          <p className="text-slate-600 mt-2">Real experiences, genuine feedback – see what makes us a top choice!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl">
            <p className="text-slate-600">"I recently purchased this product, and I couldn't be happier with my decision! As an interior designer, I need tools and accessories that not only work well but also have a refined aesthetic."</p>
            <div className="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/150?u=john" alt="John Doe" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-bold text-slate-800">John Doe</p>
                <p className="text-sm text-slate-500">UI/UX Designer</p>
              </div>
            </div>
          </div>
           <div className="bg-white p-6 rounded-xl">
            <p className="text-slate-600">"As a freelance videographer, I'm always on the lookout for reliable and high-quality equipment. This product has completely transformed the way I work!"</p>
            <div className="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/150?u=emily" alt="Emily Rodriguez" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-bold text-slate-800">Emily Rodriguez</p>
                <p className="text-sm text-slate-500">Software Engineer</p>
              </div>
            </div>
          </div>
           <div className="bg-white p-6 rounded-xl">
            <p className="text-slate-600">"This product has completely transformed the way I work! As someone who's constantly expert in this. Exceeded my expectations in both quality and style."</p>
            <div className="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/150?u=johan" alt="Johan Mash" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-bold text-slate-800">Johan Mash</p>
                <p className="text-sm text-slate-500">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
       {/* 20% Off Banner */}
       <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 p-16 rounded-2xl bg-slate-800 bg-cover bg-center text-center" style={{backgroundImage: `url('https://picsum.photos/seed/promo/1200/400')`}}>
          <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
          <div className="relative text-white">
            <h2 className="text-4xl font-bold">"Get 20% Off Your First Purchase"</h2>
            <p className="mt-2 text-lg">Coupon: FASHION20</p>
            <div className="mt-6">
                <Link to="/shop" className="bg-white text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors">
                    Explore Collection
                </Link>
            </div>
          </div>
       </section>
    </div>
  );
};

export default HomePage;