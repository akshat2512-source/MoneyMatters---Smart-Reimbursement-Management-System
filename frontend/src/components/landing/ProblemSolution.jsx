import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from 'lucide-react';

const ProblemSolution = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Problem */}
          <div className="flex-1 w-full lg:w-1/2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">The Challenge</h2>
            <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Manual expense tracking is broken.</h3>
            
            <div className="space-y-6">
              {[
                "Lost receipts and manual data entry errors.",
                "Weeks of delay in employee reimbursements.",
                "Zero visibility into real-time company spend.",
                "Compliance risks and difficult auditing."
              ].map((text, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50"
                >
                  <XCircle className="text-rose-500 mt-0.5 shrink-0" size={20} />
                  <p className="text-slate-600 font-medium text-sm">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Solution */}
          <div className="flex-1 w-full lg:w-1/2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">The Solution</h2>
            <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">MoneyMatters: The Smart Nucleus.</h3>
            
            <div className="space-y-6">
              {[
                "AI scans receipts with 99.9% accuracy.",
                "Automated approval workflows save hours.",
                "Crystal clear transparency for every dollar.",
                "Instant payouts and effortless compliance."
              ].map((text, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50"
                >
                  <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                  <p className="text-slate-600 font-medium text-sm">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
