import React from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {

  const featuredProducts = products.slice(0, 8);
  const exclusiveProducts = products.filter(p => ['matching-dhoti', 'political-party'].includes(p.category.slug)).slice(0, 3);
  const mainCategories = categories.filter(c => !['all', 'all-products'].includes(c.slug));

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative -mt-8 md:-mt-12 -mx-4 sm:-mx-6 lg:-mx-8 p-6 bg-white rounded-b-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">Authentic Weaves from <span className="text-primary">Komarapalayam</span></h1>
                <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto md:mx-0">Experience the comfort and tradition of handcrafted lungis, dhotis, and more, direct from the loom.</p>
                <div className="mt-8 flex justify-center md:justify-start space-x-4">
                    <Link to="/shop" className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                        Shop Now
                    </Link>
                    <Link to="/bulk-order" className="bg-white text-primary font-semibold py-3 px-6 rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors">
                        Bulk Orders
                    </Link>
                </div>
            </div>
            <div className="relative h-64 md:h-auto md:aspect-[4/3] rounded-2xl overflow-hidden">
                <img src="https://picsum.photos/seed/hero-main/800/600" alt="Weaving loom" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10"></div>
            </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Our Collections</h2>
        <div className="flex justify-center items-center gap-4 md:gap-8 overflow-x-auto pb-4">
          {mainCategories.map((cat) => (
            <Link key={cat.id} to={`/shop/${cat.slug}`} className="text-center group flex-shrink-0">
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
            <h2 className="text-4xl font-bold text-slate-900">Our Bestsellers</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Handpicked for quality and comfort, loved by our customers.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Products
            </Link>
        </div>
      </section>
      
      {/* Why Our Products Section */}
      <section className="bg-white p-8 rounded-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">The LungiMart.in Promise</h2>
          <p className="text-slate-600 mt-2">We connect you directly with the weavers of Komarapalayam.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-light text-center p-6 rounded-xl">
            <h3 className="font-bold text-lg text-slate-800">Authentic Komarapalayam Cotton</h3>
            <p className="text-sm text-slate-600 mt-2">Experience the softness and durability of pure, locally-sourced cotton.</p>
          </div>
          <div className="bg-primary text-white text-center p-6 rounded-xl shadow-lg shadow-primary/30">
            <h3 className="font-bold text-lg">Direct from the Loom</h3>
            <p className="text-sm text-blue-100 mt-2">By bypassing middlemen, we ensure weavers get fair prices for their craft.</p>
          </div>
          <div className="bg-light text-center p-6 rounded-xl">
            <h3 className="font-bold text-lg text-slate-800">Fair Prices, Lasting Quality</h3>
            <p className="text-sm text-slate-600 mt-2">Get premium traditional wear that lasts, at prices that are fair for you and the artisan.</p>
          </div>
        </div>
      </section>
      
      {/* Exclusive Collection */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Specialty Weaves</h2>
            <p className="text-slate-600 mt-2">Discover our collection of matching dhotis, wedding sets, and political party wear.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {exclusiveProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Hear from Our Happy Customers</h2>
          <p className="text-slate-600 mt-2">Real experiences from our valued patrons across Tamil Nadu.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl">
            <p className="text-slate-600">"The quality of the checkered lungi is fantastic. It's so soft and comfortable for daily wear. Truly authentic Komarapalayam quality."</p>
            <div className="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/150?u=ramesh" alt="Ramesh Kumar" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-bold text-slate-800">Ramesh Kumar</p>
                <p className="text-sm text-slate-500">Chennai Resident</p>
              </div>
            </div>
          </div>
           <div className="bg-white p-6 rounded-xl">
            <p className="text-slate-600">"I ordered the Pure White Temple Dhoti for a ceremony. The material is divine and feels very premium. Delivery was prompt too. Highly recommended."</p>
            <div className="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/150?u=priya" alt="Priya Selvam" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-bold text-slate-800">Priya Selvam</p>
                <p className="text-sm text-slate-500">Temple Priest</p>
              </div>
            </div>
          </div>
           <div className="bg-white p-6 rounded-xl">
            <p className="text-slate-600">"I purchase dhotis in bulk for my shop from LungiMart. The process is smooth and the quality is always consistent. My customers are very happy."</p>
            <div className="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/150?u=anand" alt="Anand Rao" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-bold text-slate-800">Anand Rao</p>
                <p className="text-sm text-slate-500">Retail Business Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
       {/* 20% Off Banner */}
       <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 p-16 rounded-2xl bg-slate-800 bg-cover bg-center text-center" style={{backgroundImage: `url('https://picsum.photos/seed/promo/1200/400')`}}>
          <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
          <div className="relative text-white">
            <h2 className="text-4xl font-bold">Celebrate Tradition</h2>
            <p className="mt-2 text-lg">Special prices on bulk orders for festivals and events.</p>
            <div className="mt-6">
                <Link to="/bulk-order" className="bg-white text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors">
                    Inquire Now
                </Link>
            </div>
          </div>
       </section>
    </div>
  );
};

export default HomePage;