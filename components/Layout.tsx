
import React, { ReactNode, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import BottomNavBar from './BottomNavBar';
import SearchOverlay from './SearchOverlay';
import ToastContainer from './ToastContainer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-light">
      <NavBar onSearchClick={() => setIsSearchOpen(true)} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-12">
        {children}
      </main>
      <Footer />
      <BottomNavBar onSearchClick={() => setIsSearchOpen(true)} />
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
      <ToastContainer />
    </div>
  );
};

export default Layout;