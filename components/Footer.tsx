
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LungiMart.in. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-sm text-gray-500 hover:text-black">Terms & Conditions</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-black">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;