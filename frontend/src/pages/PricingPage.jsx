import React, { useState } from 'react';
import { Check, Zap, Shield, Crown, ArrowRight, Star } from 'lucide-react';
import * as api from '../api';


const PricingPage = ({ user, onLogin }) => {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (planType) => {
    if (planType === 'FREE') return;
    
    setLoading(planType);
    try {
      const { data } = await api.createOrder({ planType });

      if (data.success) {
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: "MoneyMatters",
          description: `Upgrade to ${planType} Plan`,
          order_id: data.order_id,
          handler: async function (response) {
            try {
              const res = await api.verifyPayment({
                ...response,
                planType
              });


              if (res.data.success) {
                alert("Payment Successful! Your plan has been upgraded.");
                // Update local user state
                const updatedUser = { ...user, ...res.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (onLogin) onLogin(updatedUser, token);
                window.location.href = '/dashboard';
              }
            } catch (err) {
              console.error("Verification failed", err);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#6366f1",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Order creation failed", err);
      alert(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      type: 'FREE',
      name: 'Starter',
      price: '₹0',
      description: 'Perfect for small teams getting started.',
      features: [
        'Up to 10 Expenses / Month',
        'Basic Receipt Scanning',
        'Standard Email Support',
        'Individual Expense Tracking'
      ],
      icon: Zap,
      color: 'indigo'
    },
    {
      type: 'PRO',
      name: 'Professional',
      price: '₹499',
      period: '/month',
      description: 'Unlock full automation and AI features.',
      features: [
        'Unlimited Expenses',
        'AI Fraud Detection',
        'Batch Receipt Uploads',
        'Advanced Analytics',
        'Priority Support'
      ],
      icon: Crown,
      color: 'violet',
      popular: true
    },
    {
      type: 'ENTERPRISE',
      name: 'Enterprise',
      price: '₹1999',
      period: '/month',
      description: 'The ultimate power for large corporations.',
      features: [
        'Everything in Professional',
        'Multi-Company Support',
        'Custom Approval Flows',
        'Dedicated Account Manager',
        'SLA & Priority Support'
      ],
      icon: Shield,
      color: 'slate'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Simple, Transparent <span className="text-indigo-600">Pricing</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Choose the plan that's right for your business. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.type}
              className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? 'border-indigo-500 shadow-xl shadow-indigo-100' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5">
                  <Star size={10} className="fill-white" /> Most Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-${plan.color}-50 text-${plan.color}-600 flex items-center justify-center`}>
                  <plan.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{plan.type}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={loading || user?.plan === plan.type || (plan.type === 'FREE' && user)}
                onClick={() => handleUpgrade(plan.type)}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  user?.plan === plan.type
                    ? 'bg-emerald-50 text-emerald-600 cursor-default'
                    : plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.type ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : user?.plan === plan.type ? (
                  'Current Plan'
                ) : (
                  <>
                    {plan.type === 'FREE' ? 'Get Started' : 'Upgrade Plan'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 px-4">Trusted by fast-growing startups worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale contrast-125">
            <span className="text-xl font-bold italic tracking-tighter">FINTECH.CO</span>
            <span className="text-xl font-bold tracking-widest">RAZORPAY</span>
            <span className="text-xl font-black">LOGIC_FLOW</span>
            <span className="text-xl font-serif font-bold">MoneyWise</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

