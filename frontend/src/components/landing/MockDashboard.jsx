import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, Receipt, Users, Settings, Bell, Search, Plus } from 'lucide-react';

const MockDashboard = () => {
  return (
    <section id="demo" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Preview</h2>
          <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            The control center of your <br /> financial operations.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Dashboard Frame */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[600px]">
            
            {/* Sidebar Mock */}
            <div className="hidden md:flex w-20 lg:w-64 bg-slate-50 border-r border-slate-200 flex-col p-6">
              <div className="flex items-center gap-3 mb-10 px-2 lg:px-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="hidden lg:block font-black text-slate-900 text-sm uppercase tracking-tight">MoneyMatters</span>
              </div>
              
              <div className="space-y-2 flex-1">
                {[
                  { icon: <LayoutDashboard size={18} />, label: "Overview", active: true },
                  { icon: <Receipt size={18} />, label: "Expenses" },
                  { icon: <Wallet size={18} />, label: "Payouts" },
                  { icon: <Users size={18} />, label: "Team" },
                  { icon: <Settings size={18} />, label: "Settings" }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}>
                    <div className="shrink-0">{item.icon}</div>
                    <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="hidden lg:block overflow-hidden">
                          <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter leading-none mb-1">Alex Thorne</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin</p>
                      </div>
                  </div>
              </div>
            </div>

            {/* Main Content Mock */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">
              <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <div className="w-full bg-slate-50 border border-slate-100 rounded-xl h-9" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 relative">
                    <Bell size={18} />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                  </div>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Plus size={14} /> New Claim
                  </button>
                </div>
              </header>

              <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Total Pending", value: "$12,450.00", color: "indigo" },
                    { label: "Approved Today", value: "$4,200.50", color: "emerald" },
                    { label: "Awaiting OCR", value: "18 Bills", color: "amber" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl relative overflow-hidden group">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
                      <p className="text-xl font-black text-slate-900 tracking-tight relative z-10">{stat.value}</p>
                      <div className={`absolute bottom-0 right-0 w-12 h-12 bg-${stat.color}-500/5 group-hover:scale-[2] transition-transform rounded-full -mr-4 -mb-4`} />
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 px-6">
                      <tr>
                        {["Vendor", "Category", "Amount", "Status"].map((h, i) => (
                          <th key={i} className="py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { v: "Amazon Web Services", c: "Cloud Infrastructure", a: "$2,400.00", s: "Approved", sc: "emerald" },
                        { v: "Uber Technologies", c: "Transport", a: "$45.20", s: "In Review", sc: "amber" },
                        { v: "Starbucks Coffee", c: "Meals & Entertainment", a: "$12.80", s: "Pending", sc: "indigo" },
                        { v: "Apple Store", c: "Hardware", a: "$1,299.00", s: "Approved", sc: "emerald" }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">{row.v}</p>
                            <p className="text-[9px] font-bold text-slate-400 font-mono uppercase">#EXP-449{i}</p>
                          </td>
                          <td className="py-4 px-6 text-[10px] font-bold text-slate-500">{row.c}</td>
                          <td className="py-4 px-6 text-[10px] font-black text-slate-900">{row.a}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-md bg-${row.sc}-50 text-${row.sc}-600 text-[8px] font-black uppercase tracking-widest border border-${row.sc}-100`}>
                              {row.s}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </main>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-[-20px] left-[-20px] w-12 h-12 bg-indigo-500 rounded-2xl -z-10 blur-xl opacity-20" />
          <div className="absolute bottom-[-20px] right-[-20px] w-24 h-24 bg-indigo-600 rounded-full -z-10 blur-2xl opacity-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default MockDashboard;
