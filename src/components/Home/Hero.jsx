import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import dashboardImage from '../../assets/hero-dashboard.png';
import { useBlog } from '../../context/BlogContext';
import { differenceInHours } from 'date-fns'

const Hero = () => {
  const { latestPost, getLatestPost } = useBlog();
  const [showLatestPost, setShowLatestPost] = useState(false);

  //console.log("Latest post from context:", latestPost);
  // Fetch the latest post on component mount
  useEffect(() => {
    getLatestPost();
  }, [getLatestPost]);

  // Check if the latest post is within 24 hours
  useEffect(() => {
    if (latestPost) {
      const hoursSinceCreation = differenceInHours(
        new Date(),
        new Date(latestPost.createdAt)
      );
      if (hoursSinceCreation < 24) {
        setShowLatestPost(true);
      } else {
        setShowLatestPost(false);
      }
    }
  }, [latestPost]);

  // Helper function to render the badge
  const renderNewFeatureBadge = () => {
    if (showLatestPost && latestPost) {
      return (
        <Link
          to={`/blog/${latestPost.slug}`}
          className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1 mb-6 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <span className="bg-[#1475F4] rounded-full text-white px-3 py-1 text-xs font-semibold mr-2">New</span>
          {latestPost.title}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      );
    }

    // Default badge
    return (
      <div className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1 mb-6 text-sm font-medium text-gray-700">
        <span className="bg-[#1475F4] rounded-full text-white px-3 py-1 text-xs font-semibold mr-2">New</span>
        The Financial Brighter Application
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* New Feature Badge */}
        {/* <div className="inline-flex items-center justify-center bg-gray-200 rounded-full p-1 mb-6 text-sm font-medium text-gray-700">
          <span className="bg-[#1475F4] rounded-full text-white px-3 py-1 text-xs font-semibold mr-2">New</span>
          The Financial Brighter Application
          <svg xmlns=s"http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div> */}
        {renderNewFeatureBadge()}

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#030405] leading-tight tracking-tighter       font-serif">
          Gather Client <br/>Info Confidently.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-[#5F80A0]">
          PraxForm helps businesses create secure, branded digital forms that clients actually trust. No paper trails, no email risks, no compliance headaches.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/signup"
            className="w-full sm:w-auto bg-[#1475F4] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#1268DA] transition-colors shadow-sm"
          >
            Get Early Access
          </a>
          <a
            href="/demo"
            className="w-full sm:w-auto text-[#1475F4] font-semibold px-8 py-3 rounded-full border-2 border-[#1475F4] hover:bg-[#E8F1FE] transition-colors"
          >
            Book a Demo
          </a>
        </div>

        {/* Dashboard Image */}
        <div className="mt-16 max-w-6xl mx-auto">
          <img 
            src={dashboardImage} 
            alt="PraxForm Dashboard Preview" 
            className="w-full h-auto rounded-xl shadow-2xl border border-gray-200/80" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;