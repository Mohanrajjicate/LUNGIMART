import React, { ReactNode } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-screen-2xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;