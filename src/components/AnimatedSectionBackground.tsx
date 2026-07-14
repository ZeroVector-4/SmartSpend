/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AnimatedSectionBackgroundProps {
  type: 'finance' | 'pay' | 'shopping' | 'coupons' | 'fashion' | 'food' | 'goals' | 'ai' | 'community' | 'learn';
  performanceMode?: 'high' | 'balanced' | 'reduced';
}

export const AnimatedSectionBackground: React.FC<AnimatedSectionBackgroundProps> = ({
  type,
  performanceMode = 'balanced'
}) => {
  const reducedMotion = useReducedMotion();

  // Determine item count based on performance mode and screen size
  const particleCount = useMemo(() => {
    if (reducedMotion) return 0;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const base = isMobile ? 6 : 15;
    if (performanceMode === 'reduced') return Math.round(base * 0.3);
    if (performanceMode === 'balanced') return base;
    return Math.round(base * 1.5);
  }, [performanceMode, reducedMotion]);

  // Generate distinct design assets/doodles based on section type
  const { particles, colors, ambientMesh } = useMemo(() => {
    let items: string[] = [];
    let colorsList: string[] = [];
    let meshStyle = "";

    switch (type) {
      case 'finance':
        items = ['₹', '$', '%', '📈', '🪙', '💳', '📊', '💰'];
        colorsList = ['text-brand-emerald', 'text-brand-lime', 'text-brand-gold', 'text-emerald-400'];
        meshStyle = "from-emerald-950/10 via-brand-black to-brand-black";
        break;
      case 'pay':
        items = ['📱', '⚡', '🔒', '⛨', '💸', '₹', '🎯'];
        colorsList = ['text-brand-lime', 'text-emerald-400', 'text-green-500', 'text-brand-emerald'];
        meshStyle = "from-green-950/10 via-brand-black to-brand-black";
        break;
      case 'shopping':
        items = ['🏷️', '🛒', '🛍️', '📦', '%', '💰', '🔥'];
        colorsList = ['text-brand-blue', 'text-cyan-400', 'text-violet-400', 'text-brand-violet'];
        meshStyle = "from-blue-950/15 via-brand-black to-brand-black";
        break;
      case 'coupons':
        items = ['🎟️', '✂️', '🎁', '⚡', '✨', '%', '🎉'];
        colorsList = ['text-brand-violet', 'text-brand-gold', 'text-yellow-400', 'text-pink-500'];
        meshStyle = "from-violet-950/15 via-brand-black to-brand-black";
        break;
      case 'fashion':
        items = ['👕', '👟', '🕶️', '⌚', '👜', '✨', '💖'];
        colorsList = ['text-brand-pink', 'text-brand-violet', 'text-fuchsia-400', 'text-purple-400'];
        meshStyle = "from-pink-950/10 via-violet-950/10 to-brand-black";
        break;
      case 'food':
        items = ['🍕', '🍔', '🍜', '☕', '🍗', '📍', '🍽️', '🌶️'];
        colorsList = ['text-brand-orange', 'text-brand-gold', 'text-red-400', 'text-amber-400'];
        meshStyle = "from-orange-950/10 via-brand-black to-brand-black";
        break;
      case 'goals':
        items = ['🎯', '🏆', '⭐', '🏔️', '⛳', '🚀', '🪙', '🐷'];
        colorsList = ['text-brand-gold', 'text-cyan-400', 'text-yellow-400', 'text-emerald-400'];
        meshStyle = "from-yellow-950/10 via-cyan-950/5 to-brand-black";
        break;
      case 'ai':
        items = ['✦', '✨', '⚝', '⚡', '🧬', '🧠', '❖', '⚙️'];
        colorsList = ['text-brand-lime', 'text-brand-violet', 'text-purple-400', 'text-cyan-400'];
        meshStyle = "from-violet-950/20 via-blue-950/10 to-brand-black";
        break;
      case 'community':
        items = ['💬', '❤️', '🔗', '🤝', '🔥', '✨', '📢'];
        colorsList = ['text-brand-blue', 'text-brand-pink', 'text-violet-400', 'text-pink-400'];
        meshStyle = "from-purple-950/10 via-brand-black to-brand-black";
        break;
      case 'learn':
        items = ['📚', '💡', '🎓', '🪙', '🧮', '❓', '🌟'];
        colorsList = ['text-cyan-400', 'text-brand-emerald', 'text-brand-gold', 'text-emerald-400'];
        meshStyle = "from-cyan-950/10 via-brand-black to-brand-black";
        break;
    }

    const generated = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      char: items[i % items.length],
      color: colorsList[i % colorsList.length],
      size: Math.random() * 20 + (type === 'ai' ? 10 : 16), // size range
      x: Math.random() * 100, // percentage x-axis
      y: Math.random() * 100, // percentage y-axis
      duration: Math.random() * 15 + 15, // seconds for full cycle
      delay: Math.random() * -20 // start immediately at random timeline point
    }));

    return { particles: generated, colors: colorsList, ambientMesh: meshStyle };
  }, [type, particleCount]);

  if (reducedMotion) {
    return (
      <div className={`absolute inset-0 -z-50 bg-gradient-to-b ${ambientMesh} transition-colors duration-1000 overflow-hidden pointer-events-none`}>
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-surface/20 blur-[150px] rounded-full pointer-events-none" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 -z-50 bg-gradient-to-b ${ambientMesh} transition-all duration-1000 overflow-hidden pointer-events-none`}>
      {/* Decorative Gradient Orb */}
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[500px] bg-brand-violet/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[400px] bg-brand-lime/5 rounded-full blur-[100px]"
      />

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute font-display select-none opacity-15 pointer-events-none ${p.color}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, 360],
            opacity: [0.05, 0.25, 0.05]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          {p.char}
        </motion.div>
      ))}
    </div>
  );
};
