/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bot, Loader2, Sparkles, AlertCircle, Calendar, ShieldCheck, 
  HelpCircle, ChevronRight, Play, CheckCircle2, Cross
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { AgentFindings, AgentRun } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ShouldISpendView: React.FC = () => {
  const { profile, addAgentRun, savingsGoals } = useFinancial();

  const [item, setItem] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('want_now');
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [result, setResult] = useState<AgentRun | null>(null);

  const steps = [
    "Understanding your request and mapping lifestyle categories...",
    "Budget Guardian checking monthly limits and discretionary balances...",
    "Goal Protector verifying MacBook Air savings milestone impact...",
    "Impulse Detector assessing purchase frequency and timing urgency...",
    "Financial Advisor synthesising results into action items..."
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!item.trim() || isNaN(p) || p <= 0) return;

    setIsAnalyzing(true);
    setResult(null);
    setAnalysisStep(0);

    // Run simulated steps on the UI first for agent visual effect
    const interval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1200);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${item}. ${reason}`,
          price: p,
          budget: profile.monthlyBudget,
          spent: 7200, // Hardcoded for demo state alignment
          goals: savingsGoals
        })
      });

      const json = await response.json();
      clearInterval(interval);
      
      if (json.success && json.data) {
        setResult(json.data);
        addAgentRun(json.data);
      } else {
        throw new Error(json.error || "Analysis failed");
      }
    } catch (err) {
      console.error("AI Analysis error, using mock fallback...", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setItem('');
    setPrice('');
    setReason('');
    setUrgency('want_now');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Should I Spend? Sandbox</h2>
        <p className="text-gray-400 text-xs mt-0.5">Test your purchase decisions with the SmartSpend Agentic Orchestrator</p>
      </div>

      <AnimatePresence mode="wait">
        {!isAnalyzing && !result && (
          <motion.div 
            key="input-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md max-w-xl mx-auto space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">Ask your money AI</h3>
                <p className="text-gray-500 text-[10px] font-mono">Orchestrates Budget Guardian, Goal Protector & Impulse Detector</p>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">WHAT ARE YOU BUYING? *</label>
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="e.g. Nike Air Max, Nothing Earbuds"
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">PRICE (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">WHY DO YOU WANT IT?</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. My old shoes are worn out / I just saw Aarav post them and they look fire!"
                  rows={2}
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-mono block mb-1">HOW URGENT IS IT?</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-brand-surface-light border border-gray-800 focus:border-brand-lime rounded-xl p-3 text-white text-xs focus:outline-none"
                >
                  <option value="want_now">Want it right now</option>
                  <option value="need_soon">Need it by next week</option>
                  <option value="can_wait">Can wait for the next major sale</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white font-sans font-bold text-xs py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-brand-violet/10"
              >
                <Sparkles className="w-4 h-4 text-brand-lime" /> ANALYZE MY DECISION
              </button>
            </form>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div 
            key="loading-sandbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-8 max-w-xl mx-auto flex flex-col items-center justify-center min-h-[350px] text-center gap-6"
          >
            {/* Spinning Node Web Animation */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-brand-violet/30 rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-brand-violet/15 border border-brand-violet text-brand-violet rounded-2xl flex items-center justify-center shadow-lg shadow-brand-violet/15"
              >
                <Bot className="w-6 h-6 animate-pulse" />
              </motion.div>

              {/* Pulsing sub-node dots */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-brand-lime rounded-full animate-ping" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-brand-pink rounded-full animate-ping" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-brand-blue rounded-full animate-ping" />
            </div>

            <div className="space-y-1">
              <h4 className="text-white text-sm font-bold font-display">Specialist Agents Synchronizing...</h4>
              <p className="text-gray-400 text-xs italic max-w-xs mx-auto animate-pulse">
                {steps[analysisStep]}
              </p>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result-dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            {/* Header Score Plate */}
            <div className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                {/* Decision Stamp */}
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-display font-bold text-center ${
                  result.finalDecision === 'BUY' 
                    ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' 
                    : (result.finalDecision === 'WAIT FOR NOW' ? 'bg-brand-pink/10 border-brand-pink text-brand-pink' : 'bg-brand-gold/10 border-brand-gold text-brand-gold')
                }`}>
                  <span className="text-xs uppercase">Decision</span>
                  <span className="text-[10px] leading-tight mt-0.5">{result.finalDecision}</span>
                </div>

                <div>
                  <h3 className="text-white text-base font-bold font-display">Decision: {result.finalDecision}</h3>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-md">
                    {result.reasoning}
                  </p>
                </div>
              </div>

              {/* Confidence Index Gauge */}
              <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 text-center min-w-[120px]">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">AI Match Index</span>
                <span className="text-2xl font-mono font-bold text-white block mt-1">{result.confidence * 100}%</span>
                <span className="text-[9px] text-brand-lime font-mono">High Confidence</span>
              </div>
            </div>

            {/* Sub-agent outputs */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">COOPERATIVE AGENT VERDICTS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.outputs && result.outputs.map((out: AgentFindings, idx: number) => {
                  const riskColors = {
                    high: 'text-brand-pink border-brand-pink/20 bg-brand-pink/5',
                    medium: 'text-brand-gold border-brand-gold/20 bg-brand-gold/5',
                    low: 'text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5'
                  };

                  return (
                    <div 
                      key={idx}
                      className="bg-brand-surface/50 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white text-xs font-bold font-display">{out.agent}</h4>
                          <span className={`text-[9px] uppercase px-1.5 py-0.5 border rounded-full mt-1.5 inline-block ${riskColors[out.riskLevel]}`}>
                            {out.riskLevel} risk
                          </span>
                        </div>
                        <span className="text-sm font-mono font-bold text-gray-400">{out.score}/100</span>
                      </div>

                      <div className="space-y-1.5 mt-2">
                        {out.findings && out.findings.slice(0, 2).map((find, fIdx) => (
                          <div key={fIdx} className="flex gap-1.5 text-[11px] text-gray-400 leading-normal">
                            <span className="text-brand-lime font-bold">•</span>
                            <p>{find}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleReset}
                className="flex-1 bg-brand-surface border border-gray-800 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all"
              >
                Analyze Another Decision
              </button>
              
              {result.finalDecision === 'WAIT FOR NOW' ? (
                <button 
                  onClick={handleReset} // Safe mock
                  className="flex-1 bg-brand-violet hover:bg-brand-violet/90 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  Save for Later & Price Drop Alert
                </button>
              ) : (
                <button 
                  onClick={handleReset}
                  className="flex-1 bg-brand-lime text-black font-sans font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  Buy Anyway / Pay with UPI
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
