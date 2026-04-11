import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: "Expenses Processed", value: "10,000+", suffix: "Claims" },
  { label: "Active Users", value: "500+", suffix: "Teams" },
  { label: "OCR Accuracy", value: "99.9%", suffix: "Reliability" }
];

const Stats = () => {
  return (
    <section className="py-12 bg-white border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-px md:bg-slate-100">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 text-center"
            >
              <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
                {stat.value}
              </p>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">
                  {stat.label}
                </span>
                <span className="text-xs font-bold text-slate-400">
                    {stat.suffix}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
