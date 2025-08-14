import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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

const BottomNavItem: React.FC<{ to: string; icon: React.ReactElement; label: string; }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center justify-center text-xs gap-1 transition-colors ${isActive ? 'text-primary' : 'text-secondary/80 hover:text-primary'}`}>
      {React.cloneElement(icon, { className: 'h-6 w-6' })}
      <span>{label}</span>
    </Link>
  );
}


const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, wishlistCount } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        {/* Top Announcement Bar */}
        <div className="bg-secondary text-white text-center text-xs py-2 px-4">
          Free Shipping on All Orders Above ₹999!
        </div>
        
        {/* Main Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-primary">
                  LungiMart.in
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/shop">Shop</NavItem>
                <NavItem to="/political-party" className="animate-pulse-slow">Political Party</NavItem>
                <NavItem to="/about">About Us</NavItem>
                <NavItem to="/bulk-order">Bulk Order</NavItem>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-4">
                 <button className="text-secondary hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </button>
                 <Link to="/profile" className="hidden md:block text-secondary hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
                <Link to="/profile" className="hidden md:block relative text-secondary hover:text-primary transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   {wishlistCount > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{wishlistCount}</span>}
                </Link>
                <Link to="/cart" className="hidden md:flex items-center space-x-2 text-secondary hover:text-primary transition-colors">
                   <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{cartCount}</span>}
                   </div>
                   <span className="text-sm font-medium">Cart</span>
                </Link>
                <div className="md:hidden">
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-secondary focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Flyout Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavItem to="/" onClick={closeMobileMenu}>Home</NavItem>
                <NavItem to="/shop" onClick={closeMobileMenu}>Shop</NavItem>
                <NavItem to="/political-party" onClick={closeMobileMenu} className="animate-pulse-slow">Political Party</NavItem>
                <NavItem to="/about" onClick={closeMobileMenu}>About Us</NavItem>
                <NavItem to="/bulk-order" onClick={closeMobileMenu}>Bulk Order</NavItem>
              </div>
            </div>
          )}
        </nav>
      </header>
      
      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-30 grid grid-cols-5">
        <BottomNavItem to="/" label="Home" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
        <BottomNavItem to="/shop" label="Categories" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.01M6 12h.01M6 18h.01M12 6h.01M12 12h.01M12 18h.01M18 6h.01M18 12h.01M18 18h.01" /></svg>} />
        <BottomNavItem to="/profile" label="Profile" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
        <Link to="/profile" className={`flex flex-col items-center justify-center text-xs gap-1 transition-colors relative ${useLocation().pathname === '/profile' ? 'text-primary' : 'text-secondary/80 hover:text-primary'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
           <span>Wishlist</span>
           {wishlistCount > 0 && <span className="absolute top-1 right-5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{wishlistCount}</span>}
        </Link>
        <Link to="/cart" className={`flex flex-col items-center justify-center text-xs gap-1 transition-colors relative ${useLocation().pathname === '/cart' ? 'text-primary' : 'text-secondary/80 hover:text-primary'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span>Cart</span>
          {cartCount > 0 && <span className="absolute top-1 right-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{cartCount}</span>}
        </Link>
      </div>
    </>
  );
};

export default NavBar;