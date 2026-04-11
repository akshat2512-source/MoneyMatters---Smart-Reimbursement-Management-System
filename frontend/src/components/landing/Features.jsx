import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Layers, ShieldCheck, Globe, LineChart, Cpu } from 'lucide-react';

const features = [
  {
    icon: <Scan className="text-indigo-600" size={24} />,
    title: "OCR Receipt Scanning",
    description: "Automatically extract date, amount, and category from any receipt using AI-powered OCR."
  },
  {
    icon: <Layers className="text-indigo-600" size={24} />,
    title: "Batch Processing",
    description: "Upload multiple receipts at once. Our system processes them in the background for you."
  },
  {
    icon: <ShieldCheck className="text-indigo-600" size={24} />,
    title: "Multi-Level Approvals",
    description: "Set up complex approval chains to ensure every expense is vetted by the right stakeholders."
  },
  {
    icon: <Globe className="text-indigo-600" size={24} />,
    title: "Global Currency Support",
    description: "Submit expenses in any currency. We handle the conversion and base amount calculation."
  },
  {
    icon: <LineChart className="text-indigo-600" size={24} />,
    title: "Real-Time Tracking",
    description: "Employees and managers can track the status of reimbursements from submission to payout."
  },
  {
    icon: <Cpu className="text-indigo-600" size={24} />,
    title: "Intelligent Compliance",
    description: "Custom rules automatically flag duplicate entries or expenses that exceed policy limits."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Features</h2>
          <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Everything you need to manage company spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">
                {feature.feature_title || feature.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
