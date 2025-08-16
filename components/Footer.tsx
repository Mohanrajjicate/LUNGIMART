import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <li>
        <Link to={to} className="text-slate-500 hover:text-primary transition-colors text-sm">{children}</Link>
    </li>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="md:col-span-2 lg:col-span-5">
            <h3 className="text-2xl font-bold text-slate-900">StyleCrafted</h3>
            <div className="mt-8 space-y-2 text-sm">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="#">Support</FooterLink>
                <FooterLink to="#">Contact Us</FooterLink>
                <FooterLink to="#">FAQ</FooterLink>
                <FooterLink to="/quiet-zone">Help</FooterLink>
            </div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <h4 className="font-semibold text-slate-900 mb-4 tracking-wider">Subscribe</h4>
            <p className="text-slate-500 text-sm mb-4">
              By subscribing you agree to our Privacy Policy
            </p>
            <form className="flex items-center border border-slate-300 rounded-lg overflow-hidden max-w-sm mt-6">
              <input type="email" placeholder="Enter your email" className="bg-transparent px-4 py-2.5 w-full text-slate-700 placeholder-slate-400 focus:outline-none text-sm" />
              <button type="submit" className="bg-primary text-white font-semibold px-6 py-2.5 hover:bg-primary-dark transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 text-sm">
            <Link to="#" className="text-slate-500 hover:text-primary">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 hover:text-primary">Terms of Service</Link>
            <Link to="#" className="text-slate-500 hover:text-primary">Cookies Settings</Link>
          </div>
          <p className="text-sm text-slate-400 text-center mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} Clothshop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;