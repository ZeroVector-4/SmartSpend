/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Trophy, Sparkles, HelpCircle, Check, Play,
  TrendingUp, Award, Zap, ArrowRight, Flame, CheckCircle
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { motion, AnimatePresence } from 'motion/react';

const LESSONS = [
  {
    id: 'l-1',
    title: 'Wants vs Needs ⚖️',
    desc: 'The fundamental law of survival budgets. Essential expenses (Metro, books) must always take first priority over discretionary shopping (trendy hoodies, lattes).',
    duration: '2 min read'
  },
  {
    id: 'l-2',
    title: 'The Subscription Leak Trap 🕸️',
    desc: 'How repeating charges bleed students silently. An unused ₹499 gym or music trial adds up to ₹6,000 annually. Cancel fast!',
    duration: '3 min read'
  },
  {
    id: 'l-3',
    title: 'Online Payment Safeties 🔐',
    desc: 'Never share a UPI PIN on any random web popup. UPI PIN is only for sending money, never for receiving rewards.',
    duration: '2 min read'
  }
];

export const LearnHubView: React.FC = () => {
  const { achievements, incrementStreak, addNotification } = useFinancial();

  const [activeLesson, setActiveLesson] = useState<typeof LESSONS[0] | null>(null);
  
  // Simple Quiz state
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);

  const handleQuizSubmit = (option: string) => {
    setQuizAnswer(option);
    setQuizSubmitted(true);
    if (option === 'want') {
      setQuizCorrect(true);
      incrementStreak();
      addNotification("Trivia Correct! 💡", "+1 Logging Streak days awarded!", "goal");
    } else {
      setQuizCorrect(false);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setQuizCorrect(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Learn & Earn</h2>
        <p className="text-gray-400 text-xs mt-0.5">Learn essential digital financial safety concepts and unlock badges</p>
      </div>

      {/* Grid: Lessons and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Lessons and Trivia */}
        <div className="space-y-6 lg:col-span-8">
          
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">BITE-SIZED MICRO LESSONS</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LESSONS.map((l) => (
                <div 
                  key={l.id}
                  className="bg-brand-surface/70 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between gap-4"
                >
                  <div>
                    <span className="text-[9px] text-brand-lime font-mono block">{l.duration}</span>
                    <h3 className="text-white text-sm font-bold font-display mt-1">{l.title}</h3>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                      {l.desc}
                    </p>
                  </div>

                  <button 
                    onClick={() => setActiveLesson(l)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-sans font-bold py-2 rounded-xl transition-all"
                  >
                    Read Full Lesson
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Trivia Section */}
          <div className="bg-brand-surface/50 border border-gray-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800/60 pb-3">
              <HelpCircle className="w-5 h-5 text-brand-lime" />
              <h3 className="text-white font-display font-bold text-sm">Prudent Quiz Trivia</h3>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-white font-medium leading-relaxed">
                "You have been paying for an active Spotify Student Premium plan of ₹199 monthly. Under standard financial principles, is this considered an essential NEED or a discretionary WANT?"
              </p>

              {!quizSubmitted ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => handleQuizSubmit('need')}
                    className="bg-brand-surface-light border border-gray-800 hover:border-gray-700/80 p-3 rounded-xl text-center text-white font-medium transition-all"
                  >
                    Essential (NEED)
                  </button>
                  <button
                    onClick={() => handleQuizSubmit('want')}
                    className="bg-brand-surface-light border border-gray-800 hover:border-gray-700/80 p-3 rounded-xl text-center text-white font-medium transition-all"
                  >
                    Discretionary (WANT)
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl border ${
                    quizCorrect 
                      ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' 
                      : 'bg-brand-pink/10 border-brand-pink text-brand-pink'
                  }`}
                >
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">{quizCorrect ? "Excellent! Answer Correct" : "Oops, Incorrect Answer"}</h4>
                      <p className="text-gray-300 mt-1 leading-normal">
                        {quizCorrect 
                          ? "Yes! A music streaming sub is classified as a lifestyle 'Want'. Understanding this helps you trim non-essentials during high-leak months to protect your goals." 
                          : "Incorrect. While music is food for the soul, streaming subs are discretionary 'Wants'. Essentials are reserved for housing, transport, or medicine."
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="mt-3 bg-white text-black font-sans font-bold text-[10px] px-3 py-1.5 rounded-lg"
                  >
                    Try again
                  </button>
                </motion.div>
              )}
            </div>
          </div>

        </div>

        {/* Right: Gamified Badges Showcase */}
        <div className="lg:col-span-4 bg-brand-surface border border-gray-800 rounded-3xl p-5 sticky top-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Trophy className="w-5 h-5 text-brand-gold" />
            <h3 className="text-white font-display font-bold text-sm">Gamified Badges</h3>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {achievements.map((ach) => (
              <div 
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  ach.isUnlocked 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-transparent border-gray-800/50 opacity-40'
                }`}
              >
                <span className="text-2xl shrink-0">{ach.icon}</span>
                
                <div>
                  <h4 className="text-white text-xs font-bold font-sans leading-none">{ach.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-normal">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lesson View Modal */}
      <AnimatePresence>
        {activeLesson && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-surface border border-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] text-brand-lime font-mono uppercase tracking-wide">Prudent Lesson Full Read</span>
                <h3 className="text-white font-display font-bold text-base mt-0.5">{activeLesson.title}</h3>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed font-sans">
                {activeLesson.desc} Additionally, managing this means setting weekly caps and keeping a log streak. We suggest setting aside ₹500 immediately upon receiving allowances to build saving discipline.
              </p>

              <button 
                onClick={() => setActiveLesson(null)}
                className="w-full bg-brand-lime text-black font-sans font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Finished Reading
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
