import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { to: 'orders', label: 'Orders', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
  { to: 'products', label: 'Products', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { to: 'customers', label: 'Customers', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { to: 'notifications', label: 'Notify', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V4a3 3 0 012-2.828l.5-.278a2 2 0 012.458 1.458l.123.492a2 2 0 01-.393 1.958l-3.263 3.263a2 2 0 01-1.414.586H12a2 2 0 00-2 2v1.118a2 2 0 01-1.414.586L6.22 16.22a2 2 0 01-1.958.393l-.492-.123a2 2 0 01-1.458-2.458l.278-.5a3 3 0 012.828-2H4a1 1 0 011-1h1a1 1 0 100-2H5a1 1 0 01-1-1V6a1 1 0 011-1h1a1 1 0 100-2H5a3 3 0 00-3 3v1.118a2 2 0 00.586 1.414l3.263 3.263a2 2 0 001.414.586H9a2 2 0 012 2v4a2 2 0 002 2h1a2 2 0 002-2v-.882a2 2 0 00-.586-1.414l-3.263-3.263a2 2 0 00-1.414-.586H13a2 2 0 01-2-2V5.882z" /></svg> },
];

const AdminBottomNavBar: React.FC = () => {
    const linkClasses = "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-full h-full pt-2 pb-1";
    const activeLinkClasses = "text-primary";
    const inactiveLinkClasses = "text-slate-500 hover:text-primary";

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] grid grid-cols-5 items-stretch z-40 md:hidden">
            {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} end={link.to === 'dashboard'} className={getNavLinkClass}>
                    {link.icon}
                    <span>{link.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default AdminBottomNavBar;