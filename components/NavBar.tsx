
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import NotificationBell from './NotificationBell';

const NavBar: React.FC<{onSearchClick: () => void}> = ({ onSearchClick }) => {
  const { cartCount, wishlistCount } = useAppContext();

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
              LungiMart.in
            </Link>
          </div>
          
          {/* Mobile Notification Icon */}
          <div className="flex items-center md:hidden">
            <NotificationBell target="user" className="p-2 text-slate-500 hover:text-primary" />
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
             <button onClick={onSearchClick} className="p-2 text-slate-500 hover:text-primary" aria-label="Open search">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <NotificationBell target="user" className="p-2 text-slate-500 hover:text-primary" />
             <Link to="/profile" state={{ tab: 'wishlist' }} className="p-2 text-slate-500 hover:text-primary relative" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="p-2 text-slate-500 hover:text-primary relative" aria-label="Shopping cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">{cartCount}</span>}
            </Link>
             <Link to="/profile" className="p-2 text-slate-500 hover:text-primary relative" aria-label="My Account">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default NavBar;