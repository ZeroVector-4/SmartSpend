/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTED_QUERIES = [
  "Where did I waste the most money this month?",
  "How can I save ₹5,000 for my MacBook?",
  "Is buying a ₹3,500 shoe budget-safe now?",
  "Show me my inactive subscriptions leaks."
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const AIAssistantView: React.FC = () => {
  const { expenses, profile } = useFinancial();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: `Hey Prasoon! I'm your SmartSpend Advisor. Ask me anything about your allowance caps, savings targets, or leakages. Try clicking one of the options below to start.` }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          expenses: expenses,
          budget: profile.monthlyBudget
        })
      });

      const json = await response.json();
      if (json.success && json.text) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'bot',
          text: json.text
        }]);
      } else {
        throw new Error("Chat failed");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: "I am having trouble synchronizing with the AI. Your financial database is completely safe, please check back shortly!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-brand-surface border border-gray-800 rounded-3xl overflow-hidden relative">
      
      {/* Bot Header info */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-brand-surface-light">
        <div className="w-9 h-9 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white text-xs font-bold font-display leading-none">SmartSpend Advisor</h3>
          <span className="text-[9px] text-brand-lime font-mono tracking-wider">ACTIVE AGENT</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isBot = m.sender === 'bot';

          return (
            <div 
              key={m.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                isBot ? 'bg-brand-violet text-white' : 'bg-brand-lime text-black'
              }`}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                isBot 
                  ? 'bg-brand-surface-light text-gray-300 border border-gray-800' 
                  : 'bg-brand-lime text-black font-medium'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3 mr-auto">
            <div className="w-7 h-7 rounded-full bg-brand-violet text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-brand-surface-light border border-gray-800 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-brand-violet animate-spin" />
              <span className="text-xs text-gray-500 italic">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion tags list */}
      {messages.length === 1 && !loading && (
        <div className="p-4 border-t border-gray-800/60 bg-brand-surface space-y-2">
          <span className="text-[9px] text-gray-500 font-mono tracking-wider uppercase block">RECOMMENDED QUERIES</span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="bg-brand-surface-light hover:border-gray-700 p-2 border border-gray-800 rounded-xl text-[10px] text-gray-400 text-left transition-all active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel */}
      <div className="p-4 border-t border-gray-800 bg-brand-surface-light flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask about subscriptions, budget limits, shoes fit..."
          className="flex-1 bg-brand-surface border border-gray-800 focus:border-brand-violet rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || loading}
          className="bg-brand-violet disabled:opacity-40 text-white p-2.5 rounded-xl transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
