import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import TechStack from './TechStack';
import Projects from './Projects';
import Achievements from './Achievements';
import Certifications from './Certifications';
import About from './About';
import Contact from './Contact';

const Home: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure rendering
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <TechStack />
      <Projects />
      <Achievements />
      <Certifications />
      <About />
      <Contact />
    </>
  );
};

export default Home;