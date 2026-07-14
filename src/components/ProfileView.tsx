/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, Shield, ShieldCheck, HelpCircle, Key, RefreshCw, 
  Trash2, Sliders, Bell, Sparkles, Check
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, expenses, scoreBreakdown } = useFinancial();

  const [name, setName] = useState(profile.name);
  const [budget, setBudget] = useState(profile.monthlyBudget.toString());
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(budget);
    if (!name.trim() || isNaN(b) || b <= 0) return;

    updateProfile({
      name,
      monthlyBudget: b
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all simulated transaction records and restore defaults?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Profile & Preferences</h2>
        <p className="text-gray-400 text-xs mt-0.5">Customize your financial limits and lifestyle settings</p>
      </div>

      <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md space-y-6">
        
        {/* User Card */}
        <div className="flex items-center gap-4 border-b border-gray-800/60 pb-5">
          <div className="w-14 h-14 bg-brand-violet text-white rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-brand-violet/10">
            {profile.name[0]}
          </div>
          <div>
            <h3 className="text-white text-base font-bold font-display">{profile.name}</h3>
            <span className="text-xs text-gray-400 font-mono">{profile.role} • Age {profile.ageRange}</span>
          </div>
        </div>

        {/* Form settings */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-mono block mb-1">DISPLAY NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs font-mono block mb-1">MONTHLY ALLOWANCE / BUDGET (₹)</label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-lime text-black font-sans font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1"
            >
              {success ? <Check className="w-4 h-4 stroke-[3]" /> : "Save Profile Details"}
            </button>
          </div>
        </form>

        {/* Secondary Preferences Info */}
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block">LIFESTYLE INTEREST SEGMENTS</span>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((int, i) => (
              <span key={i} className="bg-gray-900 border border-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-lg font-mono">
                #{int}
              </span>
            ))}
            {profile.spendingAreas.map((area, i) => (
              <span key={i} className="bg-gray-900 border border-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-lg font-mono">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Danger controls */}
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <span className="text-[10px] text-brand-pink font-mono tracking-widest uppercase block">SYSTEM & PRIVACY CONTROLS</span>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleResetData}
              className="flex-1 bg-brand-pink/10 hover:bg-brand-pink/20 border border-brand-pink/30 text-brand-pink text-xs font-sans font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Simulated Database
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
