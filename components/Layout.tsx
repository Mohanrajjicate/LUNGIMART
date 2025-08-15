
import React, { ReactNode } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import SideCart from './SideCart';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <SideCart />
    </div>
  );
};

export default Layout;