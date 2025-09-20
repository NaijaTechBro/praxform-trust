import React, { useState } from 'react';
import logo from '../../assets/logo.png'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const customColor = {
    DEFAULT: '#1475F4',
    hover: '#1268DA',
    lightHover: '#E8F1FE'
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <img src={logo} style={{ width: "100px" }} alt="PraxForm Logo"/>
            </a>
          </div>


          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/signin" className="text-[#1475F4] font-semibold px-4 py-2 rounded-full border-2 border-[#1475F4] hover:bg-[#E8F1FE] transition-colors">
              Sign In
            </a>
            <a href="/signup" className="bg-[#1475F4] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1268DA] transition-colors">
              Create Account
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1475F4]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu open/close */}
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state. */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="text-gray-700 hover:bg-gray-50 hover:text-[#1475F4] block px-3 py-2 rounded-md text-base font-medium">Features</a>
            <a href="#pricing" className="text-gray-700 hover:bg-gray-50 hover:text-[#1475F4] block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
            <a href="#support" className="text-gray-700 hover:bg-gray-50 hover:text-[#1475F4] block px-3 py-2 rounded-md text-base font-medium">Support</a>
            <a href="#contact" className="text-gray-700 hover:bg-gray-50 hover:text-[#1475F4] block px-3 py-2 rounded-md text-base font-medium">Contact Us</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-2">
               <a href="/signin" className="block text-center w-full text-[#1475F4] font-semibold px-4 py-2 rounded-full border-2 border-[#1475F4] hover:bg-[#E8F1FE] transition-colors">
                Sign In
              </a>
              <a href="/signup" className="block text-center w-full bg-[#1475F4] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1268DA] transition-colors">
                Create Account
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;