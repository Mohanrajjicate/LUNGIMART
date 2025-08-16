import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <li>
        <Link to={to} className="text-slate-400 hover:text-white transition-colors duration-300">{children}</Link>
    </li>
);

const SocialIcon: React.FC<{ href: string, children: React.ReactNode, label: string }> = ({ href, children, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label={label}>
        {children}
    </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm">
          
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-white">LungiMart.in</h3>
            <p className="mt-3 text-slate-400">Authentic weaves from Komarapalayam, connecting tradition with today's generation.</p>
            <div className="mt-6 flex items-center space-x-5">
                <SocialIcon href="#" label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </SocialIcon>
                <SocialIcon href="#" label="Instagram">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm6.406-2.88a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" /></svg>
                </SocialIcon>
                 <SocialIcon href="#" label="Twitter">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </SocialIcon>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase">Shop</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/shop">All Products</FooterLink>
              <FooterLink to="/shop/lungi">Lungi</FooterLink>
              <FooterLink to="/shop/dhoti">Dhoti</FooterLink>
              <FooterLink to="/shop/towel">Towel</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase">Company</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/bulk-order">Bulk Orders</FooterLink>
              <FooterLink to="/political-party">Political Wear</FooterLink>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-white tracking-wider uppercase">Join Our Newsletter</h4>
            <p className="mt-4 text-slate-400">Get updates on new arrivals and special offers directly to your inbox.</p>
            <form className="flex items-center mt-4 rounded-lg overflow-hidden max-w-sm">
              <input type="email" placeholder="Enter your email" className="bg-slate-800 border-slate-700 border text-white px-4 py-2.5 w-full placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
              <button type="submit" className="bg-primary text-white font-semibold px-5 py-2.5 hover:bg-primary-dark transition-colors text-sm">Sign Up</button>
            </form>
          </div>
          
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-slate-500 order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} LungiMart.in. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 order-1 sm:order-2">
            <Link to="#" className="text-slate-500 hover:text-white">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
