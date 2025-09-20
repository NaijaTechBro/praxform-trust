import React from 'react';

const BookADemo = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl">
          <h2 className="text-center text-4xl font-serif font-bold text-gray-900">
            Book A Demo
          </h2>
          <form className="mt-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-gray-600 mb-1">FIRST NAME</label>
                <input type="text" id="first-name" placeholder="e.g John" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-gray-600 mb-1">LAST NAME</label>
                <input type="text" id="last-name" placeholder="e.g Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>
            <div>
              <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-600 mb-1">PHONE NUMBER</label>
              <input type="tel" id="phone-number" placeholder="000 000 000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-600 mb-1">EMAIL ADDRESS</label>
              <input type="email" id="email-address" placeholder="e.g John@mail.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Book Now <span>&rarr;</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookADemo;