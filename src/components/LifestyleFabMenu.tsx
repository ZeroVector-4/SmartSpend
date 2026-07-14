/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Shirt, Utensils, X } from 'lucide-react';

interface LifestyleFabMenuProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

export const LifestyleFabMenu: React.FC<LifestyleFabMenuProps> = ({
  currentTab,
  onChangeTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 'shop',
      label: 'Smart Shop',
      icon: ShoppingBag,
      color: 'bg-gradient-to-r from-cyan-500 to-brand-blue text-white shadow-cyan-500/20',
      textColor: 'text-cyan-400',
      activeColor: 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-brand-black',
    },
    {
      id: 'fashion',
      label: 'Fashion Feed',
      icon: Shirt,
      color: 'bg-gradient-to-r from-pink-500 to-brand-pink text-white shadow-pink-500/20',
      textColor: 'text-pink-400',
      activeColor: 'ring-2 ring-brand-pink ring-offset-2 ring-offset-brand-black',
    },
    {
      id: 'food',
      label: 'Food Scout',
      icon: Utensils,
      color: 'bg-gradient-to-r from-orange-500 to-brand-orange text-white shadow-orange-500/20',
      textColor: 'text-orange-400',
      activeColor: 'ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-black',
    },
  ];

  const handleItemClick = (id: string) => {
    onChangeTab(id);
    setIsOpen(false);
  };

  const isLifestyleTabActive = ['shop', 'fashion', 'food'].includes(currentTab);

  return (
    <div 
      id="lifestyle-fab-container"
      className="fixed right-6 z-50 transition-all duration-300 bottom-24 md:bottom-8"
    >
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-center gap-4 mb-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <motion.div
                  key={item.id}
                  id={`fab-item-${item.id}`}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: (menuItems.length - 1 - index) * 0.05 }}
                  className="relative group flex items-center justify-end"
                >
                  {/* Tooltip Label (Desktop) */}
                  <span className="absolute right-14 px-3 py-1.5 rounded-lg bg-brand-surface border border-gray-800 text-xs font-medium text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mr-1 font-sans">
                    {item.label}
                  </span>

                  {/* Circular Button */}
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${item.color} ${isActive ? item.activeColor : ''}`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        id="fab-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative group transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-800 text-white border border-gray-700 shadow-gray-900/40' 
            : isLifestyleTabActive
              ? 'bg-gradient-to-r from-brand-violet to-brand-pink text-white shadow-brand-violet/25 ring-2 ring-brand-violet/50'
              : 'bg-brand-surface text-brand-lime border border-brand-lime/20 shadow-brand-lime/10 hover:border-brand-lime/40'
        }`}
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-lime"></span>
        </span>
        
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Sparkles className={`w-6 h-6 ${isLifestyleTabActive ? 'animate-pulse text-white' : 'text-brand-lime'}`} />
        )}

        {/* Hover label for trigger button */}
        {!isOpen && (
          <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-brand-surface border border-gray-800 text-xs font-medium text-white shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mr-1 font-sans">
            Lifestyle Hub
          </span>
        )}
      </motion.button>
    </div>
  );
};
