/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, Unlock, Fingerprint, Delete, RefreshCw, Eye, EyeOff, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { SmartSpendLogo } from './SmartSpendLogo';

interface OwnerAuthProps {
  onAuthenticate: (name: string) => void;
  theme: 'dark' | 'light';
}

export const OwnerAuth: React.FC<OwnerAuthProps> = ({ onAuthenticate, theme }) => {
  const [authStep, setAuthStep] = useState<'name' | 'pin'>('name');
  const [ownerName, setOwnerName] = useState<string>('Prasoon');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const CORRECT_PINS = ['2026', '1122', '1234', '0000'];

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setError(false);
      const newPin = pin + num;
      setPin(newPin);
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(false);
    setPin('');
  };

  // Check PIN when it reaches 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      if (CORRECT_PINS.includes(pin)) {
        triggerSuccess();
      } else {
        // Trigger shake effect
        setError(true);
        // Soft haptic vibration if available
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        // Auto-clear after 600ms
        const t = setTimeout(() => {
          setPin('');
        }, 600);
        return () => clearTimeout(t);
      }
    }
  }, [pin]);

  const triggerSuccess = () => {
    setIsUnlocked(true);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setTimeout(() => {
      onAuthenticate(ownerName.trim() || 'Prasoon');
    }, 800);
  };

  const handleBiometricScan = () => {
    if (isScanning || scanSuccess) return;
    setIsScanning(true);
    setError(false);

    // Simulate futuristic biometric scanner
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setPin('2026'); // auto-fills correct pin
      triggerSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-black p-4 select-none">
      {/* Background visual graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-lime/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-violet/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-brand-surface border border-gray-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        {/* Glow Bar on Top */}
        <div className={`absolute top-0 inset-x-0 h-1.5 transition-colors ${
          isUnlocked ? 'bg-brand-lime' : error ? 'bg-brand-pink' : 'bg-brand-orange'
        }`} />

        <AnimatePresence mode="wait">
          {authStep === 'name' ? (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center space-y-6 py-4"
            >
              {/* SmartSpend Brand Logo */}
              <div className="relative">
                <SmartSpendLogo className="w-20 h-20" glow={true} />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-white text-xl font-bold font-display tracking-tight flex items-center justify-center gap-2">
                  SmartSpend <span className="text-xs bg-brand-lime/10 text-brand-lime border border-brand-lime/20 px-2 py-0.5 rounded-full font-mono font-black uppercase">Verify Owner</span>
                </h2>
                <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Welcome to your secure student budget cockpit. Please enter your name to personalize your dashboard.
                </p>
              </div>

              {/* Owner Name Input */}
              <div className="w-full text-left space-y-1.5 px-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Prasoon"
                  className="w-full bg-gray-900/60 hover:bg-gray-850 focus:bg-gray-950/85 border border-gray-800 focus:border-brand-lime text-sm text-white rounded-xl px-4 py-3 transition-all outline-none placeholder-gray-650 font-sans font-bold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && ownerName.trim()) {
                      setAuthStep('pin');
                    }
                  }}
                />
              </div>

              {/* Continue button */}
              <button
                onClick={() => {
                  if (ownerName.trim()) {
                    setAuthStep('pin');
                  }
                }}
                disabled={!ownerName.trim()}
                className="w-full bg-brand-lime disabled:opacity-40 text-black font-sans font-extrabold text-sm py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-lime/10 cursor-pointer"
              >
                Proceed to PIN Verification <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="pin-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              {/* Back to Name Step */}
              <button
                onClick={() => setAuthStep('name')}
                className="self-start text-[10px] font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Name
              </button>

              {/* Animated Colorful Holographic Glass Lock */}
              <div className="relative group cursor-pointer my-4 select-none">
                {/* 1. Immersive Soft Liquid Cyber-Glow Backdrop */}
                <div className={`absolute -inset-6 rounded-full blur-2xl transition-all duration-1000 opacity-50 ${
                  isUnlocked 
                    ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 scale-110' 
                    : error 
                    ? 'bg-gradient-to-tr from-rose-500 via-red-600 to-orange-500 animate-pulse' 
                    : 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 opacity-30 group-hover:opacity-70 group-hover:scale-105'
                }`} />

                {/* 2. Single Concentric Fine-line Orbiting Ring (Sleek Minimal Tracker) */}
                <div className="absolute inset-0 flex items-center justify-center -m-6 pointer-events-none">
                  <svg 
                    className={`w-28 h-28 absolute transition-all duration-1000 ${
                      isUnlocked ? 'rotate-180 scale-105 opacity-30' : 'animate-[spin_16s_linear_infinite]'
                    }`} 
                    viewBox="0 0 100 100"
                  >
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="44" 
                      stroke={isUnlocked ? '#34D399' : error ? '#F87171' : 'url(#minimalRingGrad)'} 
                      strokeWidth="1" 
                      strokeDasharray="4 8" 
                      fill="none" 
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient id="minimalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="50%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* 3. The Minimalist Glassmorphic Orb Card */}
                <motion.div
                  animate={
                    isUnlocked 
                      ? { scale: [1, 1.15, 0.98], y: [0, -3, 0] } 
                      : error 
                      ? { x: [-6, 6, -5, 5, -2, 2, 0], y: [0, -1, 0] } 
                      : { y: [0, -3, 0] }
                  }
                  transition={{ 
                    duration: isUnlocked ? 0.5 : error ? 0.4 : 4,
                    repeat: isUnlocked || error ? 0 : Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className={`w-20 h-20 rounded-full border flex items-center justify-center relative z-10 backdrop-blur-2xl transition-all duration-500 ${
                    isUnlocked 
                      ? 'bg-slate-950/40 border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]' 
                      : error 
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_25px_rgba(239,68,68,0.25)]' 
                      : 'bg-slate-950/50 border-white/10 group-hover:border-indigo-400/40 shadow-[0_12px_24px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {/* Subtle Inside Reflection Light */}
                  <div className={`absolute inset-0 rounded-full opacity-10 transition-opacity duration-700 bg-gradient-to-tr ${
                    isUnlocked 
                      ? 'from-emerald-400 to-cyan-400' 
                      : error 
                      ? 'from-rose-500 to-orange-400' 
                      : 'from-violet-500 via-fuchsia-500 to-amber-400'
                  }`} />

                  {/* High-Precision Fine-Line Padlock SVG */}
                  <svg className="w-9 h-9 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="minimalLockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isUnlocked ? '#34D399' : error ? '#F87171' : '#818CF8'} />
                        <stop offset="50%" stopColor={isUnlocked ? '#10B981' : error ? '#EF4444' : '#EC4899'} />
                        <stop offset="100%" stopColor={isUnlocked ? '#06B6D4' : error ? '#B91C1C' : '#F59E0B'} />
                      </linearGradient>
                    </defs>

                    {/* Padlock Shackle: Animates Up & Swivels on Success */}
                    <path 
                      d="M 33 45 V 33 C 33 21, 67 21, 67 33 V 45" 
                      stroke="url(#minimalLockGrad)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500 ease-out origin-[67px_33px]"
                      style={{
                        transform: isUnlocked 
                          ? 'translateY(-13px) rotate(-26deg)' 
                          : 'none',
                        opacity: isUnlocked ? 0.9 : 1
                      }}
                    />

                    {/* Padlock Base Body Outline */}
                    <rect 
                      x="23" 
                      y="45" 
                      width="54" 
                      height="40" 
                      rx="8" 
                      stroke="url(#minimalLockGrad)" 
                      strokeWidth="4"
                      fill="none"
                    />

                    {/* Minimalist Keyhole Pin */}
                    <circle 
                      cx="50" 
                      cy="61" 
                      r="3.5" 
                      fill="url(#minimalLockGrad)" 
                    />
                    <path 
                      d="M 50 65 L 50 73" 
                      stroke="url(#minimalLockGrad)" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                    />
                  </svg>

                  {/* Top Gloss Curve Glass Shine */}
                  <div className="absolute top-1 left-2.5 right-2.5 h-3 bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none" />
                </motion.div>

                {/* 4. Ripple Pulse Wave on Hover / Success */}
                <div className={`absolute -inset-3 rounded-full border-2 opacity-0 transition-all duration-1000 ${
                  isUnlocked 
                    ? 'border-emerald-400 opacity-20 scale-120 duration-700' 
                    : error 
                    ? 'border-rose-400 opacity-15 scale-105' 
                    : 'group-hover:opacity-15 group-hover:scale-105 border-indigo-400/50'
                }`} />
              </div>

              <div className="space-y-1">
                <h2 className="text-white text-lg font-bold font-display tracking-tight">
                  Welcome back, <span className="text-brand-lime">{ownerName}</span>!
                </h2>
                <p className="text-gray-400 text-xs max-w-xs mx-auto">
                  Please enter your secure 4-digit PIN to authenticate.
                </p>
              </div>

              {/* Secure Display Dots */}
              <div className="py-2 w-full">
                <motion.div 
                  animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center items-center gap-4 h-12"
                >
                  {[0, 1, 2, 3].map((index) => {
                    const isFilled = pin.length > index;
                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8 }}
                        animate={{ 
                          scale: isFilled ? 1.2 : 1,
                          backgroundColor: isUnlocked 
                            ? '#10B981' 
                            : error 
                            ? '#EF4444' 
                            : isFilled 
                            ? '#10B981' 
                            : 'rgba(31, 41, 55, 0.4)'
                        }}
                        className={`w-4.5 h-4.5 rounded-full border ${
                          isFilled 
                            ? 'border-brand-lime shadow-lg shadow-brand-lime/20' 
                            : 'border-gray-800'
                        } flex items-center justify-center overflow-hidden`}
                      >
                        {isFilled && showPin && (
                          <span className="text-[10px] font-mono font-black text-black">
                            {pin[index]}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
                
                {/* PIN Visibility & Hint */}
                <div className="flex items-center justify-between px-2 text-[10px] font-mono text-gray-500 mt-2">
                  <button 
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPin ? 'Hide Code' : 'Reveal'}</span>
                  </button>

                  <span className="text-brand-orange/60 font-black">
                    Hint: PIN is 2026 or 1122
                  </span>
                </div>
              </div>

              {/* Numeric Touchpad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    disabled={isScanning || isUnlocked}
                    className="h-12 rounded-2xl bg-gray-900/60 hover:bg-gray-850/80 border border-gray-800 text-white font-mono font-bold text-lg flex items-center justify-center transition-all cursor-pointer hover:border-gray-700"
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Clear Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  disabled={isScanning || isUnlocked}
                  className="h-12 rounded-2xl bg-transparent text-gray-500 hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center cursor-pointer"
                >
                  Clear
                </motion.button>

                {/* Zero */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleKeyPress('0')}
                  disabled={isScanning || isUnlocked}
                  className="h-12 rounded-2xl bg-gray-900/60 hover:bg-gray-850/80 border border-gray-800 text-white font-mono font-bold text-lg flex items-center justify-center transition-all cursor-pointer hover:border-gray-700"
                >
                  0
                </motion.button>

                {/* Backspace */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBackspace}
                  disabled={isScanning || isUnlocked}
                  className="h-12 rounded-2xl bg-transparent text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
                  title="Delete last digit"
                >
                  <Delete className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Biometrics Divider */}
              <div className="w-full flex items-center justify-center gap-3 py-1">
                <div className="h-[1px] bg-gray-850/50 flex-1" />
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">or secure scanner</span>
                <div className="h-[1px] bg-gray-850/50 flex-1" />
              </div>

              {/* Biometric Interactive Button */}
              <button
                onClick={handleBiometricScan}
                disabled={isScanning || scanSuccess || isUnlocked}
                className={`w-full py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  scanSuccess 
                    ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' 
                    : isScanning 
                    ? 'bg-brand-orange/5 border-brand-orange/30 text-brand-orange animate-pulse' 
                    : 'bg-gray-900/40 border-gray-800/80 hover:border-brand-lime/30 text-gray-400 hover:text-white'
                }`}
              >
                {isScanning ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Fingerprint className={`w-5 h-5 ${scanSuccess ? 'text-brand-emerald' : 'text-brand-orange'}`} />
                )}
                <span className="text-xs font-sans font-bold tracking-wide">
                  {isScanning 
                    ? 'Scanning Fingerprint...' 
                    : scanSuccess 
                    ? 'Biometrics Verified ✓' 
                    : 'Use Fingerprint Verification'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
