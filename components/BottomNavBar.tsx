import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const BottomNavBar: React.FC<{onSearchClick: () => void}> = ({onSearchClick}) => {
    const { cartCount, wishlistCount } = useAppContext();
    const location = useLocation();

    const linkClasses = "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-full h-full pt-2 pb-1";
    const activeLinkClasses = "text-primary";
    const inactiveLinkClasses = "text-slate-500 hover:text-primary";

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

    const isProfilePage = location.pathname === '/profile';
    const isWishlistActive = isProfilePage && location.state?.tab === 'wishlist';
    const isProfileActive = isProfilePage && (location.state?.tab === 'orders' || !location.state?.tab);

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] grid grid-cols-5 items-stretch z-40 md:hidden">
            <NavLink to="/" end className={getNavLinkClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>Home</span>
            </NavLink>

            <button onClick={onSearchClick} className={`${linkClasses} ${inactiveLinkClasses}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span>Search</span>
            </button>

            <NavLink to="/cart" className={getNavLinkClass}>
                 <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {cartCount > 0 && <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">{cartCount}</span>}
                 </div>
                <span>Cart</span>
            </NavLink>
            
            <NavLink to="/profile" state={{ tab: 'wishlist' }} className={`${linkClasses} ${isWishlistActive ? activeLinkClasses : inactiveLinkClasses}`}>
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {wishlistCount > 0 && <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">{wishlistCount}</span>}
                </div>
                <span>Wishlist</span>
            </NavLink>

            <NavLink to="/profile" state={{ tab: 'orders' }} className={`${linkClasses} ${isProfileActive ? activeLinkClasses : inactiveLinkClasses}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>Profile</span>
            </NavLink>
        </nav>
    );
}

export default BottomNavBar;
