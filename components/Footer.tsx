import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <li>
        <Link to={to} className="text-gray-400 hover:text-white transition-colors text-sm">{children}</Link>
    </li>
);

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
        {children}
    </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="md:col-span-2 lg:col-span-5">
            <h3 className="text-2xl font-bold mb-4">LUNGI MART</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get newsletter updates for upcoming products and best offers and discount for all items.
            </p>
            <form className="flex items-center border border-gray-600 rounded-md overflow-hidden max-w-sm">
              <input type="email" placeholder="Your Email" className="bg-transparent px-4 py-2 w-full text-white placeholder-gray-500 focus:outline-none" />
              <button type="submit" className="bg-white text-primary font-semibold px-6 py-2">SUBMIT</button>
            </form>
          </div>
          
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="font-semibold text-white mb-4 tracking-wider">PRODUCT</h4>
            <ul className="space-y-3">
              <FooterLink to="/shop/men">T-Shirt</FooterLink>
              <FooterLink to="/shop/men">Jacket</FooterLink>
              <FooterLink to="/shop/women">Jeans</FooterLink>
              <FooterLink to="/shop/accessories">Hand Bags</FooterLink>
              <FooterLink to="/shop/accessories">Sneakers</FooterLink>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4 tracking-wider">CATEGORIES</h4>
            <ul className="space-y-3">
              <FooterLink to="/shop/men">Men</FooterLink>
              <FooterLink to="/shop/women">Women</FooterLink>
              <FooterLink to="/shop/kids">Kids</FooterLink>
              <FooterLink to="/shop/gifts">Gift</FooterLink>
              <FooterLink to="/shop">Collection</FooterLink>
              <FooterLink to="/shop">New Arrivals</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4 tracking-wider">HELP</h4>
            <ul className="space-y-3">
              <FooterLink to="/profile">Customer Service</FooterLink>
              <FooterLink to="/profile">My LungiMart</FooterLink>
              <FooterLink to="#">Find a Store</FooterLink>
              <FooterLink to="#">Legal & Privacy</FooterLink>
              <FooterLink to="/about">Contact</FooterLink>
              <FooterLink to="#">Cookie Notice</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} LungiMart.in. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></SocialIcon>
            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></SocialIcon>
            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></SocialIcon>
            <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg></SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
