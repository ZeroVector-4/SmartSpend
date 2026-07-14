/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, X, Trash2, Plus, Minus, CreditCard, Sparkles, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { motion, AnimatePresence } from 'motion/react';
import { ExpenseCategory } from '../types';

interface CartCenterProps {
  onClose: () => void;
}

export const CartCenter: React.FC<CartCenterProps> = ({ onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    addSimulatedTransaction,
    profile,
    addNotification
  } = useFinancial();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'analysis' | 'success'>('cart');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'gpay' | 'card' | 'savings'>('gpay');

  // Calculations
  const totalOriginalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDealPrice = cart.reduce((sum, item) => sum + item.dealPrice * item.quantity, 0);
  const totalSavings = totalOriginalPrice - totalDealPrice;
  const savingsPercent = totalOriginalPrice > 0 ? Math.round((totalSavings / totalOriginalPrice) * 100) : 0;

  // Budget remaining after checkout
  const currentMonthExpenses = 0; // standard mock for calculations
  const remainingBudget = profile.monthlyBudget - totalDealPrice;
  const isOverBudget = totalDealPrice > profile.monthlyBudget;

  const handleCheckout = () => {
    // Proceed to Budget Guardian analysis screen
    setCheckoutStep('analysis');
  };

  const handleConfirmPurchase = () => {
    // Complete transaction
    const totalAmount = totalDealPrice;
    
    // Add transaction to ledger
    addSimulatedTransaction({
      amount: totalAmount,
      recipientName: cart.length === 1 ? cart[0].name : `${cart[0].name} & ${cart.length - 1} other items`,
      recipientType: 'merchant',
      category: ExpenseCategory.FASHION,
      paymentMode: selectedPaymentMode === 'gpay' ? 'UPI' : selectedPaymentMode === 'card' ? 'CARD' : 'SAVINGS_FUND',
      note: `Checkout from smart lifestyle cart. Total saved: ₹${totalSavings.toLocaleString('en-IN')}`,
    });

    addNotification(
      "Purchase Completed! 🎉",
      `Spent ₹${totalAmount.toLocaleString('en-IN')} on lifestyle smart deals. Saved ₹${totalSavings.toLocaleString('en-IN')} compared to original brand prices!`,
      "community"
    );

    setCheckoutStep('success');
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  const getSectionBadgeClass = (section: string) => {
    switch (section.toLowerCase()) {
      case 'smart shop':
        return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
      case 'fashion feed':
        return 'bg-brand-pink/10 text-brand-pink border-brand-pink/20';
      case 'creator style scan':
        return 'bg-brand-violet/10 text-brand-violet border-brand-violet/20';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700/60';
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-brand-surface border-l border-gray-800 text-white shadow-2xl z-50 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-brand-surface/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-brand-lime" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-brand-pink text-white rounded-full text-[8px] font-bold flex items-center justify-center font-mono">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">Smart Lifestyle Cart</h3>
            <span className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">Your budget-friendly picks</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-850 border border-transparent hover:border-gray-800 transition-all text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {checkoutStep === 'cart' && (
          <>
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-gray-950/40 border border-gray-800/80 rounded-2xl p-3 flex gap-3 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden shrink-0">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[8px] text-gray-500 font-mono uppercase truncate block">{item.brand}</span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${getSectionBadgeClass(item.fromSection)}`}>
                            {item.fromSection}
                          </span>
                        </div>
                        <h4 className="text-white text-xs font-bold leading-tight mt-0.5 truncate pr-4">{item.name}</h4>
                      </div>

                      {/* Pricing and Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-brand-lime font-mono text-xs font-extrabold">₹{item.dealPrice.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] text-gray-500 line-through font-mono">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Qty Box */}
                        <div className="flex items-center border border-gray-800 bg-gray-900 rounded-lg p-0.5">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono px-2 font-bold min-w-[16px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 p-1 rounded hover:bg-gray-850 border border-transparent hover:border-gray-850 transition-colors text-gray-500 hover:text-brand-pink"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Savings Callout */}
                <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-2xl p-3.5 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-brand-lime font-black font-display text-sm">Smart Choice! 🎉</p>
                    <p className="text-gray-400 text-[10px]">You are purchasing smart alternatives over overpriced retail rates.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 font-mono block">SAVED AT LEAST</span>
                    <span className="text-brand-lime font-mono font-black text-base">{savingsPercent}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 space-y-3">
                <ShoppingBag className="w-10 h-10 text-gray-800 mx-auto" />
                <p className="text-sm font-medium text-gray-400">Your cart is empty</p>
                <p className="text-[11px] max-w-xs mx-auto text-gray-500">
                  Explore Smart Shop, Fashion Feed or Creator Style Scan and tap the shopping cart buttons to add premium-style replicas or deals to your cart.
                </p>
              </div>
            )}
          </>
        )}

        {checkoutStep === 'analysis' && (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* AI Budget Guardian Plate */}
            <div className="bg-gray-950/60 border border-gray-800 rounded-3xl p-5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-violet/5 blur-xl rounded-full" />
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <Sparkles className="w-5 h-5 text-brand-violet animate-pulse" />
                <h4 className="text-white font-display font-bold text-sm">AI Budget Impact Report</h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items Total:</span>
                  <span className="font-bold text-white font-mono">₹{totalDealPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-400">Equivalent Brand Cost:</span>
                  <span className="text-gray-500 line-through font-mono">₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-brand-lime font-bold text-sm pt-1">
                  <span>Smart Choice Savings:</span>
                  <span className="font-mono">Save ₹{totalSavings.toLocaleString('en-IN')}!</span>
                </div>
              </div>

              {isOverBudget ? (
                <div className="bg-brand-pink/10 border border-brand-pink/20 rounded-2xl p-3 flex gap-2.5 items-start text-brand-pink">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Over Your Monthly Budget</p>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      This purchase of ₹{totalDealPrice.toLocaleString('en-IN')} exceeds your remaining monthly allowance of ₹{profile.monthlyBudget.toLocaleString('en-IN')}. Consider buying only high-need items now.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-2xl p-3 flex gap-2.5 items-start text-brand-lime">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Budget Guardian Approved</p>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Excellent choice! This purchase perfectly fits into your remaining allowance of ₹{profile.monthlyBudget.toLocaleString('en-IN')}. Your active savings goals remain fully protected.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Payment Modes */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Select Simulator Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gpay', name: 'GPay UPI', desc: 'Instant sim' },
                  { id: 'card', name: 'Credit Card', desc: 'Postpaid sim' },
                  { id: 'savings', name: 'Savings fund', desc: 'From goals' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedPaymentMode(mode.id as any)}
                    className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                      selectedPaymentMode === mode.id
                        ? 'bg-brand-lime/20 border-brand-lime text-white'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <p className="font-bold text-[11px] truncate">{mode.name}</p>
                    <span className="text-[8px] text-gray-500 block mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="text-center py-24 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-brand-lime/20 border border-brand-lime/30 text-brand-lime rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-lime/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-display font-bold text-base">Purchase Logged to Ledger!</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Your smart checkout transaction has been simulated, logged into your expense logs and ledger cleanly!
              </p>
            </div>
            <div className="bg-gray-950/40 border border-gray-800 rounded-2xl p-4 max-w-xs mx-auto text-left text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-bold text-white font-mono">₹{totalDealPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Savings Retained:</span>
                <span className="font-bold text-brand-lime font-mono">₹{totalSavings.toLocaleString('en-IN')} ({savingsPercent}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-bold text-brand-lime uppercase font-mono">Success</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/30">
        {checkoutStep === 'cart' && (
          <div className="space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Total Items value:</span>
                <span className="font-mono text-white">₹{totalDealPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brand-pink font-bold border-t border-gray-800/80 pt-1.5 text-[13px]">
                <span>Total Savings:</span>
                <span>Saved ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="px-3 border border-gray-800 hover:border-gray-700 hover:bg-gray-900 rounded-xl transition-all text-gray-400 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
                title="Clear entire cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="flex-1 bg-brand-lime hover:bg-brand-lime/90 disabled:opacity-40 text-black font-sans font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" /> Secure Smart Checkout
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'analysis' && (
          <div className="flex gap-2">
            <button
              onClick={() => setCheckoutStep('cart')}
              className="px-4 py-3 border border-gray-800 hover:border-gray-700 hover:bg-gray-900 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all shrink-0"
            >
              Back
            </button>
            <button
              onClick={handleConfirmPurchase}
              className="flex-1 bg-brand-lime hover:bg-brand-lime/90 text-black font-sans font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              Confirm Simulated Buy & Log
            </button>
          </div>
        )}

        {checkoutStep === 'success' && (
          <button
            onClick={onClose}
            className="w-full bg-brand-lime text-black font-sans font-bold text-xs py-3 rounded-xl hover:bg-brand-lime/90 transition-all"
          >
            Close Panel
          </button>
        )}
      </div>
    </motion.div>
  );
};
