import React from 'react';
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItsWorks';
import Faq from '../components/Home/Faq';
import Contact from '../components/Home/company/Contact';
import Footer from '../components/Home/Footer';
import '../index.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;