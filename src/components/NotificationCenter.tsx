/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Bell, X, Trash2, ShieldAlert, Tag, Trophy, TrendingDown, Clock, Check
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { notifications, markNotificationsAsRead } = useFinancial();

  React.useEffect(() => {
    markNotificationsAsRead();
  }, []);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-brand-surface border-l border-gray-800 text-white shadow-2xl z-50 flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-brand-surface-light">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-lime" />
          <h3 className="font-display font-bold text-sm">Notifications</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const dateStr = new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div 
                key={n.id}
                className="bg-brand-surface-light border border-gray-800 rounded-2xl p-4 space-y-2 relative"
              >
                {!n.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-pink" />
                )}

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                    {n.type === 'alert' && <ShieldAlert className="w-4 h-4 text-brand-pink" />}
                    {n.type === 'price_drop' && <TrendingDown className="w-4 h-4 text-brand-blue" />}
                    {n.type === 'coupon' && <Tag className="w-4 h-4 text-brand-lime" />}
                    {n.type === 'goal' && <Trophy className="w-4 h-4 text-brand-gold" />}
                    {n.type === 'agent' && <ShieldAlert className="w-4 h-4 text-brand-violet" />}
                  </div>

                  <div>
                    <h4 className="text-white text-xs font-bold leading-tight">{n.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      {n.body}
                    </p>
                    <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1 mt-2">
                      <Clock className="w-2.5 h-2.5" /> {dateStr}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Check className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs">No notifications yet. You are completely on track!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-center">
        <button
          onClick={onClose}
          className="w-full bg-brand-lime text-black font-sans font-bold text-xs py-2.5 rounded-xl"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
};
