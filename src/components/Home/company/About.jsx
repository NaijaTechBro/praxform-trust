import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Link } from 'react-router-dom';


const About = () => {
  const teamMembers = [
    // {
    //   name: 'Asaolu OluwaToyin',
    //   role: 'CEO & Founder',
    //   imageUrl: 'https://via.placeholder.com/200'
    // },
    // {
    //   name: 'Sodiq Baki Adeiza',
    //   role: 'Principal Developer & Co-founder',
    //   imageUrl: 'https://res.cloudinary.com/dkcazf954/image/upload/v1701160793/blogposts/file_k7e4lb.jpg'
    // },
    // Add more team members here if needed, with relevant images
    // {
    //   name: 'John Smith',
    //   role: 'Head of Product',
    //   imageUrl: 'https://via.placeholder.com/200' // Placeholder for other team members
    // }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-blue-900 py-16 px-4"> {/* Changed to blue-900 for Praxform branding */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Praxform</h1> {/* Updated title */}
          <p className="text-blue-200 text-lg"> {/* Adjusted text color for contrast */}
            We're dedicated to building trust and securing sensitive data for professionals and organizations in regulated industries.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 px-4 bg-gray-50 dark:bg-gray-800"> {/* Light grey background */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2025, Praxform emerged from a critical need: to provide a user-friendly yet uncompromisingly secure platform for collecting sensitive information. We observed that many small to medium-sized businesses in regulated sectors struggled with outdated, insecure, or overly complex data collection methods.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our founders, drawing on insights from compliance and security, envisioned a tool that would simplify HIPAA, GLBA, and other data protection requirements, making robust security accessible to everyone from private medical practices to independent financial advisors.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Today, Praxform is committed to empowering organizations to collect, manage, and audit their confidential data with confidence, ensuring compliance and fostering client trust.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg"> {/* Added shadow for depth */}
                {/* Changed placeholder image to reflect data/security theme */}
              <img src="https://res.cloudinary.com/dkcazf954/image/upload/v1701160793/blogposts/secure-data-collection.jpg" alt="Secure data collection" className="w-full h-auto object-cover md:h-96" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 px-4 bg-white dark:bg-gray-900"> {/* White background */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md"> {/* Light grey card background */}
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To simplify and secure sensitive data collection for professionals and organizations, enabling compliance with industry regulations and fostering unwavering client trust.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md"> {/* Light grey card background */}
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To be the most trusted and intuitive platform for secure data transactions, setting the standard for compliance and data integrity across all industries globally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 bg-gray-50 dark:bg-gray-800"> {/* Light grey background */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"> {/* White card background */}
                <img src={member.imageUrl} alt={member.name} className="w-full h-48 object-cover object-top" /> {/* object-top for better head visibility */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We're a passionate team dedicated to redefining data security and compliance. If you're driven to make an impact, explore opportunities to join us.
            </p>
            <Link to="/careers" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Openings
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;