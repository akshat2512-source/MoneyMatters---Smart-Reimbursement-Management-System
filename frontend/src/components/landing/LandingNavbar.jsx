import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-2.5 flex items-center justify-between transition-all ${scrolled ? 'shadow-xl shadow-slate-200/50 scale-[0.99] border-slate-100' : ''}`}>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-indigo-100 border border-white/50">
                <img src="/logo.png" alt="MoneyMatters" className="w-full h-full object-cover" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">MoneyMatters</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">How it works</a>
            <Link to="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link>

          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Sign In</Link>
            <motion.div 
              onClick={() => window.location.href='/signup'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-indigo-200 cursor-pointer"
            >
              Start Free <ArrowRight size={14} />
            </motion.div>

          </div>

          <button 
            className="md:hidden text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 z-40"
          >
            <div className="flex flex-col gap-8">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-900">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-900">How it works</a>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-slate-900">Pricing</Link>

              <div className="h-px bg-slate-100"></div>
              <a href="/login" className="text-sm font-black uppercase tracking-widest text-slate-900">Sign In</a>
              <a href="/signup" className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                Start Free <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNavbar;
