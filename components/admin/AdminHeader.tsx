import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../NotificationBell';

const AdminHeader: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pageTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin/login');
    };
    
    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-slate-200">
            <h1 className="text-2xl font-semibold text-slate-800 capitalize">{pageTitle}</h1>
            
            <div className="flex items-center gap-4">
                 <NotificationBell target="admin" />
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <button onClick={handleLogout} title="Logout" className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;