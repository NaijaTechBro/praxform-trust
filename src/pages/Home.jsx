import React from 'react';
import Header from '../components/Home/Header';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItsWorks';
import Faq from '../components/Home/Faq';
import Contact from '../components/Home/Contact';
import Footer from '../components/Home/Footer';
import '../index.css';

function App() {
  return (
    <div className="App">
      <Header />
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