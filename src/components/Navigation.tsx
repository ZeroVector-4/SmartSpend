/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Home, Wallet, CreditCard, ShoppingBag, Percent, Shirt, 
  Utensils, Target, BookOpen, Bot, Activity, User, Bell,
  ChevronDown, RefreshCw, Grid, X, Sparkles, TrendingUp, Scan, QrCode,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { motion, AnimatePresence } from 'motion/react';
import { SmartSpendLogo } from './SmartSpendLogo';

interface NavigationProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onOpenNotifications: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentTab, 
  onChangeTab,
  onOpenNotifications,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const { notifications, theme } = useFinancial();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [financeExpanded, setFinanceExpanded] = useState<boolean>(true);
  
  // Mobile overlay state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeOverlayTab, setActiveOverlayTab] = useState<'qr' | 'hubs'>('qr');
  const [mobileActiveShelf, setMobileActiveShelf] = useState<'none' | 'finance' | 'lifestyle'>('none');

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, category: 'core', desc: 'Overview Dashboard' },
    { id: 'pay', label: 'Pay Pro', icon: Wallet, category: 'finance', desc: 'Instant UPI simulator' },
    { id: 'expenses', label: 'Expenses', icon: CreditCard, category: 'finance', desc: 'Spend breakdown' },
    { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw, category: 'finance', desc: 'Manage trial bleed' },
    { id: 'goals', label: 'Savings Goals', icon: Target, category: 'finance', desc: 'Track your dreams' },
    { id: 'learn', label: 'Learn Pro', icon: BookOpen, category: 'finance', desc: 'Smart finances' },
    { id: 'shop', label: 'Smart Shop', icon: ShoppingBag, category: 'utility', desc: 'Affordable shopping' },
    { id: 'coupons', label: 'Coupons', icon: Percent, category: 'utility', desc: 'Deals & codes' },
    { id: 'fashion', label: 'Fashion Feed', icon: Shirt, category: 'utility', desc: 'Outfit inspiration' },
    { id: 'creator-scan', label: 'Creator Style Scan', icon: Scan, category: 'utility', desc: 'AI outfit analysis' },
    { id: 'food', label: 'Food Scout', icon: Utensils, category: 'utility', desc: 'Eat smart' },
    { id: 'spend-check', label: 'Should I Spend?', icon: Bot, category: 'utility', desc: 'AI instant checker' },
    { id: 'activity', label: 'Agent Activity', icon: Activity, category: 'utility', desc: 'AI ledger logs' },
  ];

  const handleTabClick = (tabId: string) => {
    onChangeTab(tabId);
    setMobileMenuOpen(false);
  };

  // Get active menu item details for styling
  const currentItem = menuItems.find(item => item.id === currentTab);

  const getMobileLabel = (id: string, label: string) => {
    switch (id) {
      case 'pay': return 'UPI Pay';
      case 'expenses': return 'Spend';
      case 'subscriptions': return 'Subs';
      case 'goals': return 'Goals';
      case 'learn': return 'Learn';
      case 'shop': return 'Shop';
      case 'coupons': return 'Coupons';
      case 'fashion': return 'Fashion';
      case 'creator-scan': return 'Style Scan';
      case 'food': return 'Food';
      case 'spend-check': return 'AI Check';
      case 'activity': return 'AI Logs';
      default: return label;
    }
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col h-[calc(100vh-2rem)] fixed left-4 top-4 z-40 rounded-[24px] transition-all duration-500 ease-out shadow-[0_15px_40px_rgba(0,0,0,0.55)] ${
        theme === 'light' 
          ? 'bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-gray-200/20 text-gray-800' 
          : 'bg-[#101216]/65 backdrop-blur-xl border border-white/5 text-white shadow-black/60'
      } ${sidebarCollapsed ? 'w-[72px] p-2.5' : 'w-[240px] p-4'}`}>
        {/* Brand Header */}
        <div className={`flex items-center justify-between mb-6 ${sidebarCollapsed ? 'flex-col gap-4' : 'px-2 py-4'}`}>
          <div className="flex items-center gap-3">
            <SmartSpendLogo className="w-10 h-10 shrink-0" />
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="font-display font-bold text-lg leading-none text-white tracking-tight">SmartSpend</h1>
                <span className={`text-[9px] font-mono tracking-wider font-bold block mt-1 ${
                  theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
                }`}>SMART LIVING</span>
              </div>
            )}
          </div>
          
          {/* Simple, small, yet highly visible collapse button */}
          <button 
            id="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm group shrink-0 ${
              theme === 'light'
                ? 'bg-white border-gray-200 hover:border-brand-lime hover:bg-gray-50 text-gray-500 hover:text-gray-900 shadow-gray-200/50'
                : 'bg-gray-950 border-gray-800 hover:border-brand-lime hover:bg-gray-900 text-gray-400 hover:text-white shadow-black/40'
            }`}
            title={sidebarCollapsed ? "Expand Navigation" : "Collapse Navigation"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[1px]" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-[1px]" />
            )}
          </button>
        </div>

        {/* Dynamic Navigation Options */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          
          {/* MAIN DYNAMIC HOME COMPONENT */}
          <div className="space-y-1">
            {menuItems.filter(item => item.id === 'home').map(item => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  onMouseEnter={() => setHoveredTab(item.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`w-full flex items-center rounded-xl font-sans text-sm transition-all duration-300 relative group ${
                    sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-3'
                  } ${
                    active 
                      ? 'bg-brand-lime text-black font-semibold shadow-md shadow-brand-lime/10 z-10' 
                      : 'text-gray-400 hover:text-white z-10'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {!active && hoveredTab === item.id && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-gray-800/40 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    />
                  )}
                  <Icon className="w-5 h-5 shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                  {!sidebarCollapsed && <span className="relative z-10 font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>

          <div className="h-[1px] bg-gray-800/60 my-2" />

          {/* FINANCIAL HUB (The dynamic collapsible central unit requested) */}
          <div>
            {!sidebarCollapsed ? (
              <button
                onClick={() => setFinanceExpanded(!financeExpanded)}
                className="w-full flex items-center justify-between px-3 text-[10px] font-mono uppercase tracking-wider text-brand-lime font-bold hover:text-white transition-colors cursor-pointer select-none mb-2"
              >
                <span>Financial Hub</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${financeExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </button>
            ) : (
              <div className="flex justify-center mb-2">
                <button 
                  onClick={() => setFinanceExpanded(!financeExpanded)}
                  className="p-1.5 rounded-lg bg-brand-lime/10 text-brand-lime border border-brand-lime/20 cursor-pointer hover:bg-brand-lime/20 transition-all"
                  title="Toggle Financial Hub"
                >
                  <Wallet className="w-4 h-4" />
                </button>
              </div>
            )}

            <AnimatePresence initial={false}>
              {financeExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {menuItems.filter(item => item.category === 'finance').map(item => {
                    const Icon = item.icon;
                    const active = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        onMouseEnter={() => setHoveredTab(item.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className={`w-full flex items-center rounded-xl font-sans text-sm transition-all duration-300 relative group ${
                          sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
                        } ${
                          active 
                            ? 'bg-brand-lime text-black font-semibold shadow-md shadow-brand-lime/10 z-10' 
                            : 'text-gray-400 hover:text-white z-10'
                        }`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        {!active && hoveredTab === item.id && (
                          <motion.div
                            layoutId="nav-hover-pill"
                            className="absolute inset-0 bg-gray-800/40 rounded-xl -z-10"
                            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                          />
                        )}
                        <Icon className="w-4.5 h-4.5 shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200" />
                        {!sidebarCollapsed && <span className="relative z-10 font-medium">{item.label}</span>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-[1px] bg-gray-800/60 my-2" />

          {/* UNIFIED COHESIVE UTILITIES (Merged Smart Lifestyle & AI under a single beautiful section) */}
          <div className="space-y-2">
            {!sidebarCollapsed ? (
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block mb-2">Smart Utilities & AI</span>
            ) : (
              <div className="h-[1px] bg-gray-800/40 my-2 mx-1" />
            )}
            <div className="space-y-1">
              {menuItems.filter(item => item.category === 'utility').map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    onMouseEnter={() => setHoveredTab(item.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`w-full flex items-center rounded-xl font-sans text-sm transition-all duration-300 relative group ${
                      sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
                    } ${
                      active 
                        ? 'bg-brand-violet text-white font-semibold shadow-md shadow-brand-violet/20 z-10' 
                        : 'text-gray-400 hover:text-white z-10'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {!active && hoveredTab === item.id && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 bg-gray-800/40 rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                      />
                    )}
                    <Icon className="w-4.5 h-4.5 shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200" />
                    {!sidebarCollapsed && <span className="relative z-10 font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>



        {/* Desktop Footer notifications & profile trigger */}
        <div className={`pt-4 border-t border-gray-800 flex ${sidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between'}`}>
          <button 
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl hover:bg-gray-800/50 transition-all text-gray-400 hover:text-white cursor-pointer"
            title={sidebarCollapsed ? "Notifications" : undefined}
          >
            <Bell className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
            {unreadCount > 0 && (
              <span className={`absolute bg-brand-pink text-white font-mono text-[10px] rounded-full flex items-center justify-center font-bold ${sidebarCollapsed ? '-top-1 -right-1 w-4 h-4' : 'top-1.5 right-1.5 w-5 h-5'}`}>
                {unreadCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => handleTabClick('profile')}
            className={`flex items-center gap-2 text-left p-1.5 rounded-xl hover:bg-gray-800/50 transition-all text-gray-400 hover:text-white cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? "My Space" : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-brand-violet flex items-center justify-center font-display font-bold text-white text-xs shrink-0 hover:scale-105 transition-transform duration-200">
              PR
            </div>
            {!sidebarCollapsed && (
              <div className="hidden lg:block text-xs">
                <p className="font-medium text-white line-clamp-1">Prasoon</p>
                <span className="text-[10px] text-gray-500 font-mono">Demo Mode</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* RE-ENGINEERED MOBILE VERSION UI: FLOATING GLASSMORPHIC DOCK */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <nav className="relative bg-brand-surface/95 backdrop-blur-2xl border border-gray-800/80 rounded-2xl shadow-2xl flex flex-col px-3.5 py-2.5 transition-all duration-300 gap-2 h-auto">
          
          {/* Subtle glowing pulse overlay */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-brand-lime via-transparent to-brand-violet opacity-60" />

          {/* Dynamic Top Shelf Row */}
          <AnimatePresence>
            {mobileActiveShelf !== 'none' && (
              <motion.div
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 8, height: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-0.5">
                  {menuItems
                    .filter(item => 
                      mobileActiveShelf === 'finance' 
                        ? item.category === 'finance' 
                        : item.category === 'utility'
                    )
                    .map(item => {
                      const Icon = item.icon;
                      const active = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider shrink-0 transition-all duration-300 ${
                            active 
                              ? mobileActiveShelf === 'finance'
                                ? 'bg-brand-lime text-black font-black shadow-md shadow-brand-lime/25'
                                : 'bg-brand-violet text-white font-black shadow-md shadow-brand-violet/25'
                              : 'bg-gray-900/80 text-gray-400 border border-gray-800/80 hover:text-white hover:bg-gray-800/50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{getMobileLabel(item.id, item.label)}</span>
                        </button>
                      );
                    })}
                </div>
                <div className="h-[1px] bg-gray-800/50 w-full mt-1.5" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Navigation Row */}
          <div className="flex items-center justify-between w-full h-12">
            {/* Home Button */}
            <button 
              onClick={() => {
                setMobileActiveShelf('none');
                handleTabClick('home');
              }}
              className={`flex-1 flex flex-col items-center justify-center relative py-1 transition-all duration-300 ${
                currentTab === 'home' ? 'text-brand-lime scale-110' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
              {currentTab === 'home' && (
                <span className="absolute bottom-0 w-1.5 h-1.5 bg-brand-lime rounded-full" />
              )}
            </button>

            {/* Finance Hub Toggle */}
            <button 
              onClick={() => {
                setMobileActiveShelf(mobileActiveShelf === 'finance' ? 'none' : 'finance');
              }}
              className={`flex-1 flex flex-col items-center justify-center relative py-1 transition-all duration-300 ${
                mobileActiveShelf === 'finance' ? 'text-brand-lime scale-110' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wallet className="w-5 h-5 stroke-[2.2]" />
              {mobileActiveShelf === 'finance' && (
                <span className="absolute bottom-0 w-1.5 h-1.5 bg-brand-lime rounded-full animate-pulse" />
              )}
            </button>

            {/* Central Action: Scan QR Pay */}
            <div className="flex-1 flex justify-center items-center relative top-0">
              <button 
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setActiveOverlayTab('qr');
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all duration-300 relative border ${
                  theme === 'light'
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg shadow-emerald-600/15 border-emerald-500/10'
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white shadow-lg shadow-emerald-500/25 border-emerald-400/20'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[2.5] text-white rotate-90 transition-transform duration-300" />
                ) : (
                  <Scan className="w-5 h-5 stroke-[2.5] text-white transition-transform duration-300" />
                )}
                {/* Dynamic blinking notification ring */}
                <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-brand-pink rounded-full border ${theme === 'light' ? 'border-emerald-600' : 'border-emerald-500'}`} />
              </button>
            </div>

            {/* Lifestyle Hub Toggle */}
            <button 
              onClick={() => {
                setMobileActiveShelf(mobileActiveShelf === 'lifestyle' ? 'none' : 'lifestyle');
              }}
              className={`flex-1 flex flex-col items-center justify-center relative py-1 transition-all duration-300 ${
                mobileActiveShelf === 'lifestyle' ? 'text-brand-violet scale-110' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {mobileActiveShelf === 'lifestyle' && (
                <span className="absolute bottom-0 w-1.5 h-1.5 bg-brand-violet rounded-full animate-pulse" />
              )}
            </button>

            {/* Ask AI Button */}
            <button 
              onClick={() => {
                setMobileActiveShelf('none');
                handleTabClick('spend-check');
              }}
              className={`flex-1 flex flex-col items-center justify-center relative py-1 transition-all duration-300 ${
                currentTab === 'spend-check' ? 'text-brand-violet scale-110' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bot className="w-5 h-5 stroke-[2.2]" />
              {currentTab === 'spend-check' && (
                <span className="absolute bottom-0 w-1.5 h-1.5 bg-brand-violet rounded-full" />
              )}
            </button>
          </div>

        </nav>
      </div>

      {/* FULL-SCREEN GORGEOUS GLASS OVERLAY TO EXPLORE ALL HUBS */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-2xl p-6 overflow-y-auto flex flex-col justify-between pb-28"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <SmartSpendLogo className="w-9 h-9" />
                  <div>
                    <h2 className="font-display font-black text-white text-base">SmartSpend</h2>
                    <p className="text-[10px] text-brand-orange text-[#FF6B00] font-mono font-bold uppercase">SMART LIVING INDEX</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Tab bar */}
              <div className={`flex p-1 rounded-xl mb-6 relative border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200/80' : 'bg-gray-950 border-gray-900'
              }`}>
                <button
                  onClick={() => setActiveOverlayTab('qr')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-2 transition-all duration-300 relative z-10 ${
                    activeOverlayTab === 'qr'
                      ? 'text-white'
                      : theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5" />
                  Instant QR Pay
                </button>
                <button
                  onClick={() => setActiveOverlayTab('hubs')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-2 transition-all duration-300 relative z-10 ${
                    activeOverlayTab === 'hubs'
                      ? 'text-white'
                      : theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  Explore Hubs
                </button>
                {/* sliding indicator */}
                <motion.div
                  className={`absolute top-1 bottom-1 rounded-lg -z-0 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  initial={false}
                  animate={{
                    left: activeOverlayTab === 'qr' ? '4px' : '50%',
                    right: activeOverlayTab === 'qr' ? '50%' : '4px',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              </div>

              {/* Dynamic Overlay Tab Content */}
              {activeOverlayTab === 'qr' ? (
                <div className="space-y-6">
                  <style>{`
                    @keyframes laser-scan {
                      0% { transform: translateY(0); }
                      50% { transform: translateY(144px); }
                      100% { transform: translateY(0); }
                    }
                    .laser-scanner-line {
                      animation: laser-scan 3.5s ease-in-out infinite;
                    }
                  `}</style>
                  
                  {/* Neon camera scanner animation box */}
                  <div className="relative w-full aspect-video bg-gray-950/60 border border-brand-lime/20 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
                    {/* Corners */}
                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-brand-lime" />
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-brand-lime" />
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-brand-lime" />
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-brand-lime" />

                    {/* Sliding laser line */}
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-brand-lime to-transparent shadow-[0_0_12px_rgba(204,255,0,0.8)] laser-scanner-line" />

                    {/* Dynamic pulse / focus frame */}
                    <div className="text-center p-4">
                      <QrCode className="w-12 h-12 text-brand-lime/40 mx-auto animate-pulse mb-2" />
                      <p className="text-xs font-mono text-gray-400">ALIGN QR CODE TO SCAN</p>
                      <span className="text-[10px] text-gray-600 font-mono mt-1 block">SMART QR DECODER READY</span>
                    </div>
                  </div>

                  {/* Horizontal list of merchants */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">SELECT QUICK SIMULATED MERCHANT</span>
                      <span className="text-[9px] font-mono text-brand-lime bg-brand-lime/10 px-1.5 py-0.5 rounded uppercase font-black font-semibold">TAP TO SCAN</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { name: 'College Canteen', upi: 'canteen@okhdfc', color: 'bg-brand-lime' },
                        { name: 'Swiggy Delivery', upi: 'swiggy@okaxis', color: 'bg-brand-pink' },
                        { name: 'ZARA Style Loft', upi: 'zarafashion@okicici', color: 'bg-brand-violet' },
                        { name: 'Local Metro Station', upi: 'metrorecharge@paytm', color: 'bg-brand-emerald' },
                      ].map((merchant, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            // Close mobile menu and go directly to 'pay' page
                            handleTabClick('pay');
                          }}
                          className="bg-brand-surface-light border border-gray-800/80 hover:border-brand-lime/30 p-3 rounded-xl text-left transition-all duration-200 active:scale-95 group"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-2 h-2 rounded-full ${merchant.color}`} />
                            <p className="text-white text-xs font-bold truncate group-hover:text-brand-lime transition-colors">{merchant.name}</p>
                          </div>
                          <p className="text-[9px] text-gray-500 font-mono truncate">{merchant.upi}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 text-center leading-relaxed font-mono">
                    💡 Instantly simulates pointing your phone camera at a shop's printed UPI QR standee.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 1. FINANCIAL SERVICES HUB */}
                  <div>
                    <h3 className="text-[10px] font-mono text-brand-lime uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5" />
                      Financial Core Services
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {menuItems.filter(item => item.category === 'finance').map(item => {
                        const Icon = item.icon;
                        const active = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 relative overflow-hidden transition-all duration-300 ${
                              active 
                                ? 'bg-brand-lime/10 border-brand-lime/50 text-brand-lime' 
                                : 'bg-brand-surface/40 border-gray-800/60 text-gray-300'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${active ? 'text-brand-lime' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-display font-bold text-xs mt-1 text-white">{item.label}</p>
                              <span className="text-[8px] text-gray-500 font-mono mt-0.5 block truncate leading-none">{item.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. LIFESTYLE & INTELLIGENCE UTILITIES */}
                  <div>
                    <h3 className="text-[10px] font-mono text-brand-violet uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Lifestyle & AI Utilities
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {menuItems.filter(item => item.category === 'utility').map(item => {
                        const Icon = item.icon;
                        const active = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 relative overflow-hidden transition-all duration-300 ${
                              active 
                                ? 'bg-brand-violet/15 border-brand-violet/50 text-brand-violet' 
                                : 'bg-brand-surface/40 border-gray-800/60 text-gray-300'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${active ? 'text-brand-violet' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-display font-bold text-xs mt-1 text-white">{item.label}</p>
                              <span className="text-[8px] text-gray-500 font-mono mt-0.5 block truncate leading-none">{item.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Micro Quick Stats */}
            <div className="bg-brand-surface/30 border border-gray-800/60 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-lime/10 text-brand-lime flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gray-500 block">TOTAL LIVE SERVICES</span>
                  <span className="text-xs text-white font-bold">12 Active Smart Modules</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-brand-lime bg-brand-lime/10 px-2 py-0.5 rounded-full uppercase tracking-wider">SECURE</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
