import React from 'react';
import { Link } from 'react-router-dom';
import { products, categories, getProductsByCategory } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {

  const bestSellingProducts = products.slice(0, 8);
  const mainCategories = categories.filter(c => !['all', 'all-products', 'best-selling', 'new-arrivals', 'featured-products', 'temple-vibe'].includes(c.slug));

  const recentProducts = products.slice(-4).reverse();
  const featuredProductsData = products.filter(p => [1, 3, 7, 9].includes(p.id));
  const lungiProducts = getProductsByCategory('lungi').slice(0, 4);
  const dhotiProducts = getProductsByCategory('dhoti').slice(0, 4);
  const matchingDhotiProducts = getProductsByCategory('matching-dhoti').slice(0, 4);
  const templeVibeProducts = getProductsByCategory('temple-vibe').slice(0, 4);
  const politicalProducts = getProductsByCategory('political-party').slice(0, 4);
  const towelProducts = getProductsByCategory('towel').slice(0, 4);

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

      {/* Best Selling */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Best Selling</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Handpicked for quality and comfort, loved by our customers.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellingProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/best-selling" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Best Sellers
            </Link>
        </div>
      </section>

      {/* Recent Products */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Recent Products</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Check out the latest additions to our collection.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/new-arrivals" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Recent Products
            </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Specially selected products we think you'll love.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProductsData.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/featured-products" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Featured
            </Link>
        </div>
      </section>

      {/* Lungi Collection */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Lungi Collection</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Explore our wide range of comfortable and stylish lungis.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {lungiProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/lungi" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Lungis
            </Link>
        </div>
      </section>

      {/* Dhoti Collection */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Dhoti Collection</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Traditional and elegant dhotis for every occasion.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {dhotiProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/dhoti" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Dhotis
            </Link>
        </div>
      </section>
      
      {/* Matching Sets */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Matching Sets</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Complete your look with our matching dhoti and angavastram sets.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {matchingDhotiProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/matching-dhoti" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Matching Sets
            </Link>
        </div>
      </section>

      {/* Temple Vibe */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Temple Vibe</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Pure and elegant wear for your spiritual occasions.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {templeVibeProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/temple-vibe" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Temple Wear
            </Link>
        </div>
      </section>

      {/* Political Party Wear */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Political Party Wear</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Show your support with our premium quality collection.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {politicalProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/political-party" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Political Wear
            </Link>
        </div>
      </section>

       {/* Towel Collection */}
      <section>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Our Towel Collection</h2>
            <p className="text-slate-600 mt-2 max-w-lg mx-auto">Soft, absorbent, and durable towels for everyday use.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {towelProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
            <Link to="/shop/towel" className="bg-primary/10 text-primary font-bold py-3 px-8 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                View All Towels
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