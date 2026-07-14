/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Calendar, AlertTriangle, Plus, Trash2, ArrowUpRight, 
  CheckCircle, RefreshCw, Zap, PauseCircle, PlayCircle, Sparkles, Sliders, Bell
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { motion, AnimatePresence } from 'motion/react';

interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: 'entertainment' | 'utilities' | 'productivity' | 'lifestyle';
  status: 'active' | 'paused';
  serviceIconUrl?: string; // We can use Lucide icons dynamically
  usageFrequency: 'high' | 'medium' | 'low';
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-1', name: 'Spotify Premium', price: 119, billingCycle: 'monthly', nextBillingDate: '2026-07-15', category: 'entertainment', status: 'active', usageFrequency: 'high' },
  { id: 'sub-2', name: 'Netflix India', price: 499, billingCycle: 'monthly', nextBillingDate: '2026-07-20', category: 'entertainment', status: 'active', usageFrequency: 'low' },
  { id: 'sub-3', name: 'ChatGPT Plus', price: 1999, billingCycle: 'monthly', nextBillingDate: '2026-07-28', category: 'productivity', status: 'active', usageFrequency: 'high' },
  { id: 'sub-4', name: 'Amazon Prime Student', price: 125, billingCycle: 'monthly', nextBillingDate: '2026-08-02', category: 'lifestyle', status: 'active', usageFrequency: 'medium' },
  { id: 'sub-5', name: 'GitHub Copilot', price: 820, billingCycle: 'monthly', nextBillingDate: '2026-07-18', category: 'productivity', status: 'paused', usageFrequency: 'low' },
];

