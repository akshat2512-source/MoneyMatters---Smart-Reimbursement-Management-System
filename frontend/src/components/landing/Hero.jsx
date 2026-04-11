import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, CheckCircle2, Scan, 
  ShieldAlert, Activity, Search, Bell, 
  Plus, LayoutDashboard, Wallet, Receipt
} from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl px-4 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] left-[-15%] w-[500px] h-[500px] bg-purple-50/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[300px] h-[300px] bg-blue-50/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-2">
                Join 2,000+ Teams
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8"
            >
              Zero Hassle <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Cashback.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
            >
              The smart nucleus of your company spend. Scan receipts, detect fraud with AI, and automate approvals instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started <ArrowRight size={16} />
                </span>
              </motion.a>
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-xl shadow-slate-200/20"
              >
                Watch Workflow <Play size={14} fill="currentColor" />
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Premium Interactive Mock */}
          <div className="flex-1 w-full max-w-3xl relative lg:mt-0 mt-20">
            
            {/* Background Glow for Dashboard */}
            <div className="absolute inset-0 bg-indigo-200/20 blur-[100px] rounded-full" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(49,46,129,0.12)] border border-slate-100 p-3 z-10"
            >
              {/* Internal Dashboard UI */}
              <div className="w-full h-full bg-slate-50 rounded-[2.2rem] border border-slate-200 overflow-hidden flex flex-col min-h-[500px] shadow-inner">
                
                {/* Dashboard Header */}
                <div className="h-14 border-b border-slate-200 flex items-center px-6 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-100 h-2.5 rounded-full hidden md:block" />
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-100" />
                      <div className="w-3 h-3 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-hidden">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Claimed", val: "₹12,450", color: "indigo" },
                      { label: "Approved", val: "₹8,200", color: "emerald" },
                      { label: "AI Saved", val: "₹1,150", color: "purple" }
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2 truncate">{s.label}</p>
                        <p className={`text-sm font-black text-slate-900 tracking-tight`}>{s.val}</p>
                        <div className={`w-full h-1 bg-${s.color}-100 rounded-full mt-2 overflow-hidden`}>
                          <div className={`w-2/3 h-full bg-${s.color}-500`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Activity List */}
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-400 flex justify-between">
                      <span>Recent Expenses</span>
                      <span>Manage All</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {[
                        { name: "Amazon AWS", cat: "Infrastructure", amt: "₹4,200", status: "Approved", sc: "emerald" },
                        { name: "Uber Ride", cat: "Travel", amt: "₹450", status: "In Review", sc: "indigo" },
                        { name: "Starbucks", cat: "Meals", amt: "₹280", status: "Rejected", sc: "rose" }
                      ].map((row, i) => (
                        <div key={i} className="px-4 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400">
                              {row.name[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-900 leading-none mb-1">{row.name}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{row.cat}</p>
                            </div>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-black text-slate-900 mb-1">{row.amt}</p>
                              <span className={`px-2 py-0.5 rounded-full bg-${row.sc}-50 text-${row.sc}-600 text-[6px] font-black uppercase tracking-widest border border-${row.sc}-100`}>
                                {row.status}
                              </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING FEATURE CARDS */}

              {/* 1. OCR Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-12 w-48 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 z-30"
              >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Scan size={14} className="text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">OCR Scanned</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-bold text-slate-400">
                        <span>Analysis</span>
                        <span>100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-indigo-600" />
                    </div>
                </div>
              </motion.div>

              {/* 2. Fraud Shield Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-16 w-52 bg-rose-50 p-4 rounded-2xl shadow-xl border border-rose-100 z-30"
              >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
                        <ShieldAlert size={14} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-rose-600 leading-none mb-1">Fraud Alert</p>
                        <p className="text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Duplicate Receipt</p>
                    </div>
                </div>
                <div className="bg-white/50 rounded-lg p-2 border border-rose-100">
                    <div className="flex gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-md" />
                        <div className="flex-1 space-y-1">
                            <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                            <div className="h-1 w-2/3 bg-slate-100 rounded-full" />
                        </div>
                    </div>
                </div>
              </motion.div>

              {/* 3. Approval Success Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-8 right-10 w-56 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 z-30"
              >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-900 leading-none mb-1">Approved</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.05em] leading-none">Instant Reimbursement</p>
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

