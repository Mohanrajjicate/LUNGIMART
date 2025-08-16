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
          
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-2xl font-bold text-white">LungiMart.in</h3>
            <p className="mt-3 text-slate-400">Authentic weaves from Komarapalayam, connecting tradition with today's generation.</p>
            <div className="mt-6 flex items-center space-x-5">
                <SocialIcon href="#" label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </SocialIcon>
                 <SocialIcon href="#" label="Instagram">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.227 1.664-4.771 4.919-4.919A48.347 48.347 0 0112 2.163zm0 1.441c-3.117 0-3.482.01-4.71.068-2.68.122-3.832 1.27-3.955 3.955-.058 1.227-.068 1.592-.068 4.71s.01 3.482.068 4.71c.122 2.68 1.27 3.832 3.955 3.955 1.227.058 1.592.068 4.71.068s3.482-.01 4.71-.068c2.68-.122 3.832-1.27 3.955-3.955.058-1.227.068-1.592.068-4.71s-.01-3.482-.068-4.71c-.122-2.68-1.27-3.832-3.955-3.955A46.777 46.777 0 0012 3.604zm0 4.388a3.992 3.992 0 100 7.984 3.992 3.992 0 000-7.984zm0 6.552a2.56 2.56 0 110-5.12 2.56 2.56 0 010 5.12zm5.41-7.81a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd" /></svg>
                </SocialIcon>
                 <SocialIcon href="#" label="Twitter">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </SocialIcon>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/shop/lungi">Lungi</FooterLink>
              <FooterLink to="/shop/dhoti">Dhoti</FooterLink>
              <FooterLink to="/shop/matching-dhoti">Matching Sets</FooterLink>
              <FooterLink to="/shop/towel">Towels</FooterLink>
              <FooterLink to="/shop/political-party">Political Wear</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-white tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/bulk-order">Bulk Orders</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-white tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-3">
                <FooterLink to="#">FAQs</FooterLink>
                <FooterLink to="#">Shipping & Returns</FooterLink>
                <FooterLink to="#">Privacy Policy</FooterLink>
                <FooterLink to="/quiet-zone">Quiet Zone</FooterLink>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} LungiMart.in. Weavers of Tradition. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
