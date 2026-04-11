import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Scan } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl px-4 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-50/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">
                Trusted by 500+ Engineering Teams
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8"
            >
              From Receipts to <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                Reimbursements.
              </span>
              <br /> Instantly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
            >
              The smart nucleus of your company spend. Scan receipts, automate approvals, and get paid back in seconds—all powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free <ArrowRight size={16} />
                </span>
              </motion.a>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                Watch Demo <Play size={14} fill="currentColor" />
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Visual Visual UI */}
          <div className="flex-1 w-full max-w-2xl relative lg:mt-0 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative aspect-[4/3] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(49,46,129,0.15)] border border-slate-100 p-4"
            >
              {/* Internal Mock Dashboard UI */}
              <div className="w-full h-full bg-slate-50 rounded-[1.8rem] border border-slate-200 overflow-hidden flex flex-col">
                <div className="h-12 border-b border-slate-200 flex items-center px-6 justify-between bg-white text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Dashboard Overview</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Scan size={16} className="text-indigo-600" />
                      </div>
                      <div className="h-2 w-12 bg-slate-100 rounded-full" />
                    </div>
                    <div className="h-24 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      </div>
                      <div className="h-2 w-8 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4">
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                            <div className="h-1.5 w-1/3 bg-slate-50 rounded-full" />
                          </div>
                          <div className="h-2 w-12 bg-indigo-50 rounded-full border border-indigo-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-12 w-48 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Scan size={14} className="text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-800">OCR Scan Complete</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-indigo-600" 
                    />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 -left-12 w-56 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 z-20"
              >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-900 leading-none mb-1">Payment Approved</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">$2,450.00 Reimbursement</p>
                    </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
