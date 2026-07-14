/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { Navigation } from './components/Navigation';
import { AnimatedSectionBackground } from './components/AnimatedSectionBackground';
import { DashboardView } from './components/DashboardView';
import { SimulatedPayView } from './components/SimulatedPayView';
import { ExpensesView } from './components/ExpensesView';
import { ShouldISpendView } from './components/ShouldISpendView';
import { SmartShopView } from './components/SmartShopView';
import { FashionFeedView } from './components/FashionFeedView';
import { CreatorStyleScanView } from './components/CreatorStyleScanView';
import { FoodScoutView } from './components/FoodScoutView';
import { SavingsGoalsView } from './components/SavingsGoalsView';
import { LearnHubView } from './components/LearnHubView';
import { AgentActivityView } from './components/AgentActivityView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { AIAssistantView } from './components/AIAssistantView';
import { ProfileView } from './components/ProfileView';
import { NotificationCenter } from './components/NotificationCenter';
import { CartCenter } from './components/CartCenter';
import { LifestyleFabMenu } from './components/LifestyleFabMenu';
import { SmartSpendLogo } from './components/SmartSpendLogo';
import { OwnerAuth } from './components/OwnerAuth';
import { SpotlightSearch } from './components/SpotlightSearch';
import { Bell, Flame, ShieldAlert, Coins, Sun, Moon, Search, Command, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  
  const { profile, unreadNotificationCount, theme, toggleTheme, cart, updateProfile } = useFinancial();

  // Listen for Cmd+K / Ctrl+K search shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Map activeTab to a valid background type
  const getBackgroundType = (tab: string): 'finance' | 'pay' | 'shopping' | 'coupons' | 'fashion' | 'food' | 'goals' | 'ai' | 'community' | 'learn' => {
    switch (tab) {
      case 'home':
        return 'finance';
      case 'pay':
        return 'pay';
      case 'expenses':
        return 'finance';
      case 'subscriptions':
        return 'finance';
      case 'spend-check':
        return 'ai';
      case 'shop':
        return 'shopping';
      case 'coupons':
        return 'coupons';
      case 'fashion':
        return 'fashion';
      case 'creator-scan':
        return 'fashion';
      case 'food':
        return 'food';
      case 'goals':
        return 'goals';
      case 'learn':
        return 'learn';
      case 'activity':
        return 'ai';
      case 'profile':
      default:
        return 'community';
    }
  };

  // Render active component depending on navigation choice
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardView onNavigate={setActiveTab} />;
      case 'pay':
        return <SimulatedPayView />;
      case 'expenses':
        return <ExpensesView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'spend-check':
        return <ShouldISpendView />;
      case 'shop':
      case 'coupons':
        return <SmartShopView />;
      case 'fashion':
        return <FashionFeedView />;
      case 'creator-scan':
        return <CreatorStyleScanView />;
      case 'food':
        return <FoodScoutView />;
      case 'goals':
        return <SavingsGoalsView />;
      case 'learn':
        return <LearnHubView />;
      case 'activity':
        return <AgentActivityView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <OwnerAuth 
        onAuthenticate={(name) => {
          updateProfile({ name });
          setIsAuthenticated(true);
          sessionStorage.setItem('ss_authenticated', 'true');
        }}
        theme={theme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans flex flex-col md:flex-row relative overflow-hidden pb-20 md:pb-0">
      
      {/* Absolute scrolling aesthetic backgrounds */}
      <AnimatedSectionBackground type={getBackgroundType(activeTab)} />

      {/* Main navigation (Responsive Sidebar / Bottom Menu) */}
      <Navigation 
        currentTab={activeTab} 
        onChangeTab={setActiveTab} 
        onOpenNotifications={() => setShowNotifications(true)} 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Primary content pane container */}
      <div className={`flex-1 flex flex-col min-w-0 z-10 relative transition-all duration-300 ${sidebarCollapsed ? 'md:pl-[104px]' : 'md:pl-[272px]'}`}>
        
        {/* Sticky top navbar */}
        <header className="sticky top-0 bg-brand-black/40 backdrop-blur-md border-b border-gray-800/80 px-3 py-3 sm:px-6 sm:py-4 flex justify-between items-center z-30">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <SmartSpendLogo className="w-8 h-8 sm:w-9 sm:h-9" glow={false} />
            <div>
              <h1 className="text-white text-xs sm:text-sm font-bold font-display tracking-wide leading-none">SmartSpend</h1>
              <span className={`text-[9px] font-mono tracking-wider mt-1 hidden sm:block uppercase font-bold ${
                theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
              }`}>spend smart like a pro</span>
            </div>
          </div>

          {/* User Streak, Theme Switch & Notification bells */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Universal Spotlight Search Button (Single Button) */}
            <button 
              onClick={() => setShowSearch(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-brand-lime transition-all flex items-center justify-center cursor-pointer shrink-0"
              title="Search (Cmd+K)"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-brand-lime transition-all flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-lime" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-violet" />
              )}
            </button>

            {/* Gamified Logging Streak badge */}
            <div className="flex items-center gap-1 bg-brand-lime/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-brand-lime/20 text-brand-lime">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-brand-lime animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold leading-none">{profile.streakDays}d</span>
            </div>

            {/* Notification trigger with glowing pulse badge */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-brand-pink text-white font-mono text-[8px] sm:text-[9px] flex items-center justify-center font-bold border-2 border-brand-black animate-bounce">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Shopping Cart trigger with dynamic count badge */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-brand-lime transition-all flex items-center justify-center cursor-pointer"
              title="Smart Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-lime" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-brand-pink text-white font-mono text-[8px] sm:text-[9px] flex items-center justify-center font-bold border-2 border-brand-black animate-bounce">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Inner Layout Body */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Dynamic Sliding Notifications Tray */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationCenter onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>

      {/* Dynamic Sliding Shopping Cart Tray */}
      <AnimatePresence>
        {showCart && (
          <CartCenter onClose={() => setShowCart(false)} />
        )}
      </AnimatePresence>

      {/* Dynamic Spotlight Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <SpotlightSearch 
            onClose={() => setShowSearch(false)}
            onChangeTab={setActiveTab}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) Menu for Shopping, Fashion and Food */}
      <LifestyleFabMenu currentTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <FinancialProvider>
      <AppContent />
    </FinancialProvider>
  );
}
