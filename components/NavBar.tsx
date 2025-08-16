import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NavItem: React.FC<{ to: string; children: React.ReactNode; hasDropdown?: boolean }> = ({ to, children, hasDropdown = false }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`
    }
  >
    {children}
    {hasDropdown && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    )}
  </NavLink>
);

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useAppContext();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary tracking-wide">
              LungiMart.in
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
             <NavItem to="/">Home</NavItem>
             <NavItem to="/shop/lungis">Lungis</NavItem>
             <NavItem to="/shop/dhotis">Dhotis</NavItem>
             <NavItem to="/about">About Us</NavItem>
             <NavItem to="/contact">Contact</NavItem>
          </nav>
          
          {/* Right Icons */}
          <div className="flex items-center justify-end space-x-4">
            <button className="p-2 text-secondary hover:text-primary hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <Link to="/profile" className="p-2 text-secondary hover:text-primary hidden sm:block">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </Link>
            <Link to="/cart" className="relative p-2 text-secondary hover:text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-accent text-white text-xs flex items-center justify-center">{cartCount}</span>}
            </Link>
            <Link to="/profile" className="hidden md:block bg-accent text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition-colors">
              Login
            </Link>
            <button
                className="md:hidden ml-2 rounded-md p-2 text-secondary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open menu"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
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
                  <NavLink to="/shop/lungis" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Lungis</NavLink>
                  <NavLink to="/shop/dhotis" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Dhotis</NavLink>
                  <NavLink to="/about" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>About Us</NavLink>
                  <NavLink to="/profile" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Account</NavLink>
                  <NavLink to="/contact" onClick={closeMobileMenu} className={({isActive}) => `font-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>Contact</NavLink>
              </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;