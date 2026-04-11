import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import FraudInsights from '../components/admin/FraudInsights';
import { mockRules } from '../data/mockData';
import { 
  getAdminBills, adminBillAction, getUsers, createUser, getBatchedBills, billAction,
  approveUser, rejectUser 
} from '../api';
import { getFullFileUrl } from '../utils/fileUtils';
import {
  Plus, Users, DollarSign, Clock, CheckCircle, Shield,
  Trash2, MessageSquare, ArrowRight, Scan, Copy, ExternalLink,
  ChevronRight, Inbox, FileText, Layers, ChevronDown, AlertCircle, X, ShieldAlert
} from 'lucide-react';

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-6 flex items-center gap-5 group cursor-default">
    <div className={`stat-card-icon ${color} text-white transition-transform group-hover:scale-110 duration-300`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

// ── Rule Card ────────────────────────────────────────────────────────────────
const RuleCard = ({ rule, onDelete }) => (
  <div className="card p-6 flex items-center justify-between hover:border-[#6C47FF]/30 transition-all border-slate-100 group">
    <div className="space-y-4 flex-1">
      <div>
        <h4 className="text-base font-bold text-slate-800">{rule.name}</h4>
        <p className="text-xs text-slate-400 mt-0.5">
          {rule.sequential ? 'Sequential' : 'Parallel'} approval • {rule.percentageRequired}% required
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Approvers:</span>
        {rule.approvers.map((approver, index) => (
          <React.Fragment key={approver}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 border border-slate-100">
              <div className="w-4 h-4 rounded bg-[#6C47FF]/10 text-[#6C47FF] flex items-center justify-center text-[8px]">
                {approver.charAt(0)}
              </div>
              {approver}
            </div>
            {index < rule.approvers.length - 1 && <ArrowRight size={14} className="text-slate-300 mx-1" />}
          </React.Fragment>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${rule.sequential ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
        {rule.sequential ? 'Sequential' : 'Parallel'}
      </span>
      <button
        onClick={() => onDelete(rule.id)}
        className="p-2 rounded-lg hover:bg-red-50 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// ── Reject Comment Modal ─────────────────────────────────────────────────────
const RejectModal = ({ billId, onConfirm, onCancel }) => {
  const [comment, setComment] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Reject Receipt</h3>
            <p className="text-xs text-slate-400">Provide a reason for rejection</p>
          </div>
          <button onClick={onCancel} className="ml-auto text-slate-300 hover:text-slate-600"><X size={16} /></button>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Explain the reason for rejection…"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 h-24 resize-none transition-all placeholder:text-slate-300 mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button
            onClick={() => onConfirm(comment)}
            className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Assign Manager Modal ───────────────────────────────────────────────────
const AssignManagerModal = ({ managers, onConfirm, onCancel }) => {
  const [selected, setSelected] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Assign Final Approver</h3>
            <p className="text-xs text-slate-400">Select a manager for final review</p>
          </div>
          <button onClick={onCancel} className="ml-auto text-slate-300 hover:text-slate-600"><X size={16} /></button>
        </div>

        <div className="space-y-3 mb-6">
          {managers.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                selected === m.id
                  ? 'border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/10'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{m.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{m.email}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === m.id ? 'border-indigo-500' : 'border-slate-200'
              }`}>
                {selected === m.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={!selected}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [bills, setBills] = useState([]);
  const [batches, setBatches] = useState([]);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [comments, setComments] = useState({});
  const [commentOpen, setCommentOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const [rejectModal, setRejectModal] = useState(null); // { id, batchMode }
  const [assignModal, setAssignModal] = useState(null); // { id, action, batchMode, status }
  const [managers, setManagers] = useState([]);
  const [rules, setRules] = useState(mockRules);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'employee', password: 'password123' });

  const pageTitles = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    rules: 'Approval Rules',
    expenses: 'Admin Approvals',
    batches: 'Batch Uploads',
    fraud: 'AI Fraud Insights'
  };

  const handleCopyInvite = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  React.useEffect(() => {
    fetchBills();
    if (activePage === 'users') fetchUsers();
    if (activePage === 'batches') fetchBatches();
  }, [activePage]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await getUsers();
      setManagers(res.data.filter(u => u.role.toLowerCase() === 'manager'));
    } catch (err) {
      console.error('Failed to fetch managers', err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await getAdminBills();
      if (res.data.success) setBills(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bills', err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await getBatchedBills();
      if (res.data.success) setBatches(res.data.data);
    } catch (err) {
      console.error('Failed to fetch batches', err);
    }
  };

  React.useEffect(() => {
    fetchManagers();
  }, []);

  // ── Standard bill approve/reject
  const handleAction = async (id, action, assignedManagerId = null) => {
    // If approving and multiple managers exist, show assign modal first
    if (action === 'approved' && !assignedManagerId && managers.length > 1) {
      setAssignModal({ id, action, batchMode: false });
      return;
    }

    try {
      await adminBillAction(id, { action, comment: comments[id] || '', assignedManagerId });
      await fetchBills();
      await fetchBatches();
    } catch (err) {
      console.error(`Failed to ${action} bill`, err);
      alert(err.response?.data?.message || `Failed to ${action} bill`);
    } finally {
      setCommentOpen(null);
      setAssignModal(null);
    }
  };

  // ── Batch bill action (PUT /bills/:id/action)
  const handleBillAction = async (id, status, comment = '', assignedManagerId = null) => {
    // If approving and multiple managers exist, show assign modal first
    if (status === 'APPROVED' && !assignedManagerId && managers.length > 1) {
      setAssignModal({ id, action: 'approved', batchMode: true, status });
      return;
    }

    try {
      await billAction(id, { status, comment, assignedManagerId });
      await fetchBatches();
      await fetchBills();
      setRejectModal(null);
      setAssignModal(null);
    } catch (err) {
      console.error('Bill action failed', err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await approveUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to approve user', err);
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this user?")) return;
    try {
      await rejectUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to reject user', err);
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  const pendingCount = bills.filter(b => b.current_stage === 'admin_review').length;
  const approvedCount = bills.filter(b => b.admin_status === 'approved').length;
  const totalAmount = bills.reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:block w-64 bg-[#0A0C10] border-r border-slate-800 flex-col p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 border border-slate-700">
            <img src="/logo.png" alt="MoneyMatters" className="w-full h-full object-cover" />
          </div>
          <span className="text-base font-black text-white tracking-tight">MoneyMatters</span>
        </div>

        <nav className="space-y-1 bg-[#0A0C10]">
          {[
            { id: 'dashboard', icon: Layers, label: 'Dashboard' },
            { id: 'expenses', icon: Shield, label: 'Approvals', badge: pendingCount > 0 ? pendingCount : null },
            { id: 'batches', icon: Inbox, label: 'Batches' },
            { id: 'users', icon: Users, label: 'Team' },
            { id: 'rules', icon: FileText, label: 'Rules' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                activePage === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-900/40' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activePage === item.id ? 'text-white' : 'text-slate-600'} />
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-lg shadow-rose-900/20 animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-8 pb-4">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] px-3">Advanced Intelligence</span>
          </div>

          <button
              onClick={() => setActivePage('fraud')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                activePage === 'fraud' 
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-xl shadow-red-900/40' 
                  : 'text-slate-500 hover:text-red-400 hover:bg-red-500/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert size={18} className={activePage === 'fraud' ? 'text-white' : 'text-red-900/30'} />
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Fraud Insights</span>
              </div>
              <div className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/20">AI</div>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/60">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all group"
          >
            <ArrowRight size={18} className="rotate-180 text-slate-700 group-hover:text-rose-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-rose-400">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar user={user} title={pageTitles[activePage] || 'Admin Portal'} />

        <main className="flex-1 overflow-y-auto">
          <div className="page-container py-6 space-y-6">

            {/* ── DASHBOARD ── */}
            {activePage === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} label="Total Users" value={users.length} color="bg-indigo-500" />
                  <StatCard icon={Clock} label="Pending Review" value={pendingCount} color="bg-amber-500" />
                  <StatCard icon={CheckCircle} label="Admin Approved" value={approvedCount} color="bg-emerald-500" />
                  {user?.inviteCode ? (
                    <div className="card p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Shield size={50} className="text-indigo-600" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invite Code</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xl font-mono font-bold text-slate-800 tracking-wider transition-colors group-hover:text-indigo-600">{user.inviteCode}</p>
                        <button
                          onClick={handleCopyInvite}
                          className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm'}`}
                        >
                          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <StatCard icon={DollarSign} label="Total Volume" value={`$${totalAmount.toLocaleString()}`} color="bg-violet-500" />
                  )}
                </div>

                {/* Action needed bills */}
                <div className="card overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Action Required</h3>
                    </div>
                    <button onClick={() => setActivePage('expenses')} className="group flex items-center gap-1.5 text-[11px] text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                      Review all <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                  {bills.filter(b => b.current_stage === 'admin_review').length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4"><Inbox size={28} /></div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Queue Clear</h4>
                      <p className="text-xs text-slate-400">No pending bills require your attention.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {bills.filter(b => b.current_stage === 'admin_review').slice(0, 5).map(bill => (
                        <div key={bill.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[11px]">
                              {bill.employee_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 leading-none mb-1.5">{bill.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{bill.employee_name} • {new Date(bill.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-5">
                            <span className="font-bold font-mono text-slate-700 text-xs">${Number(bill.amount).toFixed(2)}</span>
                            <div className="flex items-center gap-2">
                              {bill.receipt_url && (
                                <button onClick={() => window.open(getFullFileUrl(bill.receipt_url), '_blank')} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all" title="View Receipt">
                                  <Scan size={14} />
                                </button>
                              )}
                              <button onClick={() => setActivePage('expenses')} className="btn-secondary h-8 px-3 text-[10px] font-bold">Review</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── USERS ── */}
            {activePage === 'users' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">User Management</h3>
                    <p className="text-xs text-slate-400">Manage employees and roles in your company</p>
                  </div>
                  <button onClick={() => setShowAddUser(true)} className="btn-primary h-10 gap-2 px-4 text-xs">
                    <Plus size={16} /> Add User
                  </button>
                </div>
                <div className="card">
                  {loadingUsers && users.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">Loading users...</div>
                  ) : (
                    <Table
                      columns={[
                        {
                          key: 'name', label: 'Name', render: (val) => (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-[10px] font-bold">
                                {val.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-bold text-slate-700 text-xs">{val}</span>
                            </div>
                          )
                        },
                        {
                          key: 'role', label: 'Role', render: (val) => (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${val?.toLowerCase() === 'admin' ? 'bg-purple-100/50 text-purple-600' : val?.toLowerCase() === 'manager' ? 'bg-indigo-100/50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                              {val}
                            </span>
                          )
                        },
                        { key: 'email', label: 'Email', render: (val) => <span className="font-mono text-[11px] text-slate-400">{val}</span> },
                        {
                          key: 'status', label: 'Status', render: (val) => (
                            <StatusBadge status={val || 'pending'} />
                          )
                        },
                        {
                          key: 'status', label: 'Actions', render: (val, row) => (
                            <div className="flex items-center gap-2">
                              {/* Only show actions if user is pending AND is not the current admin themselves */}
                              {(!val || val === 'pending') && row.id !== user.id && (
                                <>
                                  <button 
                                    onClick={() => handleApproveUser(row.id)}
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                                    title="Approve User"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleRejectUser(row.id)}
                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all"
                                    title="Reject User"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          )
                        },
                      ]}
                      data={users}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ── RULES ── */}
            {activePage === 'rules' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Approval Rules</h3>
                    <p className="text-xs text-slate-400">Configure how expenses get approved</p>
                  </div>
                  <button onClick={() => setShowAddRule(true)} className="btn-primary h-10 gap-2 px-4 text-xs">
                    <Plus size={16} /> Add Rule
                  </button>
                </div>
                <div className="space-y-4">
                  {rules.map(rule => (
                    <RuleCard key={rule.id} rule={rule} onDelete={(id) => setRules(rules.filter(r => r.id !== id))} />
                  ))}
                </div>
              </div>
            )}

            {/* ── BILL APPROVALS ── */}
            {activePage === 'expenses' && (
              <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Review Pipeline</h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{pendingCount} claims awaiting sign-off</p>
                  </div>
                </div>
                {bills.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">No records found.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1.5fr] px-6 py-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <div>Entity Details</div>
                      <div>Valuation</div>
                      <div>Timestamp</div>
                      <div className="text-center">Lifecycle</div>
                      <div className="text-center">Evidence</div>
                      <div className="text-right pr-4">Oversight</div>
                    </div>
                    {bills.map((bill) => (
                      <div key={bill.id} className="group">
                        <div className="flex flex-col lg:grid lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1.5fr] px-6 py-4 hover:bg-slate-50/50 transition-colors items-center gap-4 lg:gap-0">
                          <div className="w-full lg:w-auto flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-indigo-200 transition-colors">
                              <FileText size={18} className="text-slate-300 group-hover:text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 leading-tight mb-1 truncate">{bill.title}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{bill.employee_name}</p>
                                {bill.batch_id && (
                                  <span className="flex items-center gap-1 text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full border border-violet-100">
                                    <Layers size={8} />Batch
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="w-full lg:w-auto font-bold font-mono text-xs text-slate-700 tracking-tight">
                            ${Number(bill.amount).toFixed(2)}
                          </div>
                          <div className="w-full lg:w-auto font-mono text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {new Date(bill.created_at).toLocaleDateString()}
                          </div>
                          <div className="w-full lg:w-auto flex justify-start lg:justify-center">
                            <StatusBadge status={bill.current_stage} />
                          </div>
                          <div className="w-full lg:w-auto flex justify-start lg:justify-center">
                            {bill.receipt_url ? (
                              <button onClick={() => window.open(getFullFileUrl(bill.receipt_url), '_blank')} className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-bold text-[9px] uppercase tracking-widest">
                                <ExternalLink size={10} /> Evidence
                              </button>
                            ) : (
                              <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-md border border-slate-100/50">Missing</span>
                            )}
                          </div>
                          <div className="w-full lg:w-auto flex items-center justify-end gap-2">
                            {bill.current_stage === 'admin_review' ? (
                              <>
                                <button onClick={() => handleAction(bill.id, 'approved')} className="btn-success h-8 px-3 text-[10px] font-black uppercase tracking-widest">OK</button>
                                <button onClick={() => handleAction(bill.id, 'rejected')} className="btn-danger h-8 px-3 text-[10px] font-black uppercase tracking-widest">NO</button>
                                <button
                                  onClick={() => setCommentOpen(commentOpen === bill.id ? null : bill.id)}
                                  className={`p-1.5 rounded-lg transition-all ${commentOpen === bill.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
                                >
                                  <MessageSquare size={14} />
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest pr-2">
                                <CheckCircle size={12} className="text-emerald-500/50" /> Audited
                              </div>
                            )}
                          </div>
                        </div>
                        {commentOpen === bill.id && (
                          <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-1 duration-200">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-inner">
                              <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Review Notes</label>
                                  <textarea
                                    placeholder="Document rationale…"
                                    value={comments[bill.id] || ''}
                                    onChange={(e) => setComments({ ...comments, [bill.id]: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 h-16 resize-none transition-all placeholder:text-slate-300"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button onClick={() => handleAction(bill.id, 'approved')} className="bg-emerald-500 text-white h-7 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-emerald-600 transition-colors">Release</button>
                                  <button onClick={() => handleAction(bill.id, 'rejected')} className="bg-rose-500 text-white h-7 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-colors">Block</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── BATCH UPLOADS ── */}
            {activePage === 'batches' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">Batch Uploads</h3>
                  <p className="text-xs text-slate-400">Employee bulk receipt submissions — each receipt can be approved independently</p>
                </div>

                {batches.length === 0 ? (
                  <div className="card p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                      <Layers size={32} />
                    </div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">No Batch Uploads</h4>
                    <p className="text-xs text-slate-400">Employees haven't submitted any batch uploads yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batches.map((batch) => {
                      const isExpanded = expandedBatch === batch.batch_id;
                      const allApproved = batch.bills.every(b => b.admin_status === 'approved');
                      const hasRejected = batch.bills.some(b => b.admin_status === 'rejected');
                      const pendingInBatch = batch.bills.filter(b => b.current_stage === 'admin_review').length;

                      return (
                        <div key={batch.batch_id} className="card overflow-hidden">
                          {/* Batch Header */}
                          <button
                            onClick={() => setExpandedBatch(isExpanded ? null : batch.batch_id)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-lg shadow-violet-500/25">
                                <Layers size={18} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-bold text-slate-800">{batch.employee_name}</p>
                                  {pendingInBatch > 0 && (
                                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
                                      {pendingInBatch} pending
                                    </span>
                                  )}
                                  {allApproved && (
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                      ✓ All approved
                                    </span>
                                  )}
                                  {hasRejected && !allApproved && (
                                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                      Has rejections
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  {batch.receipt_count} receipt{batch.receipt_count > 1 ? 's' : ''} • ${batch.total_amount.toFixed(2)} total • {new Date(batch.submission_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                {batch.receipt_count} receipts
                              </span>
                              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {/* Expanded: individual receipt rows */}
                          {isExpanded && (
                            <div className="border-t border-slate-100 divide-y divide-slate-100 animate-in slide-in-from-top-1 duration-200">
                              {/* Sub-header */}
                              <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr] px-6 py-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <div>Receipt</div>
                                <div>Amount</div>
                                <div>Date</div>
                                <div className="text-center">Status</div>
                                <div className="text-center">Evidence</div>
                                <div className="text-right pr-4">Action</div>
                              </div>

                              {batch.bills.map((bill) => (
                                <div key={bill.id} className="flex flex-col lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr] px-6 py-3 hover:bg-slate-50/30 transition-colors items-center gap-3 lg:gap-0">
                                  {/* Receipt info */}
                                  <div className="w-full lg:w-auto flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                      <FileText size={14} className="text-slate-300" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-700 truncate">{bill.title}</p>
                                      <p className="text-[9px] text-slate-400 uppercase tracking-wide">{bill.category}</p>
                                    </div>
                                  </div>

                                  {/* Amount */}
                                  <div className="font-mono text-xs font-bold text-slate-700">
                                    ${Number(bill.amount).toFixed(2)}
                                  </div>

                                  {/* Date */}
                                  <div className="font-mono text-[10px] text-slate-400 font-bold">
                                    {new Date(bill.created_at).toLocaleDateString()}
                                  </div>

                                  {/* Status */}
                                  <div className="flex justify-start lg:justify-center">
                                    <StatusBadge status={bill.current_stage} />
                                  </div>

                                  {/* Evidence */}
                                  <div className="flex justify-start lg:justify-center">
                                    {bill.receipt_url ? (
                                      <button onClick={() => window.open(getFullFileUrl(bill.receipt_url), '_blank')} className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                        <ExternalLink size={10} /> View
                                      </button>
                                    ) : (
                                      <span className="text-[9px] text-slate-300 font-bold">No file</span>
                                    )}
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex items-center justify-end gap-2">
                                    {bill.current_stage === 'admin_review' ? (
                                      <>
                                        <button
                                          onClick={() => handleBillAction(bill.id, 'APPROVED')}
                                          className="flex items-center gap-1 h-7 px-3 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                                        >
                                          <CheckCircle size={11} /> Approve
                                        </button>
                                        <button
                                          onClick={() => setRejectModal({ id: bill.id })}
                                          className="flex items-center gap-1 h-7 px-3 rounded-lg bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
                                        >
                                          <X size={11} /> Reject
                                        </button>
                                      </>
                                    ) : (
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                        bill.admin_status === 'approved' ? 'text-emerald-600 bg-emerald-50' :
                                        bill.admin_status === 'rejected' ? 'text-rose-600 bg-rose-50' :
                                        'text-slate-400 bg-slate-100'
                                      }`}>
                                        {bill.admin_status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                  })}
                </div>
              )}
            </div>
          )}

            {/* ── FRAUD INSIGHTS ── */}
            {activePage === 'fraud' && (
              <FraudInsights bills={bills} onAction={handleAction} />
            )}
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <RejectModal
          billId={rejectModal.id}
          onConfirm={(comment) => handleBillAction(rejectModal.id, 'REJECTED', comment)}
          onCancel={() => setRejectModal(null)}
        />
      )}

      {/* Assign Manager Modal */}
      {assignModal && (
        <AssignManagerModal
          managers={managers}
          onCancel={() => setAssignModal(null)}
          onConfirm={(managerId) => {
            if (assignModal.batchMode) {
              handleBillAction(assignModal.id, assignModal.status, '', managerId);
            } else {
              handleAction(assignModal.id, assignModal.action, managerId);
            }
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <Modal open={showAddUser} onClose={() => setShowAddUser(false)} title="Add New User">
          <form className="p-6 space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            try {
              await createUser(newUser);
              setShowAddUser(false);
              setNewUser({ name: '', email: '', role: 'employee', password: 'password123' });
              fetchUsers();
            } catch (err) {
              console.error('Failed to create user', err);
              alert(err.response?.data?.message || 'Failed to create user');
            }
          }}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input type="text" className="input" placeholder="John Doe" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <input type="email" className="input" placeholder="john@company.com" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
              <select className="input" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Temporary Password</label>
              <input type="text" className="input" placeholder="Initial password" required value={newUser.password || 'password123'} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </div>
            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowAddUser(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Create User</button>
            </div>
          </form>
        </Modal>
      )}

      {showAddRule && (
        <Modal open={showAddRule} onClose={() => setShowAddRule(false)} title="Add Rule">
          <div className="p-4">Placeholder form</div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
