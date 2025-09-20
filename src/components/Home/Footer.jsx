import React from 'react';
import white from '../../assets/white.png';
// Reusable component for footer links
const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-300 hover:text-white transition-colors duration-200">
      {children}
    </a>
  </li>
);

const SocialIcon = ({ href, children }) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors duration-200">
        {children}
    </a>
);

const Footer = () => {
  return (
    <footer id='support' className="bg-[#083166] text-white overflow-hidden">
      {/* Top CTA Section */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-[#4391F6] rounded-3xl md:rounded-[40px] px-8 py-16 text-center -mb-24">
                <h2 className="text-3xl md:text-5xl font-extrabold font-serif">
                  Prepared to Change <br/> Your Experience?
                </h2>
                <a 
                  href="/signup" 
                  className="mt-8 inline-flex items-center justify-center bg-gray-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-gray-900 transition-colors"
                >
                  Get Started Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                {/* --- Missing Detail: Abstract Wave Graphic --- */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-20" aria-hidden="true">
                    <svg className="w-full h-full" viewBox="0 0 845 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M845 79.5C645.333 45.1667 400.1 -29.9 0 79.5V0H845V79.5Z" fill="white" fillOpacity="0.1"/>
                    </svg>
                </div>
            </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto pt-40 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-2">
            <a href="/" className="flex items-center space-x-2">
              <img src={white} alt="PraxForm Logo" className="h-10 w-auto" />
            </a>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Product</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="#faqs">FAQs</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Legal</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/terms">Terms of Use</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Help Center</h4>
            <ul className="mt-4 space-y-3">
              <FooterLink href="mailto:support@praxform.com">Send an Email</FooterLink>
              <FooterLink href="#contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* --- Hallucination: Socials Column --- */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Socials</h4>
            <div className="flex items-center space-x-4 mt-4">
                <SocialIcon href="#">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </SocialIcon>
                <SocialIcon href="#">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.242 2.633 7.828 6.25 9.142-.236.42-.3.94-.183 1.48.118.54.417 1.037.82 1.385.402.348.892.518 1.4.518.236 0 .47-.04.693-.122a6.93 6.93 0 00.323-.153.5.5 0 00.14-.362c.003-.128.062-.25.17-.348a12.03 12.03 0 002.26-1.956 10.15 10.15 0 002.324-3.699c.772.33 1.615.51 2.5.51 4.418 0 8-3.134 8-7s-3.582-7-8-7a8.958 8.958 0 00-4.25.986A7.014 7.014 0 007.05 4.385 7.032 7.032 0 004.93 8.25c0 .357.02.71.058 1.06a12.04 12.04 0 00-2.73 3.828A9.96 9.96 0 012 12zm3.37-2.39a1 1 0 011.26 1.548A5.04 5.04 0 0014.5 9.25a1 1 0 110 2 3.003 3.003 0 01-2.87-2.11 1 1 0 01.74-1.25z" clipRule="evenodd" /></svg>
                </SocialIcon>
                 <SocialIcon href="#">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.206v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.71zM4.98 8.59H7.5v8.59H4.98v-8.59zM6.237 7.16c-.792 0-1.432-.64-1.432-1.432s.64-1.432 1.432-1.432 1.432.64 1.432 1.432c0 .792-.64 1.432-1.432 1.432z" clipRule="evenodd" /></svg>
                </SocialIcon>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Praxform. All Rights Reserved.
          </p>
          <div className="mt-4 sm:mt-0">
             <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18"></path></svg>
                <span>ENG</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;