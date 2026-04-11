import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, ShieldCheck, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: <Upload size={32} />,
    title: "1. Snap & Upload",
    description: "Employees take a photo of their receipt or upload a file via the web or mobile app."
  },
  {
    icon: <Cpu size={32} />,
    title: "2. Auto-Extract",
    description: "Our AI immediately extracts the merchant, date, tax, and total amount."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "3. Fast Approval",
    description: "Managers get an instant notification to review and approve the expense."
  },
  {
    icon: <CreditCard size={32} />,
    title: "4. Rapid Payout",
    description: "Once approved, the system triggers the reimbursement process automatically."
  }
];

const Process = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Workflow</h2>
          <p className="text-3xl md:text-4xl font-black tracking-tight">
            From receipt to reimbursement <br /> in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
                <div className="text-indigo-400 group-hover:text-white transition-colors">
                    {step.icon}
                </div>
              </div>
              <h3 className="text-lg font-black mb-3 tracking-tight">{step.title}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute translate-x-32 translate-y-10">
                  <div className="w-16 h-px bg-white/10" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
