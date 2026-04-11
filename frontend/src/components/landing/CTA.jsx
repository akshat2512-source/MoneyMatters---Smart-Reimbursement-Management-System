import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200"
        >
          {/* Animated background element */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8">
              <Sparkles size={14} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Join 2,000+ companies</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
              Start managing expenses <br /> smartly today.
            </h2>
            
            <p className="text-white/70 text-lg font-medium max-w-xl mx-auto mb-10">
              Deploy the nucleus of your company spend in minutes. No credit card required to start.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/signup" 
                className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl"
              >
                Create Free Account
              </a>
              <a 
                href="/login" 
                className="w-full sm:w-auto px-10 py-5 bg-indigo-500 text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all"
              >
                Sign In
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
