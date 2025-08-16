
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
        <a href={href} className="text-secondary hover:text-primary transition-colors">{children}</a>
    );

  return (
    <footer className="bg-white">
      {/* Features Section */}
      <div className="bg-primary text-white">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
                <h4 className="font-semibold">Money Guarantee</h4>
                <p className="text-sm text-gray-300 mt-1">Within 30 days for an exchange</p>
            </div>
            <div className="flex flex-col items-center">
                <h4 className="font-semibold">Online Support</h4>
                <p className="text-sm text-gray-300 mt-1">24 hours a day, 7 days a week</p>
            </div>
            <div className="flex flex-col items-center">
                <h4 className="font-semibold">Flexible Payment</h4>
                <p className="text-sm text-gray-300 mt-1">Pay with multiple credit cards</p>
            </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Category */}
            <div>
                <h5 className="font-bold text-primary mb-4">Category</h5>
                <ul className="space-y-2 text-sm">
                    <li><Link to="#" className="text-secondary hover:text-primary">Rings</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Necklaces</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Earrings</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Bracelet</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Diamond</Link></li>
                </ul>
            </div>
            {/* Company Service */}
            <div>
                <h5 className="font-bold text-primary mb-4">Company Service</h5>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/about" className="text-secondary hover:text-primary">About Us</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Careers</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Delivery Information</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Privacy Policy</Link></li>
                    <li><Link to="#" className="text-secondary hover:text-primary">Terms & Conditions</Link></li>
                </ul>
            </div>
            {/* Empty column for spacing */}
            <div className="hidden md:block"></div>
            {/* Subscribe */}
            <div className="md:col-span-1">
                 <h5 className="font-bold text-primary mb-4">Subscribe to Our Newsletter</h5>
                 <p className="text-sm text-secondary mb-4">Enter your email below to be the first to know about new collections.</p>
                 <form>
                    <div className="relative">
                        <input type="email" placeholder="Your Email" className="w-full px-4 py-2 text-sm border border-light-border rounded-md focus:ring-accent focus:border-accent" />
                         <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-secondary">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                 </form>
            </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-light-border">
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
             <p className="text-secondary mb-2 sm:mb-0">&copy;{new Date().getFullYear()} SilkStitch All Rights are reserved</p>
             <div className="flex space-x-4">
                <SocialIcon href="#">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                </SocialIcon>
                <SocialIcon href="#">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </SocialIcon>
                <SocialIcon href="#">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.161 4.573a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm0 3.566a3.566 3.566 0 115.767 2.186 3.566 3.566 0 01-5.767-2.186zM12 6.845a5.008 5.008 0 00-5.008 5.008c0 2.762 2.246 5.008 5.008 5.008s5.008-2.246 5.008-5.008c0-2.762-2.246-5.008-5.008-5.008z" clipRule="evenodd"></path></svg>
                </SocialIcon>
             </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;