import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">MoneyMatters</span>
            </div>
            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
              The smart nucleus of your company spend. Streamline reimbursements and automate compliance with AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">How it works</a></li>
              <li><a href="#pricing" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">About</a></li>
              <li><a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <Mail size={16} className="text-slate-300" />
                support@moneymatters.ai
              </li>
              <li className="text-xs font-bold text-slate-500 leading-relaxed">
                123 Industrial Ave, <br /> San Francisco, CA 94107
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © 2024 MoneyMatters AI. All rights reserved.
          </p>
          <div className="flex gap-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Built for the future of work</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
