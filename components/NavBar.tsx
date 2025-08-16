import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative text-sm font-medium transition-colors after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-primary after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isActive ? 'after:scale-x-100' : ''}`
    }
  >
    {children}
  </NavLink>
);

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useAppContext();
  const mainNavLinks = [
    { name: "Men's", to: '/shop/men' },
    { name: "Women's", to: '/shop/women' },
    { name: "Kid's", to: '/shop/kids' },
    { name: 'Accessories', to: '/shop/accessories' },
    { name: 'Gifts', to: '/shop/gifts' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-xs h-8 flex items-center justify-center text-center">
          <p>IT'S NOT TOO LATE TO GIVE A MEANINGFUL CHRISTMAS GIFT 🎄 (FIND OUT HERE)</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
        <div className="flex h-20 items-center justify-between">
          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mainNavLinks.map(link => (
              <NavItem key={link.name} to={link.to}>{link.name}</NavItem>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-secondary"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-3xl font-extrabold tracking-wider text-primary">
              LUNGI MART
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden lg:flex items-center space-x-2 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>Search</span>
            </button>
            <Link to="/cart" className="flex items-center space-x-2 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span>Cart({cartCount})</span>
            </Link>
             <Link to="/profile" className="hidden lg:flex items-center space-x-2 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>User Login</span>
            </Link>
             <button className="hidden lg:flex items-center space-x-1 text-sm font-medium">
              <span>ENG</span>
              <span>/</span>
              <span className="text-secondary-light">FRN</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Flyout Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-primary">MENU</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                  {mainNavLinks.map(link => (
                      <NavItem key={link.name} to={link.to} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</NavItem>
                  ))}
              </nav>
              <div className="mt-auto border-t pt-6 space-y-4">
                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>User Login</span>
                  </Link>
                   <button className="flex items-center space-x-2 text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span>Search</span>
                  </button>
              </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
