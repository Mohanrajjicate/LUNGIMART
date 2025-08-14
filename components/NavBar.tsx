
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NavItem: React.FC<{ to: string; children: React.ReactNode; className?: string; onClick?: () => void }> = ({ to, children, className = '', onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-secondary'} ${className}`
    }
  >
    {children}
  </NavLink>
);

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, wishlistCount, user } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white'}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              LungiMart.in
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/shop">Shop</NavItem>
            <NavItem to="/political-party" className="animate-pulse">Political Party</NavItem>
            <NavItem to="/about">About Us</NavItem>
            <NavItem to="/bulk-order">Bulk Order</NavItem>
          </div>
          <div className="flex items-center space-x-4">
             <Link to="/profile" className="relative text-secondary hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               {wishlistCount > 0 && <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="relative text-secondary hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{cartCount}</span>}
            </Link>
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-secondary focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <NavItem to="/" onClick={closeMenu}>Home</NavItem>
            <NavItem to="/shop" onClick={closeMenu}>Shop</NavItem>
            <NavItem to="/political-party" onClick={closeMenu} className="animate-pulse">Political Party</NavItem>
            <NavItem to="/about" onClick={closeMenu}>About Us</NavItem>
            <NavItem to="/bulk-order" onClick={closeMenu}>Bulk Order</NavItem>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
