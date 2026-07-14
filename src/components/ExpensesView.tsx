/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Trash2, Calendar, DollarSign, Tag, 
  HelpCircle, Laugh, AlertCircle, ShoppingBag, Grid
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ExpenseCategory, Expense } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useFinancial();

  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [needWantFilter, setNeedWantFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Form State
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formAmount, setFormAmount] = useState<string>('');
  const [formMerchant, setFormMerchant] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [formDesc, setFormDesc] = useState<string>('');
  const [formNeedOrWant, setFormNeedOrWant] = useState<'need' | 'want'>('want');
  const [formMood, setFormMood] = useState<string>('Satisfied');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => {
        const matchesSearch = e.merchant.toLowerCase().includes(search.toLowerCase()) || 
                              e.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
        const matchesNeedWant = needWantFilter === 'all' || e.needOrWant === needWantFilter;
        return matchesSearch && matchesCategory && matchesNeedWant;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') return b.amount - a.amount;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [expenses, search, categoryFilter, needWantFilter, sortBy]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (isNaN(amt) || amt <= 0 || !formMerchant.trim()) return;

    addExpense({
      amount: amt,
      merchant: formMerchant,
      category: formCategory,
      subcategory: "Manual entry",
      description: formDesc || "Logged manually",
      paymentMethod: "UPI QR",
      needOrWant: formNeedOrWant,
      purchaseMood: formMood,
      isRecurring: false,
      date: new Date().toISOString()
    });

    // Reset Form
    setFormAmount('');
    setFormMerchant('');
    setFormCategory(ExpenseCategory.FOOD);
    setFormDesc('');
    setFormNeedOrWant('want');
    setFormMood('Satisfied');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Expense Tracker</h2>
          <p className="text-gray-400 text-xs mt-0.5">Control leaks and log your lifestyle purchases</p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-lime hover:bg-brand-lime/90 text-black font-sans font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-brand-lime/10"
        >
          <Plus className="w-4 h-4" /> Log Purchase
        </button>
      </div>

      {/* Adding Form Dialog */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-brand-surface border border-gray-800 rounded-3xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-white text-base">New Manual Entry</h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">AMOUNT (₹) *</label>
                <input
                  type="number"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">STORE / MERCHANT *</label>
                <input
                  type="text"
                  required
                  value={formMerchant}
                  onChange={(e) => setFormMerchant(e.target.value)}
                  placeholder="e.g. Swiggy, H&M"
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">CATEGORY</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-sm focus:outline-none"
                >
                  {Object.values(ExpenseCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">PURCHASE INTENT</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormNeedOrWant('need')}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                      formNeedOrWant === 'need' 
                        ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' 
                        : 'bg-brand-surface-light border-gray-800 text-gray-400'
                    }`}
                  >
                    Essential (Need)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormNeedOrWant('want')}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                      formNeedOrWant === 'want' 
                        ? 'bg-brand-pink/10 border-brand-pink text-brand-pink' 
                        : 'bg-brand-surface-light border-gray-800 text-gray-400'
                    }`}
                  >
                    Lifestyle (Want)
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-xs font-mono block mb-1">SHORT DESCRIPTION</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="What was this? e.g. birthday gift, coffee break"
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-brand-lime text-black font-sans font-bold text-xs px-6 py-3 rounded-xl hover:bg-brand-lime/95 transition-all shadow-md shadow-brand-lime/10"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Box */}
      <div className="bg-brand-surface/70 border border-gray-800 rounded-2xl p-4 backdrop-blur-md grid grid-cols-1 sm:grid-cols-4 gap-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores..."
            className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-brand-surface-light border border-gray-800 text-gray-400 text-xs rounded-xl p-2.5 focus:outline-none focus:border-brand-lime"
        >
          <option value="all">All Categories</option>
          {Object.values(ExpenseCategory).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Need vs Want filter */}
        <select
          value={needWantFilter}
          onChange={(e) => setNeedWantFilter(e.target.value)}
          className="bg-brand-surface-light border border-gray-800 text-gray-400 text-xs rounded-xl p-2.5 focus:outline-none focus:border-brand-lime"
        >
          <option value="all">All Intents</option>
          <option value="need">Needs (Essentials)</option>
          <option value="want">Wants (Lifestyles)</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
          className="bg-brand-surface-light border border-gray-800 text-gray-400 text-xs rounded-xl p-2.5 focus:outline-none focus:border-brand-lime"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

      </div>

      {/* Expenses Table/List */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline px-2">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            LOGGED ITEMS ({filteredExpenses.length})
          </span>
          <span className="text-xs text-gray-400">
            Total matching: <strong className="text-white">₹{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('en-IN')}</strong>
          </span>
        </div>

        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => {
                const isWant = expense.needOrWant === 'want';
                const dateObj = new Date(expense.date);
                const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

                return (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-brand-surface/50 border border-gray-800 hover:border-gray-700/80 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {/* Category Icon tag */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isWant ? 'bg-brand-pink/10 text-brand-pink' : 'bg-brand-emerald/10 text-brand-emerald'
                      }`}>
                        {expense.category[0]}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-xs font-bold leading-none">{expense.merchant}</h4>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            isWant ? 'bg-brand-pink/15 text-brand-pink' : 'bg-brand-emerald/15 text-brand-emerald'
                          }`}>
                            {expense.needOrWant}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{expense.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-white text-xs font-bold font-mono">₹{expense.amount.toLocaleString('en-IN')}</p>
                        <span className="text-[9px] text-gray-500 font-mono block mt-1">{formattedDate}</span>
                      </div>

                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-gray-600 hover:text-brand-pink p-1.5 rounded-lg hover:bg-gray-800/40 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-gray-900/10 border border-dashed border-gray-800 rounded-3xl">
                <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No transactions match your search filter.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
