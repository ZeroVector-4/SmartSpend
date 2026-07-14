/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, Trophy, Calendar, Plus, Coins, ArrowUpRight, 
  Sparkles, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { SavingsGoal } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const SavingsGoalsView: React.FC = () => {
  const { savingsGoals, addSavingsGoal, addMoneyToGoal, achievements } = useFinancial();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formTarget, setFormTarget] = useState<string>('');
  const [formCategory, setFormCategory] = useState<SavingsGoal['category']>('laptop');
  const [formDate, setFormDate] = useState<string>('');

  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmt = parseFloat(formTarget);
    if (!formTitle.trim() || isNaN(targetAmt) || targetAmt <= 0 || !formDate) return;

    // Estimate monthly cost
    const totalMonths = Math.max(1, Math.round(
      (new Date(formDate).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)
    ));
    const req = Math.round(targetAmt / totalMonths);

    addSavingsGoal({
      title: formTitle,
      targetAmount: targetAmt,
      targetDate: formDate,
      category: formCategory,
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
      requiredMonthly: req
    });

    setFormTitle('');
    setFormTarget('');
    setFormCategory('laptop');
    setFormDate('');
    setIsAdding(false);
  };

  const handleFundGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(fundAmount);
    if (!selectedGoal || isNaN(amt) || amt <= 0) return;

    addMoneyToGoal(selectedGoal.id, amt);
    setFundAmount('');
    setSelectedGoal(null);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Savings Goals</h2>
          <p className="text-gray-400 text-xs mt-0.5">Fund your dreams and track your progress</p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-lime hover:bg-brand-lime/90 text-black font-sans font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-brand-lime/10"
        >
          <Plus className="w-4 h-4" /> Start Saving
        </button>
      </div>

      {/* Adding Goal form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-surface border border-gray-800 rounded-3xl p-6 space-y-4 max-w-lg mx-auto"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-white text-base">New Target Milestone</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white text-xs font-mono">Cancel</button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">GOAL NAME *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. MacBook Air Fund, London Trip"
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs font-mono block mb-1">TARGET AMOUNT (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    placeholder="e.g. 80000"
                    className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs font-mono block mb-1">CATEGORY</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SavingsGoal['category'])}
                    className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                  >
                    <option value="laptop">Laptop / PC</option>
                    <option value="phone">Smartphone</option>
                    <option value="trip">Trip with Friends</option>
                    <option value="education">Education Fees</option>
                    <option value="emergency">Emergency Fund</option>
                    <option value="custom">Custom Milestone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">TARGET DATE *</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-lime text-black font-sans font-bold text-xs py-3 rounded-xl hover:bg-brand-lime/95 transition-all shadow-md shadow-brand-lime/10"
              >
                Launch Milestone Goal
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const ratio = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const daysLeft = Math.max(1, Math.round(
            (new Date(goal.targetDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
          ));

          return (
            <div 
              key={goal.id}
              className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden space-y-4"
            >
              <div className="flex gap-4">
                <img 
                  src={goal.imageUrl} 
                  alt={goal.title} 
                  className="w-16 h-16 rounded-2xl object-cover shrink-0" 
                />
                
                <div className="flex-1">
                  <span className="text-[10px] text-brand-gold font-mono uppercase tracking-wider">{goal.category} target</span>
                  <h3 className="text-white text-sm font-bold font-display mt-0.5">{goal.title}</h3>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-white text-sm font-bold">₹{goal.savedAmount.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 text-xs">/ ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 h-fit rounded ${
                  goal.status === 'completed' ? 'bg-brand-emerald/15 text-brand-emerald' : 'bg-brand-gold/15 text-brand-gold'
                }`}>
                  {goal.status}
                </span>
              </div>

              {/* Progress slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>{ratio}% Saved</span>
                  <span>{daysLeft} days left</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-gold rounded-full"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>

              {/* Required monthly and actions */}
              <div className="flex items-center justify-between border-t border-gray-800/80 pt-3 text-xs">
                {goal.status === 'active' ? (
                  <>
                    <span className="text-gray-400 font-sans">
                      Requires <strong className="text-white">₹{goal.requiredMonthly.toLocaleString('en-IN')}</strong> / month
                    </span>

                    <button 
                      onClick={() => setSelectedGoal(goal)}
                      className="bg-brand-gold/10 hover:bg-brand-gold/25 border border-brand-gold/30 text-brand-gold font-sans font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                    >
                      Fund Goal
                    </button>
                  </>
                ) : (
                  <span className="text-brand-emerald flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Milestone fully achieved!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Funding Modal Popup */}
      <AnimatePresence>
        {selectedGoal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-surface border border-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4"
            >
              <div className="text-center space-y-1">
                <h3 className="text-white font-display font-bold text-base">Add Money to Fund</h3>
                <p className="text-gray-400 text-xs">How much are you saving for "{selectedGoal.title}"?</p>
              </div>

              <form onSubmit={handleFundGoal} className="space-y-4">
                <div className="bg-brand-surface-light border border-gray-800 rounded-2xl p-3 flex items-center">
                  <span className="text-gray-500 font-display font-bold text-lg mr-2">₹</span>
                  <input
                    type="number"
                    required
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="bg-transparent text-white font-mono font-bold text-base focus:outline-none w-full"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-gold text-black font-sans font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Confirm Fund
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedGoal(null)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-sans text-xs py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
