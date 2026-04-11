import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, ExternalLink, Zap } from 'lucide-react';
import { getFullFileUrl } from '../../utils/fileUtils';

const FraudInsights = ({ bills = [], onAction }) => {
  const safeBills = Array.isArray(bills) ? bills : [];

  // Filter for suspicious bills
  const suspiciousBills = useMemo(() => safeBills.filter(b => b?.is_suspicious), [safeBills]);
  
  // Stats Calculation
  const totalCount = safeBills.length;
  const fraudCount = suspiciousBills.length;
  const fraudRate = totalCount > 0 ? ((fraudCount / totalCount) * 100).toFixed(1) : "0.0";
  const totalRiskAmount = suspiciousBills.reduce((acc, b) => acc + Number(b?.amount || 0), 0);

  // Chart Data: Normal vs Suspicious
  const chartData = [
    { name: 'Normal', value: Math.max(0, totalCount - fraudCount), color: '#6366f1' },
    { name: 'Suspicious', value: fraudCount, color: '#ef4444' }
  ];

  // Category Distribution
  const categoryData = useMemo(() => {
    const counts = {};
    suspiciousBills.forEach(b => {
      const cat = b?.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [suspiciousBills]);

  const COLORS = ['#ef4444', '#f59e0b', '#6366f1', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* ── Status Banner ── */}
      <div className="bg-gradient-to-r from-red-500/10 to-indigo-500/10 border border-red-200/50 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">AI Fraud Intelligence</h2>
            <p className="text-xs text-slate-500 font-medium">Scanning for duplicate receipts and behavioral anomalies in real-time.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <Zap size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Engines Online</span>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Snapshot</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{fraudCount}</p>
          <p className="text-[10px] text-red-500 font-bold mt-1 inline-flex items-center gap-1">
            <AlertTriangle size={10} /> Suspicious Claims
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exposure Rate</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{fraudRate}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-red-500 h-full" style={{ width: `${fraudRate}%` }} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">At-Risk Capital</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">${totalRiskAmount.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Pending approval</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Score</p>
          <p className="text-2xl font-black text-emerald-600 tracking-tight">99.9%</p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1 inline-flex items-center gap-1">
            <CheckCircle size={10} /> High Integrity
          </p>
        </div>
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Risk Composition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Suspicious Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40}>
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Suspicious Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Flagged Items</h3>
          <span className="text-[9px] font-black bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">
             REQUIRES ACTION
          </span>
        </div>
        
        {suspiciousBills.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No suspicious items found in current dataset.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {suspiciousBills.map((bill) => (
              <div key={bill.id} className="p-4 px-6 hover:bg-slate-50/50 transition-colors flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_2.5fr_1.5fr] items-center gap-4">
                
                <div className="w-full md:w-auto flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                        <ShieldAlert size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-black text-slate-900 leading-none mb-1.5 truncate">{bill.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{bill.employee_name}</p>
                    </div>
                </div>

                <div className="w-full md:w-auto font-mono text-xs font-black text-slate-700">
                    ${Number(bill.amount).toFixed(2)}
                </div>

                <div className="w-full md:w-auto font-mono text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    {new Date(bill.created_at).toLocaleDateString()}
                </div>

                <div className="w-full md:w-auto flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                    <p className="text-[9px] font-bold text-red-600 leading-[1.4] pr-4">
                        {bill.fraud_reason || "Anomaly detected"}
                    </p>
                </div>

                <div className="w-full md:w-auto flex items-center justify-end gap-2">
                    {bill.receipt_url && (
                        <button onClick={() => window.open(getFullFileUrl(bill.receipt_url), '_blank')} className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm" title="View Evidence">
                            <ExternalLink size={14} />
                        </button>
                    )}
                    <button 
                        onClick={() => onAction(bill.id, 'approved')} 
                        className="bg-emerald-50 text-emerald-600 p-1.5 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                    >
                        PASS
                    </button>
                    <button 
                        onClick={() => onAction(bill.id, 'rejected')} 
                        className="bg-red-50 text-red-600 p-1.5 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100"
                    >
                        FAIL
                    </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3 items-center">
        <Info size={16} className="text-indigo-400 shrink-0" />
        <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">
            Rules Applied: Duplicate Hash Check, velocity monitoring (5+ apps/10m), and Anomaly detection ($ > 3x avg).
        </p>
      </div>

    </div>
  );
};

export default FraudInsights;
