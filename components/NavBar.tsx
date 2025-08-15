
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NavItem: React.FC<{ to: string; children: React.ReactNode; hasDropdown?: boolean }> = ({ to, children, hasDropdown }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-1.5 py-2 text-sm uppercase tracking-wider transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-text-muted hover:text-primary'}`
    }
  >
    {children}
    {hasDropdown && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    )}
  </NavLink>
);

const NavBar: React.FC = () => {
  const { cartCount } = useAppContext();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md">
       <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between border-b border-border">
            {/* Logo */}
            <div className="flex-1 flex justify-start">
                <Link to="/" className="text-3xl font-bold tracking-tighter text-primary">
                  GLOEBUY
                </Link>
            </div>

            {/* Desktop Center Nav */}
            <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
               <NavItem to="/">HOME</NavItem>
               <NavItem to="/shop" hasDropdown={true}>SHOP</NavItem>
               <NavItem to="/about">ABOUT</NavItem>
               <NavItem to="/contact">CONTACT</NavItem>
            </nav>

            {/* Right Icons */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              <button className="p-2 text-text-muted hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link to="/profile" className="p-2 text-text-muted hover:text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link to="/cart" className="flex items-center gap-2 text-sm font-bold text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                MY CART ({cartCount})
              </Link>
            </div>
          </div>
        </div>
    </header>
  );
};

export default NavBar;