export const SubscriptionsView: React.FC = () => {
  const { addNotification, theme } = useFinancial();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubPrice, setNewSubPrice] = useState('');
  const [newSubCycle, setNewSubCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [newSubCategory, setNewSubCategory] = useState<'entertainment' | 'utilities' | 'productivity' | 'lifestyle'>('entertainment');
  const [newSubDate, setNewSubDate] = useState('2026-07-25');

  // Math totals
  const monthlyTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.price : s.price / 12), 0);

  const pausedSavings = subscriptions
    .filter(s => s.status === 'paused')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.price : s.price / 12), 0);

  const handleToggleStatus = (id: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        const nextStatus = sub.status === 'active' ? 'paused' : 'active';
        addNotification(
          nextStatus === 'paused' ? 'Subscription Paused ⏸️' : 'Subscription Resumed ▶️',
          `Successfully ${nextStatus === 'paused' ? 'paused' : 'resumed'} billing for ${sub.name}.`,
          'alert'
        );
        return { ...sub, status: nextStatus };
      }
      return sub;
    }));
  };

  const handleDelete = (id: string, name: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    addNotification('Subscription Deleted 🗑️', `${name} has been removed from your active trackers.`, 'alert');
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubPrice) return;

    const newSub: Subscription = {
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      name: newSubName,
      price: parseFloat(newSubPrice),
      billingCycle: newSubCycle,
      nextBillingDate: newSubDate,
      category: newSubCategory,
      status: 'active',
      usageFrequency: 'medium'
    };

    setSubscriptions(prev => [...prev, newSub]);
    addNotification('Subscription Logged! 💳', `${newSubName} is now tracked at ₹${newSubPrice}/${newSubCycle}.`, 'goal');
    
    // Clear form
    setNewSubName('');
    setNewSubPrice('');
    setShowAddForm(false);
  };

  // Trigger automated simulation of optimizing subscription (Pause unused premium features)
  const triggerAIOptimization = () => {
    // Look for active & low usage frequency subs (like Netflix)
    const lowUsageSub = subscriptions.find(s => s.status === 'active' && s.usageFrequency === 'low');
    if (lowUsageSub) {
      handleToggleStatus(lowUsageSub.id);
      addNotification(
        'AI Guard Executed ⚡',
        `Budget guardian automatically paused ${lowUsageSub.name} due to ultra-low engagement this month. Savings: ₹${lowUsageSub.price}!`,
        'agent'
      );
    } else {
      addNotification(
        'AI Guard Status ✅',
        `All your active subscriptions are highly utilized. Your budget is structurally perfect!`,
        'agent'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 md:px-0">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-lime" />
            Recurring Subscriptions
          </h2>
          <p className="text-xs text-gray-400 mt-1">Stop the Gen-Z subscription bleed! Track trial periods, billing patterns, and pause items with 1-tap.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-lime text-black rounded-xl font-display font-bold text-xs hover:bg-brand-lime/90 active:scale-95 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Log Subscription
        </button>
      </div>

      {/* Grid of Key Analytics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-surface/40 border border-gray-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime/5 blur-xl rounded-full" />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Monthly Bleed Rate</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-black text-white">₹{Math.round(monthlyTotal)}</span>
            <span className="text-xs text-gray-500 font-mono">/ mo</span>
          </div>
          <p className="text-[10px] text-brand-lime font-mono mt-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-brand-lime" />
            {subscriptions.filter(s => s.status === 'active').length} active billing profiles
          </p>
        </div>

        <div className="bg-brand-surface/40 border border-gray-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 blur-xl rounded-full" />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Paused & Restrained</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-black text-brand-lime">₹{Math.round(pausedSavings)}</span>
            <span className="text-xs text-gray-500 font-mono">/ mo</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-2">
            Paused subscriptions avoiding background leaks
          </p>
        </div>

        {/* AI Action Card */}
        <div className="bg-gradient-to-br from-brand-black/80 to-brand-surface/80 border border-brand-lime/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-lime/10 blur-xl rounded-full" />
          <div>
            <div className="flex items-center gap-1.5 text-brand-lime">
              <Sparkles className="w-4 h-4 fill-brand-lime animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">AI Co-Pilot Optimizer</span>
            </div>
            <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
              Identify subscription overlap & low-usage items instantly to restrict unnecessary outlays.
            </p>
          </div>
          <button
            onClick={triggerAIOptimization}
            className="mt-3 w-full py-2 bg-brand-lime/10 border border-brand-lime/20 text-brand-lime hover:bg-brand-lime text-[10px] font-mono font-bold uppercase rounded-xl transition-all hover:text-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3 h-3 fill-current" />
            Auto-Optimize Spend
          </button>
        </div>
      </div>

      {/* Add subscription modal/form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddSubscription} className="bg-brand-surface/70 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-white">Add New Subscription Track</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spotify, YouTube Premium"
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    className="w-full bg-brand-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Billing Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 199"
                    value={newSubPrice}
                    onChange={e => setNewSubPrice(e.target.value)}
                    className="w-full bg-brand-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Billing Frequency</label>
                  <select
                    value={newSubCycle}
                    onChange={e => setNewSubCycle(e.target.value as 'monthly' | 'yearly')}
                    className="w-full bg-brand-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Category</label>
                  <select
                    value={newSubCategory}
                    onChange={e => setNewSubCategory(e.target.value as any)}
                    className="w-full bg-brand-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                  >
                    <option value="entertainment">Entertainment</option>
                    <option value="productivity">Productivity & Tech</option>
                    <option value="utilities">Utilities & Subs</option>
                    <option value="lifestyle">Lifestyle & Fitness</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Next Billing Date</label>
                  <input
                    type="date"
                    value={newSubDate}
                    onChange={e => setNewSubDate(e.target.value)}
                    className="w-full bg-brand-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-lime text-black font-display font-bold text-xs rounded-xl hover:bg-brand-lime/90 transition-all cursor-pointer"
                  >
                    Confirm Logging
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table / Cards view */}
      <div className="bg-brand-surface/40 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800/80 flex justify-between items-center bg-brand-black/20">
          <h3 className="font-display font-bold text-sm text-white">Active Recurrent Commitments</h3>
          <span className="text-[10px] font-mono text-gray-500">SORTED BY DATE</span>
        </div>

        <div className="divide-y divide-gray-800/60">
          {subscriptions.map(sub => {
            const isActive = sub.status === 'active';
            return (
              <div 
                key={sub.id} 
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                  isActive ? 'bg-transparent' : 'opacity-60 bg-brand-black/15'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    !isActive 
                      ? 'bg-gray-900 border-gray-800 text-gray-500'
                      : sub.category === 'productivity'
                      ? 'bg-brand-violet/15 border-brand-violet/30 text-brand-violet'
                      : sub.category === 'lifestyle'
                      ? 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                      : 'bg-brand-lime/15 border-brand-lime/30 text-brand-lime'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white text-sm font-semibold font-display">{sub.name}</h4>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full capitalize ${
                        sub.usageFrequency === 'high'
                          ? 'bg-brand-lime/10 text-brand-lime'
                          : sub.usageFrequency === 'medium'
                          ? 'bg-brand-violet/10 text-brand-violet'
                          : 'bg-brand-pink/10 text-brand-pink'
                      }`}>
                        {sub.usageFrequency} Usage
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-400">
                      <span className="capitalize">{sub.category}</span>
                      <span className="text-gray-600">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        Billing {new Date(sub.nextBillingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-800/40 pt-3 sm:pt-0">
                  <div className="text-right">
                    <p className="text-white text-sm font-bold font-mono">₹{sub.price}</p>
                    <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">{sub.billingCycle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(sub.id)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                        isActive 
                          ? 'bg-brand-pink/10 border-brand-pink/20 text-brand-pink hover:bg-brand-pink/20' 
                          : 'bg-brand-lime/10 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/20'
                      }`}
                      title={isActive ? "Pause Subscription" : "Activate Subscription"}
                    >
                      {isActive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id, sub.name)}
                      className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-brand-pink/30 text-gray-500 hover:text-brand-pink transition-all flex items-center justify-center cursor-pointer"
                      title="Remove Tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advice Card */}
      <div className="bg-brand-surface/40 border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs font-display">End-of-Month Billing Surge Imminent</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">₹2,498 is scheduled for billing in the next 10 days. Ensure linked bank/UPI accounts hold sufficient balance to avoid failure penal outlays.</p>
          </div>
        </div>
        <button 
          onClick={() => addNotification('Alert Inspected 🔍', 'Ensure balances are maintained. AI will check again.', 'alert')}
          className="px-4 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs font-mono font-bold uppercase rounded-xl transition-all hover:text-white shrink-0 cursor-pointer"
        >
          Acknowledge
        </button>
      </div>

    </div>
  );
};
