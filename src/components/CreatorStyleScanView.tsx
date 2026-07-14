/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Share2, Sparkles, Wand2,
  Tag, HelpCircle, CheckCircle, Loader2, ArrowRight
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { MOCK_FASHION_POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const CreatorStyleScanView: React.FC = () => {
  const { unlockAchievement, addToCart } = useFinancial();

  const [posts, setPosts] = useState(MOCK_FASHION_POSTS);
  const [scanningPostId, setScanningPostId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    postId: string;
    style: string;
    items: { name: string; originalPrice: number; dealPrice: number; source: string; image: string }[];
    savings: number;
    totalBudget: number;
    totalOriginal: number;
  } | null>(null);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } 
        : p
    ));
  };

  const handleAnalyzeLook = (postId: string) => {
    setScanningPostId(postId);
    setAnalysisResult(null);

    // AI Analysis simulation
    setTimeout(() => {
      setScanningPostId(null);
      
      if (postId === 'f-1') {
        setAnalysisResult({
          postId,
          style: "High-Contrast Relaxed Streetwear",
          items: [
            { name: "Fleece Essentials Hoodie", originalPrice: 6500, dealPrice: 2100, source: "Ajio Club", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=150" },
            { name: "Straight Cargo Trousers", originalPrice: 4800, dealPrice: 1200, source: "Zara Outlet", image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=150" },
            { name: "Air Jordan Retro Red", originalPrice: 16995, dealPrice: 11999, source: "Myntra Hype", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150" }
          ],
          totalOriginal: 28295,
          totalBudget: 15299,
          savings: 12996
        });
      } else {
        setAnalysisResult({
          postId,
          style: "Classic Thrift Denim & Leather Accent",
          items: [
            { name: "Oversized Utility Denim Jacket", originalPrice: 12500, dealPrice: 1850, source: "ThriftFinds IN", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=150" },
            { name: "Ribbed Vintage Crop Knit", originalPrice: 14500, dealPrice: 1899, source: "H&M Trend", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=150" },
            { name: "Chelsea Quad Retro Boots", originalPrice: 18000, dealPrice: 8999, source: "Ajio Luxe", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=150" }
          ],
          totalOriginal: 45000,
          totalBudget: 12748,
          savings: 32252
        });
      }
      unlockAchievement("ach-5");
    }, 2800);
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-brand-pink/10 text-brand-pink px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
            ● AI MULTIMODAL SCANNER
          </span>
        </div>
        <h2 className="font-display font-bold text-2xl text-white mt-2">Creator Style Scan</h2>
        <p className="text-gray-400 text-xs mt-0.5 font-sans">
          Scan social creator outfits instantly. Our AI parses high-fashion imagery to retrieve budget-friendly thrift store and online equivalents.
        </p>
      </div>

      {/* Main post and analysis layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Posts feed */}
        <div className="space-y-6 lg:col-span-7">
          {posts.map((p) => {
            const isScanning = scanningPostId === p.id;
            const isAnalyzed = analysisResult?.postId === p.id;

            return (
              <div 
                key={p.id}
                className="bg-brand-surface border border-gray-800/80 hover:border-gray-700/60 rounded-3xl overflow-hidden shadow-xl transition-colors group"
              >
                {/* Creator header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.avatar} 
                      alt={p.creatorName} 
                      className="w-9 h-9 rounded-full object-cover border border-gray-800" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-white text-xs font-bold font-sans">@{p.creatorName}</h4>
                      <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Verified Lifestyle Creator</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                    <span className="text-[9px] text-gray-400 font-mono uppercase">STREETWEAR</span>
                  </div>
                </div>

                {/* Main Image frame with absolute scanning line overlay */}
                <div className="relative aspect-square w-full bg-gray-950 overflow-hidden border-y border-gray-800/60">
                  <img 
                    src={p.imageUrl} 
                    alt="Creator fit post" 
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isScanning ? 'scale-105' : ''
                    }`} 
                    referrerPolicy="no-referrer"
                  />

                  {/* Laser Scanning Bar sweep */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-pink to-transparent shadow-[0_0_12px_#EC4899] z-20 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Scanning targets */}
                  {isScanning && (
                    <>
                      <div className="absolute top-[35%] left-[50%] w-6 h-6 rounded-full border border-brand-pink bg-brand-pink/20 animate-ping z-20" />
                      <div className="absolute top-[65%] left-[45%] w-6 h-6 rounded-full border border-brand-pink bg-brand-pink/20 animate-ping z-20 delay-500" />
                      <div className="absolute top-[50%] left-[25%] w-6 h-6 rounded-full border border-brand-pink bg-brand-pink/20 animate-ping z-20 delay-1000" />
                    </>
                  )}

                  {/* Analyzed Overlay Tag */}
                  {isAnalyzed && (
                    <div className="absolute bottom-4 right-4 bg-brand-lime text-black font-mono font-bold text-[9px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>RECONSTRUCTED BY AI</span>
                    </div>
                  )}
                </div>

                {/* Engagement panel */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-400">
                      <button 
                        onClick={() => handleLike(p.id)}
                        className={`flex items-center gap-1.5 hover:text-brand-pink transition-colors cursor-pointer ${
                          p.isLiked ? 'text-brand-pink' : ''
                        }`}
                      >
                        <Heart className="w-5 h-5 transition-transform active:scale-125" fill={p.isLiked ? '#EC4899' : 'transparent'} />
                        <span className="text-xs font-mono">{p.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs font-mono">{p.comments}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAnalyzeLook(p.id)}
                      disabled={isScanning}
                      className="bg-brand-pink/10 hover:bg-brand-pink/20 disabled:bg-gray-900 border border-brand-pink/30 disabled:border-gray-800 text-brand-pink disabled:text-gray-500 text-xs font-sans font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> 
                          <span>AI Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" /> 
                          <span>Reconstruct Fit</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    <strong className="text-white font-semibold mr-1.5">@{p.creatorName}</strong>
                    {p.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scan Results Panel */}
        <div className="lg:col-span-5 bg-brand-surface/80 border border-gray-800/80 rounded-3xl p-5 sticky top-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3 mb-5">
            <Sparkles className="w-5 h-5 text-brand-pink" />
            <h3 className="text-white font-display font-bold text-sm">AI Fit Reconstruction Advisor</h3>
          </div>

          <AnimatePresence mode="wait">
            {analysisResult ? (
              <motion.div 
                key="result-plate"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                <div>
                  <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider">Extracted Aesthetic Style</span>
                  <p className="text-white font-display font-bold text-sm mt-0.5">{analysisResult.style}</p>
                </div>

                {/* Extracted products and alternative finders */}
                <div className="space-y-3">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Reconstructed Budget Alternates</span>
                  
                  <div className="space-y-3">
                    {analysisResult.items.map((item, index) => (
                      <div key={index} className="bg-gray-950/40 border border-gray-800/60 rounded-xl p-2.5 flex items-center justify-between gap-3 group/item">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-lg bg-gray-900 overflow-hidden border border-gray-800 shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="text-white text-xs font-bold leading-tight truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-500 font-mono">Original: <span className="line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span></p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-brand-lime font-mono font-bold text-xs">₹{item.dealPrice.toLocaleString('en-IN')}</p>
                            <span className="text-[8px] text-gray-400 font-mono block">via {item.source}</span>
                          </div>
                          <button
                            onClick={() => addToCart({
                              id: `scan-item-${index}-${analysisResult.postId}`,
                              name: item.name,
                              price: item.originalPrice,
                              dealPrice: item.dealPrice,
                              img: item.image,
                              brand: item.source,
                              source: item.source,
                              fromSection: "Creator Style Scan"
                            })}
                            className="p-1.5 rounded-lg bg-brand-pink/10 hover:bg-brand-pink text-brand-pink hover:text-white transition-colors cursor-pointer text-[10px] font-bold border border-brand-pink/20"
                            title="Add item to shopping cart"
                          >
                            + Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* comparative calculations */}
                <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-gray-400 border-b border-gray-800/80 pb-2">
                    <span>Retail Designer Price:</span>
                    <span className="font-bold line-through font-mono">₹{analysisResult.totalOriginal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-brand-lime font-bold">
                    <span>SmartSpend Recreated Outfit:</span>
                    <span className="font-mono text-sm">₹{analysisResult.totalBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-brand-pink font-bold border-t border-gray-800/80 pt-2 text-[11px] uppercase tracking-wider">
                    <span>Total Potential Savings:</span>
                    <span>Save ₹{analysisResult.savings.toLocaleString('en-IN')}!</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    analysisResult.items.forEach((item, index) => {
                      addToCart({
                        id: `scan-item-${index}-${analysisResult.postId}`,
                        name: item.name,
                        price: item.originalPrice,
                        dealPrice: item.dealPrice,
                        img: item.image,
                        brand: item.source,
                        source: item.source,
                        fromSection: "Creator Style Scan"
                      });
                    });
                  }}
                  className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-sans font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-brand-pink/15 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Add Entire Outfit to Cart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-plate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-500 bg-gray-950/20 border border-gray-800/60 border-dashed rounded-2xl"
              >
                <HelpCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-xs max-w-[200px] mx-auto leading-relaxed">
                  Select <strong className="text-white font-semibold">"Reconstruct Fit"</strong> on any creator post in the feed to trigger budget alternatives scanning.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
