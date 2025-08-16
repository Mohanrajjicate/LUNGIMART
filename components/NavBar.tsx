import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { categories } from '../services/mockData';

const CategoryNavItem: React.FC<{ to: string; children: React.ReactNode; }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-secondary'}`
    }
  >
    {children}
  </NavLink>
);


const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useAppContext();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-light-bg border-b border-light-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-xs text-secondary-light">
              <div className="flex justify-between items-center h-8">
                  <p>Welcome to worldwide LungiMart!</p>
                  <div className="hidden sm:flex items-center space-x-6">
                      <Link to="#" className="flex items-center gap-1 hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>Deliver to 423651</Link>
                      <Link to="#" className="flex items-center gap-1 hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v5.05a2.5 2.5 0 014.9 0V8a1 1 0 00-1-1h-3.9z" /></svg>Track your order</Link>
                  </div>
              </div>
          </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-2 rounded-md p-2 text-secondary-light md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link to="/" className="text-2xl font-bold text-primary">
              LungiMart
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 mx-8 max-w-xl">
            <div className="relative w-full">
              <input type="search" placeholder="Search essentials, groceries, and more..." className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:ring-primary" />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <Link to="/profile" className="hidden md:flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                Sign Up/Sign In
            </Link>
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            <Link to="/cart" className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.828l2.558-9.086a.75.75 0 00-.732-.93H4.5M7.5 14.25L5.106 5.165A.75.75 0 004.332 4.5H3.375" /></svg>
                {cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{cartCount}</span>}
              </div>
              <span className='hidden lg:block'>Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="hidden md:block border-t border-light-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-2 h-12 overflow-x-auto">
                  {categories.map(cat => <CategoryNavItem key={cat.id} to={`/shop/${cat.slug}`}>{cat.name}</CategoryNavItem>)}
              </div>
          </div>
      </div>

      {/* Mobile Flyout Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closeMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 p-6">
              <h2 className="text-xl font-bold text-primary mb-6">Menu</h2>
              <nav className="flex flex-col space-y-4">
                  <NavLink to="/" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Home</NavLink>
                  <NavLink to="/shop" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Shop</NavLink>
                  <NavLink to="/profile" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Profile</NavLink>
                  <NavLink to="/cart" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Cart</NavLink>
                  <NavLink to="/about" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>About Us</NavLink>
              </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;