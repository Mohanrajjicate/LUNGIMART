

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import NotificationBell from './NotificationBell';

const BottomNavBar: React.FC<{onSearchClick: () => void}> = ({onSearchClick}) => {
    const { cartCount } = useAppContext();

    const linkClasses = "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-full h-full pt-2 pb-1";
    const activeLinkClasses = "text-primary";
    const inactiveLinkClasses = "text-slate-500 hover:text-primary";

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

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
            
            <div className={`${linkClasses} ${inactiveLinkClasses}`}>
                <NotificationBell target="user" direction="up" />
                <span>Notifications</span>
            </div>

            <NavLink to="/profile" className={getNavLinkClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                <span>Profile</span>
            </NavLink>
        </nav>
    );
}

export default BottomNavBar;