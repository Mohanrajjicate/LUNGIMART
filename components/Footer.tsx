
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-gray-400 hover:text-white transition-colors text-sm">{children}</Link>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and Social */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-tighter text-white">GLOEBUY</h2>
            <p className="mt-4 text-gray-400 text-sm max-w-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla, est.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* Social Icons would go here */}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Company</h3>
            <div className="flex flex-col space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="#">Blog</FooterLink>
              <FooterLink to="#">Contact Us</FooterLink>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Customer Services</h3>
            <div className="flex flex-col space-y-3">
              <FooterLink to="#">Track Your Order</FooterLink>
              <FooterLink to="#">Return Policy</FooterLink>
            </div>
          </div>
          
           <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Contact Info</h3>
            <div className="flex flex-col space-y-3 text-sm text-gray-400">
               <p>+0123-456-789</p>
               <p>8502 Preston Rd. Inglewood, Maine 98380</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black py-4">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-gray-500">
                Gloebuy &copy; {new Date().getFullYear()}. All Rights Reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;