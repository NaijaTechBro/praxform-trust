// import React from 'react';
// import Navbar from '../Navbar';
// import Footer from '../Footer';


// const Careers = () => {
//   const jobOpenings = [
//     {
//       title: 'Senior Frontend Engineer',
//       department: 'Engineering',
//       location: 'Remote',
//       type: 'Full-time'
//     },
//     {
//       title: 'Backend Developer',
//       department: 'Engineering',
//       location: 'Remote',
//       type: 'Full-time'
//     },
//     // {
//     //   title: 'Customer Success Manager',
//     //   department: 'Sales',
//     //   location: 'London',
//     //   type: 'Full-time'
//     // },
//     // {
//     //   title: 'Marketing Specialist',
//     //   department: 'Marketing',
//     //   location: 'Remote',
//     //   type: 'Contract'
//     // }
//   ];

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
      
//       {/* Hero Section */}
//       <div className="bg-black py-16 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-4xl font-bold text-white mb-6">Join Our Team</h1>
//           <p className="text-white text-lg">
//             We're building the future of Africa Startup Data and Infrastructure and we need talented people like you.
//             Explore our open positions and find your next opportunity.
//           </p>
//         </div>
//       </div>
      
//       {/* Values Section */}
//       <div className="py-16 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="p-6 bg-gray-50 rounded-lg">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Innovation</h3>
//               <p className="text-gray-600">We constantly push the boundaries and think outside the box to create solutions that transform the industry.</p>
//             </div>
            
//             <div className="p-6 bg-gray-50 rounded-lg">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
//               <p className="text-gray-600">We believe in the power of teamwork and fostering an inclusive environment where everyone's voice is heard.</p>
//             </div>
            
//             <div className="p-6 bg-gray-50 rounded-lg">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Integrity</h3>
//               <p className="text-gray-600">We maintain the highest standards of honesty, transparency and ethical behavior in everything we do.</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Open Positions Section */}
//       <div className="py-16 px-4 bg-gray-50">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             {jobOpenings.map((job, index) => (
//               <div key={index} className={`border-b border-gray-200 ${index === jobOpenings.length - 1 ? 'border-b-0' : ''}`}>
//                 <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
//                   <div>
//                     <h3 className="text-lg font-semibold">{job.title}</h3>
//                     <p className="text-gray-600">{job.department} • {job.location} • {job.type}</p>
//                   </div>
//                   <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//                     Apply Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="mt-8 text-center">
//             <p className="text-gray-600 mb-4">Don't see a position that matches your skills?</p>
//             <button className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
//               Send Open Application
//             </button>
//           </div>
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// };

// export default Careers;








import React from 'react';
import Navbar from '../Navbar'; // Assuming this is your header
import Footer from '../Footer';   // Assuming this is your footer
import { Link } from 'react-router-dom';
import { FiLock, FiShield, FiUsers } from 'react-icons/fi'; // Icons relevant to Praxform's values

const Careers = () => {
  const jobOpenings = [
    {
      title: 'Senior Frontend Engineer (React)',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Senior Backend Engineer (Node.js)',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Product Security Specialist',
      department: 'Security & Compliance',
      location: 'Remote',
      type: 'Full-time'
    },
    // Add more job openings as needed
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Join Our Mission</h1>
          <p className="text-blue-200 text-lg">
            We're building the future of secure data exchange. We need passionate, security-minded people like you to help us build a more trustworthy digital world.
          </p>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <FiLock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security First</h3>
              <p className="text-gray-600 dark:text-gray-300">Security isn't an afterthought; it's the foundation of everything we build. We are obsessed with protecting our customers' most sensitive data.</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">We exist to serve our customers. We earn their trust through transparency, reliability, and an unwavering commitment to their success and data privacy.</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <FiShield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Uncompromising Integrity</h3>
              <p className="text-gray-600 dark:text-gray-300">We operate with the highest ethical standards. We build products we're proud of and conduct our business in a way that reflects our commitment to doing the right thing.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Open Positions Section */}
      <div className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {jobOpenings.map((job, index) => (
              <div key={index} className={`border-b border-gray-200 dark:border-gray-700 ${index === jobOpenings.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{job.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{job.department} • {job.location} • {job.type}</p>
                  </div>
                  <Link to={`/apply/${job.title.toLowerCase().replace(/\s/g, '-')}`} className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors self-start md:self-center">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Don't see a position that fits? We're always looking for great talent.</p>
            <a href="mailto:careers@praxform.com" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;