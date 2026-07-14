/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, X, Navigation, ArrowRight, Sparkles, ShoppingBag, Percent, Compass, CreditCard } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_COUPONS } from '../data';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'navigation' | 'product' | 'coupon';
  tabId: string;
  icon: React.ElementType;
  meta?: string;
}

interface SpotlightSearchProps {
  onClose: () => void;
  onChangeTab: (tabId: string) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ onClose, onChangeTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Close on Escape press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle clicking outside the search card
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Define searchable features
  const navigationTargets: SearchResult[] = [
    { id: 'nav-home', title: 'Dashboard & Overview', subtitle: 'View financial score, budget status, and recent savings', category: 'navigation', tabId: 'home', icon: Compass },
    { id: 'nav-pay', title: 'UPI Pay (Simulated Transfer)', subtitle: 'Simulate instant UPI mobile transfers & scan-and-pay', category: 'navigation', tabId: 'pay', icon: CreditCard },
    { id: 'nav-expenses', title: 'Spend & Expenses Log', subtitle: 'Log a new transaction, filter expenses, and analyze spending', category: 'navigation', tabId: 'expenses', icon: CreditCard },
    { id: 'nav-subscriptions', title: 'Subscriptions Manager', subtitle: 'Track monthly recurring charges, OTTs, and cancel unused plans', category: 'navigation', tabId: 'subscriptions', icon: Percent },
    { id: 'nav-spend-check', title: 'AI Spend Check (Budget Guardian)', subtitle: 'Consult Gemini AI before making a purchase to see if you can afford it', category: 'navigation', tabId: 'spend-check', icon: Sparkles },
    { id: 'nav-shop', title: 'Smart Shop & Offers', subtitle: 'Browse curated items, student codes, and alternative products', category: 'navigation', tabId: 'shop', icon: ShoppingBag },
    { id: 'nav-fashion', title: 'College Streetwear Lookbook', subtitle: 'Explore curated student looks, style inspirations, and fits', category: 'navigation', tabId: 'fashion', icon: Compass },
    { id: 'nav-creator-scan', title: 'AI Style Scan (Creator Feed)', subtitle: 'Scan a creator look or item to find budget-friendly local dupes', category: 'navigation', tabId: 'creator-scan', icon: Sparkles },
    { id: 'nav-food', title: 'Food Scout', subtitle: 'Find campus canteen deals, Swiggy hacks, and local cafe suggestions', category: 'navigation', tabId: 'food', icon: Compass },
    { id: 'nav-goals', title: 'Savings Goals Tracker', subtitle: 'Create goal funds for MacBooks, gadgets, or college trips', category: 'navigation', tabId: 'goals', icon: Percent },
    { id: 'nav-learn', title: 'Learn Hub (Smart Academy)', subtitle: 'Read interactive lessons on inflation, compounding, and student tax', category: 'navigation', tabId: 'learn', icon: Compass },
    { id: 'nav-activity', title: 'AI Agent Activity Logs', subtitle: 'View behind-the-scenes logs of your budget guardian AI agent runs', category: 'navigation', tabId: 'activity', icon: Sparkles },
    { id: 'nav-profile', title: 'Profile Settings', subtitle: 'Adjust your college role, monthly allowance, and interest categories', category: 'navigation', tabId: 'profile', icon: Compass },
  ];

  // Convert products and coupons to search results
  const productTargets: SearchResult[] = MOCK_PRODUCTS.map(p => ({
    id: p.id,
    title: p.name,
    subtitle: `Compare prices on ${p.merchantName} (Alternative offers available!)`,
    category: 'product',
    tabId: 'shop',
    icon: ShoppingBag,
    meta: `₹${p.price.toLocaleString('en-IN')}`
  }));

  const couponTargets: SearchResult[] = MOCK_COUPONS.map(c => ({
    id: c.id,
    title: `Coupon Code: ${c.code}`,
    subtitle: `${c.discount} - ${c.reason}`,
    category: 'coupon',
    tabId: 'shop',
    icon: Percent,
    meta: `Match: ${c.aiMatchScore}%`
  }));

  const allTargets = [...navigationTargets, ...productTargets, ...couponTargets];

  // Simple filter based on query
  const filteredResults = query.trim() === '' 
    ? [] 
    : allTargets.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleResultClick = (tabId: string) => {
    onChangeTab(tabId);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-brand-black/75 backdrop-blur-md flex items-start justify-center pt-20 px-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-brand-surface border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, coupons, campus food deals, lookbooks..."
            className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder-gray-500 font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded select-none shrink-0">
            ESC
          </span>
        </div>

        {/* Results Pane */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-none max-h-[50vh]">
          {query.trim() === '' ? (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-[10px] uppercase font-mono tracking-widest text-brand-orange font-bold mb-2">Popular Tools & Shortcuts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navigationTargets.slice(1, 5).map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item.tabId)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-900/40 hover:bg-gray-850 border border-gray-800/60 hover:border-gray-700 text-left transition-all group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-lime/10 border border-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-semibold group-hover:text-brand-lime transition-colors">{item.title}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] uppercase font-mono tracking-widest text-brand-lime font-bold mb-2">Quick Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'UPI simulated pay', id: 'pay' },
                    { label: 'Expenses log', id: 'expenses' },
                    { label: 'OTT subs', id: 'subscriptions' },
                    { label: 'Savings Goals Fund', id: 'goals' },
                    { label: 'Smart Coupons', id: 'shop' },
                    { label: 'Style Scan Dupes', id: 'creator-scan' },
                    { label: 'Swiggy & Campus Food', id: 'food' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleResultClick(cat.id)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 rounded-lg transition-all cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-1">
              {filteredResults.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleResultClick(item.tabId)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-900/80 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        item.category === 'navigation' 
                          ? 'bg-brand-lime/10 text-brand-lime border border-brand-lime/20' 
                          : item.category === 'product'
                          ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                          : 'bg-brand-violet/10 text-brand-violet border border-brand-violet/20'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs font-semibold group-hover:text-brand-lime transition-colors truncate">{item.title}</span>
                          <span className="text-[9px] font-mono text-gray-500 px-1 py-0.2 rounded bg-gray-900 border border-gray-850 uppercase scale-90">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.meta && (
                        <span className="text-xs font-mono font-bold text-brand-lime mr-1 bg-brand-lime/10 px-1.5 py-0.5 rounded border border-brand-lime/15">
                          {item.meta}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <Search className="w-8 h-8 text-gray-600 mx-auto stroke-1 mb-2" />
              <p className="text-white text-xs font-semibold">No results found for "{query}"</p>
              <p className="text-gray-500 text-[10px] mt-1 max-w-xs mx-auto">Try searching for simple words like "pay", "swiggy", "earbuds", "budget", "macbook", or "coupon".</p>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-3 bg-gray-950/40 border-t border-gray-800 text-gray-500 text-[9px] font-mono flex justify-between items-center select-none">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigation</span>
            <span>↵ Select</span>
          </div>
          <span>Press <kbd className="bg-gray-900 border border-gray-800 px-1 py-0.2 rounded text-gray-400">ESC</kbd> to exit</span>
        </div>
      </motion.div>
    </div>
  );
};
