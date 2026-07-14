/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, TrendingDown, Bell, Zap, Trophy, ShieldAlert, 
  ArrowUpRight, ShoppingCart, Utensils, Compass, Flame, AlertTriangle,
  Search, Plus, Filter, Trash2, CreditCard, ShoppingBag, ArrowDownLeft, Receipt
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ExpenseCategory } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    profile, expenses, scoreBreakdown, streakDays, notifications, deleteExpense, theme
  } = useFinancial();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'need' | 'want'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Calculate current month's expenses
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const remainingBudget = Math.max(0, profile.monthlyBudget - totalSpent);
  const budgetPercentage = Math.min(100, Math.round((totalSpent / profile.monthlyBudget) * 100));

  // Category totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.values(ExpenseCategory).forEach(cat => {
      totals[cat] = 0;
    });

    currentMonthExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    return Object.entries(totals)
      .filter(([_, amt]) => amt > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [currentMonthExpenses]);

  // Chart data (past 7 days)
  const chartData = useMemo(() => {
    const data = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      const dayString = d.toISOString().split('T')[0];

      const dayTotal = expenses
        .filter(e => e.date.startsWith(dayString))
        .reduce((sum, e) => sum + e.amount, 0);

      data.push({
        name: dayName,
        Amount: dayTotal
      });
    }
    return data;
  }, [expenses]);

  const unreadAlert = notifications.filter(n => !n.isRead && n.type === 'agent')[0];

  const filteredTransactions = useMemo(() => {
    return expenses
      .filter(e => {
        const matchesSearch = 
          e.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = 
          filterType === 'all' || 
          e.needOrWant === filterType;

        return matchesSearch && matchesType;
      })
      .slice(0, 6);
  }, [expenses, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
            Yo, {profile.name}! 👋
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back. Let's analyze your college financial pulse.
          </p>
        </div>

        {/* Streak Flame Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 px-4 py-2 rounded-2xl w-fit"
        >
          <Flame className="w-5 h-5 text-brand-orange animate-pulse" />
          <div>
            <span className="text-white text-xs font-bold leading-none block">{streakDays}-Day Streak</span>
            <span className="text-[10px] text-brand-orange font-mono">Prudent Logger</span>
          </div>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budget overview Card */}
        <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">MONTHLY EXPENSES</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-display font-bold text-white">₹{totalSpent.toLocaleString('en-IN')}</h3>
              <span className="text-gray-500 text-sm">of ₹{profile.monthlyBudget.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="my-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{budgetPercentage}% Budget Spent</span>
              <span>₹{remainingBudget.toLocaleString('en-IN')} Left</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  budgetPercentage > 85 ? 'bg-brand-pink' : (budgetPercentage > 65 ? 'bg-brand-gold' : 'bg-brand-lime')
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-brand-lime flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> Normal Pace
            </span>
            <button 
              onClick={() => onNavigate('expenses')}
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              Analyze <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* SmartSpend Score Card */}
        <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">SMARTSPEND SCORE</span>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-4xl font-display font-bold text-white">
                  {scoreBreakdown.score}
                  <span className="text-xs text-gray-500 font-mono">/100</span>
                </h3>
                <span className="text-brand-lime text-xs font-bold font-mono bg-brand-lime/15 px-1.5 py-0.5 rounded-md">+3 today</span>
              </div>
            </div>
            
            {/* Visual Score Circle Ring */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-gray-800 fill-none" strokeWidth="5" />
                <circle cx="32" cy="32" r="28" 
                  className="stroke-brand-lime fill-none" 
                  strokeWidth="5" 
                  strokeDasharray={2 * Math.PI * 28} 
                  strokeDashoffset={2 * Math.PI * 28 * (1 - scoreBreakdown.score / 100)} 
                />
              </svg>
              <span className="absolute text-xs font-display font-bold text-white">{scoreBreakdown.score}</span>
            </div>
          </div>

          <div className="border-t border-gray-800/80 pt-4 mt-2">
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Score: <strong className="text-brand-lime font-bold">Strong</strong>. You got points for staying under transportation limits & consistent logs.
            </p>
          </div>

          <button 
            onClick={() => onNavigate('learn')}
            className="w-full mt-3 bg-brand-surface border border-gray-800 hover:bg-gray-800/40 text-xs text-center py-2 rounded-xl transition-all"
          >
            How to increase score?
          </button>
        </div>

        {/* Dynamic AI Agent Health / Alert Card */}
        <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-violet animate-ping" />
            <span className="text-brand-violet text-xs font-mono uppercase tracking-widest font-bold">Guardian Agent</span>
          </div>

          {unreadAlert ? (
            <div className="space-y-2">
              <div className="flex gap-2 text-brand-pink">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h4 className="font-sans font-bold text-sm leading-tight">{unreadAlert.title}</h4>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {unreadAlert.body}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h4 className="text-white text-sm font-semibold">Your budget is clean 🛡️</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                "Budget Guardian has analyzed 12 transactions over the last 3 days. No critical leakage patterns detected."
              </p>
            </div>
          )}

          <div className="pt-2">
            <button 
              onClick={() => onNavigate('spend-check')}
              className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white font-sans font-medium text-xs py-2.5 rounded-xl transition-all shadow-md shadow-brand-violet/10 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Let AI Analyze a Decision
            </button>
          </div>
        </div>

      </div>

      {/* Smart Lifestyle Hub (Promoted to the Front for quick actions) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-lime animate-pulse" />
          <h3 className="font-display font-bold text-lg text-white">Smart Lifestyle Hub</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('shop')}
            className="bg-brand-surface/50 border border-gray-800 hover:border-brand-blue/50 rounded-2xl p-4 text-left transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-blue/15 text-brand-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h4 className="text-white text-sm font-semibold">Smart Shop</h4>
            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">Price comparisons and bargains</p>
          </button>

          <button 
            onClick={() => onNavigate('fashion')}
            className="bg-brand-surface/50 border border-gray-800 hover:border-brand-pink/50 rounded-2xl p-4 text-left transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-pink/15 text-brand-pink flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-white text-sm font-semibold">Fashion Feed</h4>
            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">Budget style reconstructions</p>
          </button>

          <button 
            onClick={() => onNavigate('food')}
            className="bg-brand-surface/50 border border-gray-800 hover:border-brand-orange/50 rounded-2xl p-4 text-left transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="text-white text-sm font-semibold">Food Scout</h4>
            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">Student eats and local rating analysis</p>
          </button>

          <button 
            onClick={() => onNavigate('goals')}
            className="bg-brand-surface/50 border border-gray-800 hover:border-brand-gold/50 rounded-2xl p-4 text-left transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="text-white text-sm font-semibold">Savings Goals</h4>
            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">MacBook and gadget targets tracker</p>
          </button>
        </div>
      </div>

      {/* Charts & Categorization Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart */}
        <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Weekly Spend Chart</h3>
              <p className="text-gray-400 text-xs mt-0.5">Continuous 7-day spending behavior</p>
            </div>
            <span className={`text-[10px] font-mono px-2 py-1 rounded-md ${theme === 'light' ? 'bg-slate-200/80 text-slate-700 border border-slate-300/40 font-semibold' : 'bg-gray-800/80 text-gray-400'}`}>UPI Payments Mode</span>
          </div>

          <div className="flex-1 min-h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0E121A', borderColor: '#374151', borderRadius: '12px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  itemStyle={{ color: '#CCFF00' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Amount" 
                  stroke="#CCFF00" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#CCFF00', strokeWidth: 2, fill: '#07090D' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md lg:col-span-4 flex flex-col">
          <h3 className="font-display font-bold text-lg text-white mb-1">Categories</h3>
          <p className="text-gray-400 text-xs mb-4">Where your cash goes</p>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[240px] pr-1">
            {categoryTotals.length > 0 ? (
              categoryTotals.map(([cat, amount]) => {
                const totalCategoryBudget = cat === ExpenseCategory.FOOD ? 4000 : 2000;
                const ratio = Math.min(100, Math.round((amount / totalCategoryBudget) * 100));
                
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs text-white">
                      <span className="font-medium">{cat}</span>
                      <span className="font-bold">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          cat === ExpenseCategory.FOOD ? 'bg-brand-pink' : (cat === ExpenseCategory.FASHION ? 'bg-brand-violet' : 'bg-brand-blue')
                        }`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No transactions recorded this month yet!
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate('expenses')}
            className="w-full bg-gray-800 hover:bg-gray-700/80 text-white font-sans text-xs py-2 rounded-xl mt-4 transition-all"
          >
            Manage Category Limits
          </button>
        </div>

      </div>

      {/* SYSTEM LEDGER & TRANSACTION STREAM SLOT */}
      <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <h3 className="font-display font-bold text-lg text-white">System Ledger & Live Stream</h3>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">Real-time authenticated UPI and logger transactions slot</p>
          </div>

          {/* Interactive filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search merchant, category..."
                className="bg-brand-black border border-gray-800 hover:border-gray-700 focus:border-brand-lime/50 text-xs text-white rounded-xl pl-9 pr-4 py-2 w-48 md:w-56 focus:outline-none transition-all"
              />
            </div>

            {/* Need / Want toggle filters */}
            <div className="bg-brand-black border border-gray-800 p-1 rounded-xl flex gap-1">
              {(['all', 'need', 'want'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${
                    filterType === type 
                      ? 'bg-brand-lime text-black font-bold' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Quick Add action button */}
            <button
              onClick={() => onNavigate('expenses')}
              className="bg-brand-lime/10 border border-brand-lime/30 text-brand-lime hover:bg-brand-lime/20 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Log
            </button>
          </div>
        </div>

        {/* Transactions list layout */}
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, idx) => {
                const isExpanded = expandedId === tx.id;
                
                // Determine Category Icon
                let CatIcon = CreditCard;
                let catColorClass = "bg-brand-blue/10 text-brand-blue";
                if (tx.category.toLowerCase().includes('food')) {
                  CatIcon = Utensils;
                  catColorClass = "bg-brand-pink/10 text-brand-pink";
                } else if (tx.category.toLowerCase().includes('fashion') || tx.category.toLowerCase().includes('shop')) {
                  CatIcon = ShoppingBag;
                  catColorClass = "bg-brand-violet/10 text-brand-violet";
                } else if (tx.category.toLowerCase().includes('grocer')) {
                  CatIcon = Receipt;
                  catColorClass = "bg-brand-emerald/10 text-brand-emerald";
                }

                return (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    whileHover={{ x: 3, scale: 1.005 }}
                    className={`border rounded-2xl cursor-pointer transition-all ${
                      isExpanded 
                        ? 'bg-brand-surface-light border-brand-lime/30 shadow-md shadow-brand-lime/5' 
                        : 'bg-brand-surface/40 border-gray-800/80 hover:bg-brand-surface-light/60 hover:border-gray-700'
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                  >
                    {/* Primary Row Summary */}
                    <div className="flex items-center justify-between p-3 sm:p-4 gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3">
                        {/* Technical category icon */}
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${catColorClass}`}>
                          <CatIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white text-xs sm:text-sm font-semibold truncate leading-snug">{tx.merchant}</h4>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                            <span className="text-[9px] sm:text-[10px] bg-brand-black px-1.5 py-0.5 rounded text-gray-400 font-mono truncate max-w-[80px] sm:max-w-none">
                              {tx.category}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-gray-500 font-mono shrink-0">
                              {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Hand values (Amount & Need/Want indicator) */}
                      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        <div className="text-right shrink-0">
                          <p className="text-white text-xs sm:text-sm font-bold font-mono">₹{tx.amount.toLocaleString('en-IN')}</p>
                          <span className={`text-[8px] sm:text-[9px] uppercase tracking-wider font-mono font-bold px-1 sm:px-1.5 py-0.5 rounded block mt-0.5 sm:mt-1 text-center ${
                            tx.needOrWant === 'need' 
                              ? 'bg-brand-emerald/10 text-brand-emerald' 
                              : 'bg-brand-pink/10 text-brand-pink'
                          }`}>
                            {tx.needOrWant}
                          </span>
                        </div>

                        {/* Expand Trigger Icon */}
                        <div className="text-gray-500 hover:text-white p-1 shrink-0">
                          <ArrowDownLeft className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-brand-lime' : '-rotate-45'}`} />
                        </div>

                        {/* Interactive Trash Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExpense(tx.id);
                          }}
                          className="p-1.5 sm:p-2 rounded-xl text-gray-500 hover:text-brand-pink hover:bg-brand-pink/10 transition-all shrink-0"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible drawer */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-gray-800/60 p-4 bg-brand-black/40 rounded-b-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          {/* Left specs list */}
                          <div className="space-y-2 border-r border-gray-800/80 pr-2">
                            <p className="text-gray-500 font-mono text-[10px] uppercase">Transaction Specifications</p>
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-400">Transaction ID:</span>
                              <span className="text-white font-semibold truncate max-w-[120px]">{tx.id}</span>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-400">Payment Mode:</span>
                              <span className="text-white font-semibold">{tx.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-400">Is Recurring:</span>
                              <span className="text-white font-semibold">{tx.isRecurring ? "TRUE" : "FALSE"}</span>
                            </div>
                          </div>

                          {/* Middle: note / descriptions */}
                          <div className="space-y-2 border-r border-gray-800/80 px-2">
                            <p className="text-gray-500 font-mono text-[10px] uppercase">Ledger Memorandum</p>
                            <p className="text-white italic leading-relaxed">
                              "{tx.description || 'No memo logs or comments noted for this transaction.'}"
                            </p>
                            {tx.subcategory && (
                              <p className="text-[10px] text-brand-lime font-mono">
                                Tagged Subcategory: <span className="font-bold underline">{tx.subcategory}</span>
                              </p>
                            )}
                          </div>

                          {/* Right: AI analysis gauge */}
                          <div className="space-y-2">
                            <p className="text-gray-500 font-mono text-[10px] uppercase">AI Copilot Analysis</p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-baseline text-[10px]">
                                <span className="text-gray-400">Waste Probability:</span>
                                <span className={`font-bold font-mono ${
                                  (tx.aiWasteProbability || 0) > 0.4 ? 'text-brand-pink' : 'text-brand-emerald'
                                }`}>
                                  {Math.round((tx.aiWasteProbability || 0.15) * 100)}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    (tx.aiWasteProbability || 0) > 0.4 ? 'bg-brand-pink' : 'bg-brand-emerald'
                                  }`}
                                  style={{ width: `${(tx.aiWasteProbability || 0.15) * 100}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-500 italic leading-snug">
                              {(tx.aiWasteProbability || 0) > 0.4 
                                ? "Critical: High impulsivity score. Recommend holding back next month." 
                                : "Healthy: Excellent budget alignment and high utility index."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-800 rounded-2xl">
                <Receipt className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No transaction matches your system filters.</p>
                <button
                  onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                  className="mt-2 text-xs text-brand-lime underline hover:text-white"
                >
                  Reset Stream Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};
