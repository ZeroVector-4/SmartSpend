/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, Shield, CheckCircle2, ChevronRight, HelpCircle, 
  Bot, Clock, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const AgentActivityView: React.FC = () => {
  const { agentRuns } = useFinancial();

  // Create mock default runs if the user hasn't made any yet
  const defaultRuns = [
    {
      id: "run-pre-1",
      request: "Nike Street Sneakers - Red edition",
      price: 3500,
      workflowType: "Purchase Decision",
      agentsUsed: ["Orchestrator", "Budget Guardian", "Goal Protector", "Impulse Detector", "Financial Advisor"],
      status: "completed",
      startedAt: "2026-07-09T10:00:00",
      completedAt: "2026-07-09T10:00:04",
      finalDecision: "WAIT FOR NOW",
      reasoning: "Your fashion sub-budget cap is almost exhausted for this month. Delaying this purchase keeps your MacBook Air target date completely on track.",
      outputs: [
        {
          agent: "Budget Guardian",
          status: "completed",
          riskLevel: "high",
          score: 30,
          findings: ["Fashion budget spent is ₹1,850 of ₹2,000 allowance."],
          recommendedActions: ["Hold discretionary retail spending until monthly reset."]
        },
        {
          agent: "Goal Protector",
          status: "completed",
          riskLevel: "high",
          score: 45,
          findings: ["MacBook Air fund requires ₹8,583 monthly. Current pace has a deficit."],
          recommendedActions: ["Redirect sneaker funding to MacBook target."]
        }
      ]
    },
    {
      id: "run-pre-2",
      request: "Canteen meal Combo Deals",
      price: 180,
      workflowType: "Simulated Quick Pay",
      agentsUsed: ["Orchestrator", "Budget Guardian"],
      status: "completed",
      startedAt: "2026-07-09T08:30:00",
      completedAt: "2026-07-09T08:30:01",
      finalDecision: "BUY",
      reasoning: "Low-cost essential canteen nutrition fits easily within your daily allowance (₹350 per day). No active goal conflicts detected.",
      outputs: [
        {
          agent: "Budget Guardian",
          status: "completed",
          riskLevel: "low",
          score: 95,
          findings: ["Price is low, fits within daily allowances."],
          recommendedActions: ["Approved to buy."]
        }
      ]
    }
  ];

  const runsToDisplay = agentRuns.length > 0 ? agentRuns : defaultRuns;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Agent Activity Hub</h2>
        <p className="text-gray-400 text-xs mt-0.5">Audit log of decentralized agent reasoning and orchestration timelines</p>
      </div>

      {/* Main Runs List */}
      <div className="space-y-4">
        {runsToDisplay.map((run) => (
          <div 
            key={run.id}
            className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-5 backdrop-blur-md space-y-4"
          >
            {/* Run Header details */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold font-display leading-none">Request: "{run.request}"</h4>
                  <span className="text-[9px] text-gray-500 font-mono block mt-1.5 uppercase">
                    Workflow: {run.workflowType} • ₹{run.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 4s execution
                </span>
                
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  run.finalDecision === 'BUY' 
                    ? 'bg-brand-emerald/15 text-brand-emerald' 
                    : (run.finalDecision === 'WAIT FOR NOW' ? 'bg-brand-pink/15 text-brand-pink' : 'bg-brand-gold/15 text-brand-gold')
                }`}>
                  Verdict: {run.finalDecision}
                </span>
              </div>
            </div>

            {/* Execution timeline block */}
            <div className="space-y-2">
              <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase block">DECENTRALIZED AGENT TELEMETRY</span>
              
              <div className="space-y-2.5 pl-2 border-l-2 border-gray-800">
                {run.outputs && run.outputs.map((out, idx) => {
                  const colors = {
                    high: 'text-brand-pink',
                    medium: 'text-brand-gold',
                    low: 'text-brand-emerald'
                  };

                  return (
                    <div key={idx} className="relative text-xs">
                      {/* Left timeline dot */}
                      <div className="absolute -left-[14px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-violet" />
                      
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-semibold font-display">{out.agent}</strong>
                        <span className="text-gray-500 font-mono text-[9px] uppercase">• Completed</span>
                        <span className={`text-[9px] uppercase font-mono ${colors[out.riskLevel]}`}>
                          ({out.riskLevel} risk)
                        </span>
                      </div>

                      {out.findings && out.findings.map((f, fIdx) => (
                        <p key={fIdx} className="text-gray-400 text-[11px] mt-1 leading-normal pl-3">
                          → {f}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final collated verdict reasoning */}
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-4 text-xs leading-relaxed text-gray-400">
              <span className="text-brand-violet font-mono font-bold text-[10px] uppercase block mb-1">ORCHESTRATOR DECISION SUMMARY</span>
              <p>"{run.reasoning}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
