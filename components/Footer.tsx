import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <li>
        <Link to={to} className="text-blue-100 hover:text-white transition-colors text-sm">{children}</Link>
    </li>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold mb-4">LungiMart</h3>
            <p className="text-blue-200 text-sm mb-4">Authentic traditional wear from the looms of Komarapalayam.</p>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Most Popular</h4>
            <ul className="space-y-2">
              <FooterLink to="/shop/lungi">Lungi</FooterLink>
              <FooterLink to="/shop/dhoti">Dhoti</FooterLink>
              <FooterLink to="/shop/wedding">Wedding Collection</FooterLink>
              <FooterLink to="/shop/towel">Towels</FooterLink>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Customer Services</h4>
            <ul className="space-y-2">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="#">Terms & Conditions</FooterLink>
              <FooterLink to="#">FAQ</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-white mb-4">Contact Us</h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm text-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                            <span>+91 123-456-7890</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-blue-100">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            <span>support@lungimart.in</span>
                        </li>
                    </ul>
                </div>
                <div>
                     <h4 className="font-semibold text-white mb-4">Download App</h4>
                     <div className="space-y-3">
                         <a href="#" className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/135px-Download_on_the_App_Store_Badge.svg.png" alt="Download on App Store" className="h-10"/></a>
                         <a href="#" className="inline-block"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/135px-Google_Play_Store_badge_EN.svg.png" alt="Get it on Google Play" className="h-10"/></a>
                     </div>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-blue-500 pt-8 text-center text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} LungiMart.in. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;