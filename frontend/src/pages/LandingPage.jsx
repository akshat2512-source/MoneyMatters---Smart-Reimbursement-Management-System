import React from 'react';
import { motion } from 'framer-motion';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import ProblemSolution from '../components/landing/ProblemSolution';
import Process from '../components/landing/Process';
import MockDashboard from '../components/landing/MockDashboard';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <LandingNavbar />
      
      <main>
        {/* Hero Section stays as-is with its own entry animations */}
        <Hero />

        {/* Stats Section */}
        <motion.div {...fadeInUp}>
          <Stats />
        </motion.div>

        {/* Problem & Solution */}
        <motion.div {...fadeInUp}>
          <ProblemSolution />
        </motion.div>

        {/* Features */}
        <motion.div {...fadeInUp}>
          <Features />
        </motion.div>

        {/* How It Works */}
        <motion.div {...fadeInUp}>
          <Process />
        </motion.div>

        {/* Mock Dashboard Preview */}
        <motion.div {...fadeInUp}>
          <MockDashboard />
        </motion.div>

        {/* Call To Action */}
        <motion.div {...fadeInUp}>
          <CTA />
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
