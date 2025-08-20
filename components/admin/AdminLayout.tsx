
import React from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import AdminBottomNavBar from './AdminBottomNavBar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 pb-16 md:pb-0">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      <AdminBottomNavBar />
    </div>
  );
};

export default AdminLayout;
