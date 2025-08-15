
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NavItem: React.FC<{ to: string; children: React.ReactNode; }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm uppercase tracking-wider transition-colors duration-200 ${isActive ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`
    }
  >
    {children}
  </NavLink>
);

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, cartCount } = useAppContext();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md">
      <div className="border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button & Search */}
            <div className="flex items-center md:hidden">
              <button
                className="mr-2 rounded-md p-2 text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
            
            {/* Desktop Left Nav */}
            <nav className="hidden md:flex items-center space-x-8">
               <NavItem to="/shop">Products</NavItem>
               <NavItem to="/about">About</NavItem>
               <NavItem to="/bulk-order">Contact</NavItem>
            </nav>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <Link to="/" className="text-2xl font-extrabold tracking-tighter text-black uppercase">
                  LungiMart
                </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center justify-end space-x-4">
              <button className="p-2 text-gray-600 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link to="/profile" className="p-2 text-gray-600 hover:text-black hidden sm:block">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <button onClick={openCart} className="relative p-2 text-gray-600 hover:text-black">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-black"></span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Flyout Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closeMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 p-6">
              <h2 className="text-xl font-bold text-black mb-6 uppercase">Menu</h2>
              <nav className="flex flex-col space-y-4">
                  <NavLink to="/" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>Home</NavLink>
                  <NavLink to="/shop" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>Products</NavLink>
                  <NavLink to="/profile" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>Account</NavLink>
                  <NavLink to="/about" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>About</NavLink>
                  <NavLink to="/bulk-order" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>Contact</NavLink>
              </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;