/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Scan, ShieldCheck, HelpCircle, Check, ArrowLeft, ArrowRight,
  AlertTriangle, Loader2, Coins, UserCheck
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ExpenseCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DEMO_MERCHANTS = [
  { id: 'm-1', name: 'College Canteen', upi: 'canteen@okhdfc', category: ExpenseCategory.FOOD },
  { id: 'm-2', name: 'Swiggy Delivery', upi: 'swiggy@okaxis', category: ExpenseCategory.FOOD },
  { id: 'm-3', name: 'ZARA Style Loft', upi: 'zarafashion@okicici', category: ExpenseCategory.FASHION },
  { id: 'm-4', name: 'Local Metro Station', upi: 'metrorecharge@paytm', category: ExpenseCategory.TRANSPORT },
  { id: 'm-5', name: 'Cafe Coffee Day', upi: 'ccd@okaxis', category: ExpenseCategory.FOOD },
  { id: 'm-6', name: 'Campus Book Store', upi: 'bookstore@okhdfc', category: ExpenseCategory.EDUCATION }
];

export const SimulatedPayView: React.FC = () => {
  const { addSimulatedTransaction, expenses, profile } = useFinancial();

  const [step, setStep] = useState<'home' | 'scanner' | 'amount' | 'pin' | 'processing' | 'success'>('home');
  const [selectedMerchant, setSelectedMerchant] = useState<typeof DEMO_MERCHANTS[0] | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [isPrePayAlert, setIsPrePayAlert] = useState<boolean>(false);

  // Trigger pre-payment AI warning
  const handleProceedToPin = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    // Check food delivery limits
    const totalFoodSpent = expenses
      .filter(e => e.category === ExpenseCategory.FOOD)
      .reduce((sum, e) => sum + e.amount, 0);

    if (
      selectedMerchant?.category === ExpenseCategory.FOOD && 
      (totalFoodSpent + parsedAmount > 3500)
    ) {
      setIsPrePayAlert(true);
    } else {
      setStep('pin');
    }
  };

  const handlePayAnyway = () => {
    setIsPrePayAlert(false);
    setStep('pin');
  };

  const handlePinDigit = (digit: string) => {
    if (pinCode.length < 4) {
      const newPin = pinCode + digit;
      setPinCode(newPin);
      if (newPin.length === 4) {
        // Automatically check pin code
        if (newPin === '1234') {
          // Proceed to process
          setStep('processing');
          setTimeout(() => {
            // Success
            if (selectedMerchant) {
              addSimulatedTransaction({
                recipientName: selectedMerchant.name,
                recipientType: 'merchant',
                demoUpiId: selectedMerchant.upi,
                amount: parseFloat(amount),
                note: note || "College Pay Demo",
                category: selectedMerchant.category,
                paymentMode: 'UPI QR',
                riskScore: selectedMerchant.category === ExpenseCategory.FOOD ? 40 : 10,
                agentsTriggered: ['Budget Guardian', 'Impulse Detector']
              });
            }
            setStep('success');
          }, 2000);
        } else {
          setPinError(true);
          setTimeout(() => {
            setPinCode('');
            setPinError(false);
          }, 1000);
        }
      }
    }
  };

  const handleReset = () => {
    setStep('home');
    setSelectedMerchant(null);
    setAmount('');
    setNote('');
    setPinCode('');
  };

  return (
    <div className="max-w-md mx-auto bg-brand-surface border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
      
      {/* Top Banner indicating Simulated Mode */}
      <div className="absolute top-0 left-0 right-0 bg-brand-lime/10 text-brand-lime text-[10px] font-mono text-center py-1 border-b border-brand-lime/20 select-none z-10">
        🛡️ SIMULATED UPI DEMO MODE - NO REAL MONEY INVOLVED
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: HOME */}
        {step === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 pt-6"
          >
            <div>
              <h3 className="font-display font-bold text-lg text-white">SmartSpend Pay</h3>
              <p className="text-gray-400 text-xs mt-0.5">Quickly pay merchants via simulated QR checkout</p>
            </div>

            {/* Highly Stylized QR Code Launcher */}
            <div className="bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between gap-4 relative overflow-hidden group">
              {/* Abstract decorative graphic */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-2 relative z-10 flex-1">
                <span className="text-[9px] bg-brand-lime/10 text-brand-lime border border-brand-lime/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  UPI Instant Portal
                </span>
                <h4 className="font-display font-black text-white text-base">Holographic QR Scanner</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Point at any student merchant, Swiggy code, or canteen stand to instantly assess budgets.
                </p>
                <button 
                  onClick={() => {
                    setStep('scanner');
                  }}
                  className="mt-2 bg-brand-lime hover:bg-brand-lime/90 text-black font-sans font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-brand-lime/10 active:scale-95 cursor-pointer font-bold"
                >
                  <Scan className="w-3.5 h-3.5" /> Launch Live Scanner
                </button>
              </div>

              {/* Styled interactive vector QR preview */}
              <div className="relative shrink-0 select-none">
                <div className="absolute -inset-1.5 rounded-2xl border border-brand-lime/20 opacity-40 blur-[1px] animate-pulse" />
                
                {/* Micro Stylized QR Block */}
                <div className="relative w-24 h-24 bg-gray-950 rounded-xl border border-gray-800 p-2 flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={{ top: ['5%', '95%', '5%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute left-2 right-2 h-0.5 bg-brand-lime shadow-[0_0_6px_rgba(16,185,129,0.8)] z-10"
                  />
                  
                  {/* Styled vector QR blocks */}
                  <svg className="w-full h-full text-white/80" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z M12,12 h6 v6 h-6 z" />
                    <path d="M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z M82,12 h6 v6 h-6 z" />
                    <path d="M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z M12,82 h6 v6 h-6 z" />
                    <path d="M35,10 h5 v5 h-5 z M45,5 h10 v5 h-10 z M40,20 h5 v5 h-5 z" />
                    <path d="M35,35 h15 v5 h-15 z M45,45 h5 v10 h-5 z" />
                    <path d="M55,35 h5 v15 h-5 z M65,40 h10 v5 h-10 z" />
                    <path d="M10,35 h15 v5 h-15 z M15,45 h10 v10 h-10 z" />
                    <path d="M80,35 h15 v5 h-15 z M85,45 h10 v10 h-10 z" />
                    <path d="M35,75 h10 v10 h-10 z M50,75 h15 v5 h-15 z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Select Merchants list */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">SIMULATED CAMPUS MERCHANTS</span>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_MERCHANTS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMerchant(m);
                      setStep('amount');
                    }}
                    className="bg-brand-surface-light hover:border-gray-700/80 p-3 rounded-xl border border-transparent text-left transition-all active:scale-95"
                  >
                    <p className="text-white text-xs font-bold line-clamp-1">{m.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5 line-clamp-1">{m.upi}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/40 p-3.5 rounded-2xl text-[11px] text-gray-400 leading-relaxed border border-gray-800">
              💡 <strong>How it works:</strong> Clicking any merchant simulates scanning a shop QR or typing a UPI code. It performs a background budget leak risk assessment prior to authorization.
            </div>
          </motion.div>
        )}

        {/* STEP 2: SCANNER VIEW */}
        {step === 'scanner' && (
          <motion.div 
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-5 pt-6 flex-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <button 
                onClick={handleReset}
                className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Cancel Scan
              </button>

              <div className="text-center">
                <span className="text-xs text-brand-lime font-mono uppercase tracking-wider block animate-pulse">
                  ● Live Camera Viewfinder
                </span>
                <p className="text-gray-400 text-[11px] mt-1">Tap a merchant below to align and decode their QR sticker</p>
              </div>

              {/* Viewfinder simulation */}
              <div className="relative w-full aspect-video bg-black/90 rounded-2xl border border-gray-800 flex flex-col items-center justify-center overflow-hidden select-none">
                {/* Scanning sweep line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[3px] bg-brand-lime shadow-[0_0_12px_rgba(16,185,129,0.9)] z-20"
                />

                {/* Viewfinder Corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-brand-lime" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-brand-lime" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-brand-lime" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-brand-lime" />

                {/* Grid guidelines overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />

                {/* Centered QR target boundary box */}
                <div className="w-28 h-28 border border-brand-lime/30 rounded-xl relative flex items-center justify-center bg-brand-lime/[0.02]">
                  <Scan className="w-8 h-8 text-brand-lime/60 animate-pulse" />
                </div>
                
                <span className="absolute bottom-3 text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-brand-black/80 px-2 py-0.5 rounded-full border border-gray-800">
                  QR Decryption Engine Active
                </span>
              </div>
            </div>

            {/* Simulated interactive QR stickers representing campus spots */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">
                TAP CAMPUS MERCHANT QR TO SCAN
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {DEMO_MERCHANTS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMerchant(m);
                      setStep('amount');
                    }}
                    className="bg-brand-surface-light border border-gray-800/80 hover:border-brand-lime/40 p-3 rounded-xl text-left transition-all hover:bg-gray-900 group active:scale-95 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-white text-xs font-bold truncate group-hover:text-brand-lime transition-colors">{m.name}</p>
                      <p className="text-[9px] text-gray-500 font-mono truncate mt-0.5">{m.upi}</p>
                    </div>
                    <div className="w-8 h-8 bg-white text-black p-1.5 rounded-lg shrink-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                      {/* Micro QR vector icon */}
                      <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                        <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                        <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                        <rect x="40" y="40" width="20" height="20" />
                        <rect x="70" y="70" width="10" height="10" />
                        <rect x="85" y="85" width="15" height="15" />
                        <rect x="40" y="10" width="10" height="10" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: AMOUNT & NOTE INPUT */}
        {step === 'amount' && selectedMerchant && (
          <motion.div 
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pt-6 flex-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <button 
                onClick={handleReset}
                className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className="text-center">
                <span className="text-xs text-gray-400 font-mono">PAYING TO MERCHANT</span>
                <h4 className="text-white text-lg font-bold font-display mt-0.5">{selectedMerchant.name}</h4>
                <span className="text-xs text-brand-lime font-mono bg-brand-lime/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  {selectedMerchant.upi}
                </span>
              </div>

              {/* Amount Box */}
              <div className="space-y-2 mt-4">
                <div className="bg-brand-surface-light border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-gray-500 font-display font-medium text-2xl">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-right text-3xl font-display font-bold text-white focus:outline-none w-full ml-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    autoFocus
                  />
                </div>

                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What is this purchase for? (e.g. coffee, jeans)"
                  className="w-full bg-transparent border-b border-gray-800 focus:border-brand-lime text-xs text-white p-2 text-center focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* PRE-PAY RISK SHEET OR PROGRESS CONTROL */}
            <div className="space-y-4">
              {isPrePayAlert && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-pink/10 border border-brand-pink/30 p-4 rounded-2xl space-y-3 text-left"
                >
                  <div className="flex items-start gap-2.5 text-brand-pink">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-bold text-sm leading-tight">AI Budget Cap Warning!</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Completing this payment of ₹{amount} will push your monthly Food & Delivery spend beyond your sub-budget cap (₹3,500).
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePayAnyway}
                      className="flex-1 bg-brand-pink/20 hover:bg-brand-pink/30 text-brand-pink font-sans font-bold text-xs py-2 rounded-xl transition-all"
                    >
                      Pay Anyway
                    </button>
                    <button 
                      onClick={() => setIsPrePayAlert(false)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-sans text-xs py-2 rounded-xl transition-all"
                    >
                      Cancel Check
                    </button>
                  </div>
                </motion.div>
              )}

              {!isPrePayAlert && (
                <button
                  disabled={!amount || parseFloat(amount) <= 0}
                  onClick={handleProceedToPin}
                  className="w-full bg-brand-lime disabled:opacity-40 text-black font-sans font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-brand-lime/10"
                >
                  Confirm simulated checkout <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3: SIMULATED PIN INTERFACE */}
        {step === 'pin' && (
          <motion.div 
            key="pin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 pt-6 flex-1 flex flex-col justify-between"
          >
            <div className="text-center space-y-2">
              <span className="text-xs text-gray-400 font-mono">ENTER DEMO PIN</span>
              <div className="flex justify-center gap-4 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pinCode.length > i 
                        ? (pinError ? 'bg-brand-pink border-brand-pink scale-110' : 'bg-brand-lime border-brand-lime scale-110') 
                        : 'border-gray-700'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 font-mono pt-2">
                Simulated Key. Hint: Demo PIN is <strong className="text-brand-lime">1234</strong>
              </p>
            </div>

            {/* Custom Keyboard Pad */}
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'CLR') {
                      setPinCode('');
                    } else {
                      handlePinDigit(key);
                    }
                  }}
                  className="aspect-square bg-brand-surface-light border border-gray-800 hover:border-gray-700/80 rounded-full flex items-center justify-center text-white text-lg font-bold active:bg-gray-800 transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: PROCESSING */}
        {step === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 py-12"
          >
            <Loader2 className="w-12 h-12 text-brand-lime animate-spin" />
            <h4 className="text-white font-display font-bold text-lg">Authorizing UPI payment...</h4>
            <span className="text-xs text-gray-500 font-mono">Running secure smart analysis checks...</span>
          </motion.div>
        )}

        {/* STEP 5: SUCCESS OVERLAY */}
        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 py-6 text-center"
          >
            <div className="w-20 h-20 bg-brand-lime/10 text-brand-lime rounded-full border border-brand-lime/30 flex items-center justify-center shadow-lg shadow-brand-lime/15 animate-bounce">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-display font-bold text-2xl">Payment Successful!</h4>
              <p className="text-3xl font-display font-bold text-brand-lime">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-400">Paid to <strong className="text-white font-medium">{selectedMerchant?.name}</strong></p>
            </div>

            <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-3.5 max-w-sm text-xs text-gray-400 leading-relaxed text-left space-y-1">
              <span className="text-brand-lime font-mono font-bold text-[10px] block">BUDGET GUARDIAN UPDATE</span>
              <p>This transaction has been automatically categorized as <strong className="text-white">{selectedMerchant?.category}</strong> and subtracted from your remaining budget. Keep it up!</p>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-2 bg-gray-800 hover:bg-gray-700/80 text-white font-sans text-sm py-3 rounded-xl transition-all"
            >
              Back to Pay Hub
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
