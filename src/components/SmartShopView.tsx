/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Bell, Sparkles, Flame, Check, HelpCircle,
  TrendingDown, Percent, ArrowDown, ChevronRight, Tag
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { MOCK_PRODUCTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const SmartShopView: React.FC = () => {
  const { coupons, addToCart } = useFinancial();

  const [search, setSearch] = useState<string>('');
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null);

  const handleToggleAlert = (prodId: string) => {
    setActiveAlerts(prev => 
      prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
    );
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Smart Shop</h2>
          <p className="text-gray-400 text-xs mt-0.5">Find high-quality products recreated for your student budget</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What product are you looking for? (e.g. sneakers, earbuds)..."
          className="w-full bg-brand-surface/70 border border-gray-800 focus:border-brand-blue rounded-2xl pl-11 pr-4 py-3 text-white text-xs focus:outline-none"
        />
      </div>

      {/* Main product listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((p) => {
          const hasAlert = activeAlerts.includes(p.id);

          return (
            <div 
              key={p.id}
              className="bg-brand-surface/70 border border-gray-800 rounded-3xl p-5 backdrop-blur-md space-y-4 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-brand-blue font-mono uppercase tracking-wider">{p.merchantName} deals</span>
                  <h3 className="text-white text-sm font-bold font-display mt-0.5">{p.name}</h3>
                  
                  {/* Dynamic Price Drop Animation Representation */}
                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="text-white text-base font-bold font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 text-xs line-through font-mono">₹{(p.price * 1.25).toFixed(0)}</span>
                    <span className="text-brand-lime text-[10px] font-mono font-bold bg-brand-lime/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> -20% OFF
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAlert(p.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    hasAlert 
                      ? 'bg-brand-blue/15 border-brand-blue text-brand-blue' 
                      : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'
                  }`}
                  title={hasAlert ? "Alert active" : "Track price drop"}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Lower comparisons */}
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">SMART ALTERNATIVES DETECTED</span>
                
                <div className="space-y-2.5">
                  {p.alternatives.map((alt) => (
                    <div 
                      key={alt.id}
                      className="flex items-center justify-between text-xs border-b border-gray-800/30 pb-2.5 last:border-none last:pb-0 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{alt.name}</p>
                        <span className="text-[10px] text-gray-500 font-mono">{alt.merchantName}</span>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <p className="text-brand-lime font-bold font-mono">₹{alt.price.toLocaleString('en-IN')}</p>
                        <span className="text-[9px] text-gray-400 block">Saves ₹{p.price - alt.price}</span>
                      </div>

                      <button
                        onClick={() => addToCart({
                          id: alt.id,
                          name: alt.name,
                          price: p.price,
                          dealPrice: alt.price,
                          img: p.id === "prod-1" ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200",
                          brand: alt.merchantName,
                          source: alt.merchantName,
                          fromSection: "Smart Shop"
                        })}
                        className="px-2 py-1.5 rounded-lg bg-brand-blue/15 border border-brand-blue/25 hover:bg-brand-blue hover:text-white text-brand-blue text-[9px] font-bold tracking-wide transition-all shrink-0 cursor-pointer"
                        title="Add this budget-recreated alternative to cart"
                      >
                        + Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSelectedProduct(p)}
                  className="bg-brand-surface hover:bg-gray-900 border border-gray-800 text-gray-300 font-sans font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Evaluate Fit
                </button>
                <button 
                  onClick={() => {
                    const bestAlt = p.alternatives[0];
                    addToCart({
                      id: bestAlt.id,
                      name: bestAlt.name,
                      price: p.price,
                      dealPrice: bestAlt.price,
                      img: p.id === "prod-1" ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200",
                      brand: bestAlt.merchantName,
                      source: bestAlt.merchantName,
                      fromSection: "Smart Shop"
                    });
                  }}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-sans font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-brand-blue/15 cursor-pointer"
                >
                  Add Best Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Trending Cross-site Comparisons & Best Deals (Google / Apple Style Artistry) */}
      <div className="space-y-4 pt-4 border-t border-gray-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-brand-lime animate-pulse" />
            <span className="text-[10px] text-white font-mono tracking-widest uppercase font-bold">Trending Gen-Z Hotlists & Live Compares</span>
          </div>
          <span className="text-[9px] bg-brand-lime/10 text-brand-lime px-2.5 py-1 rounded-full font-mono font-bold animate-pulse">
            ● LIVE DEALS SAVER
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              id: "trend-1",
              name: "Sony WH-1000XM5 wireless ANC",
              category: "Premium Audio",
              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300",
              demand: "98% Demand",
              stores: [
                { name: "Flipkart", price: 28990, best: true },
                { name: "Amazon", price: 29999 },
                { name: "Reliance Dig.", price: 31500 },
                { name: "Croma Store", price: 30490 }
              ]
            },
            {
              id: "trend-2",
              name: "Nike Dunk Low 'Panda' Retro",
              category: "Hype Streetwear",
              img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=300",
              demand: "95% Demand",
              stores: [
                { name: "Myntra", price: 8499, best: true },
                { name: "Nike Official", price: 9695 },
                { name: "Ajio Luxe", price: 8999 },
                { name: "VegNonVeg", price: 9695 }
              ]
            },
            {
              id: "trend-3",
              name: "Stanley Quencher H2.0 (40oz)",
              category: "Aesthetic Hydration",
              img: "https://images.unsplash.com/photo-1575826013736-44e1d24ed1ca?auto=format&fit=crop&q=80&w=300",
              demand: "91% Demand",
              stores: [
                { name: "Flipkart", price: 4199, best: true },
                { name: "Nykaa Man", price: 4250 },
                { name: "Amazon IN", price: 4500 },
                { name: "Tata CLiQ", price: 4399 }
              ]
            }
          ].map((item) => {
            const bestDeal = item.stores.find(s => s.best);
            const worstPrice = Math.max(...item.stores.map(s => s.price));
            const savings = bestDeal ? worstPrice - bestDeal.price : 0;

            return (
              <div 
                key={item.id}
                className="bg-brand-surface/70 border border-gray-800/80 hover:border-gray-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all duration-300 relative overflow-hidden shadow-lg"
              >
                {/* Image & Header */}
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gray-900 overflow-hidden shrink-0 border border-gray-800/80">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-fade-in" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[8px] font-mono text-brand-lime bg-brand-lime/10 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">{item.category}</span>
                      <span className="text-[8px] font-mono text-gray-400">{item.demand}</span>
                    </div>
                    <h4 className="text-white text-xs font-bold font-display truncate leading-tight">{item.name}</h4>
                  </div>
                </div>

                {/* Pricing List with Live Bar Visualizers */}
                <div className="bg-gray-950/40 border border-gray-800/50 rounded-xl p-3 space-y-2">
                  <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase block">Live price indexing</span>
                  
                  <div className="space-y-1.5">
                    {item.stores.map((store, sIdx) => (
                      <div key={sIdx} className={`flex items-center justify-between text-[11px] px-2 py-1 rounded-md ${
                        store.best 
                          ? 'bg-brand-lime/10 border border-brand-lime/20 text-brand-lime' 
                          : 'text-gray-400'
                      }`}>
                        <span className="font-medium">{store.name}</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`${store.best ? 'font-black text-brand-lime' : ''}`}>₹{store.price.toLocaleString('en-IN')}</span>
                          {store.best && (
                            <span className="text-[7px] font-mono font-bold bg-brand-lime text-black px-1.5 py-0.5 rounded uppercase tracking-wider">BEST</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlighted best deal section */}
                <div className="bg-gradient-to-r from-gray-950 to-gray-900 border border-gray-800/80 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-gray-500 font-mono block uppercase">Best Deal Price</span>
                    <span className="text-sm font-mono font-black text-brand-lime">₹{bestDeal?.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-brand-pink font-mono block uppercase">Max Savings</span>
                    <span className="text-[10px] font-mono font-black text-white">Save ₹{savings.toLocaleString('en-IN')}!</span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart({
                    id: item.id,
                    name: item.name,
                    price: worstPrice,
                    dealPrice: bestDeal?.price || worstPrice,
                    img: item.img,
                    brand: bestDeal?.name || "Best Store",
                    source: bestDeal?.name || "Best Store",
                    fromSection: "Smart Shop"
                  })}
                  className="w-full bg-brand-blue/10 border border-brand-blue/20 hover:bg-brand-blue hover:text-white text-brand-blue font-sans font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  + Add Best Deal to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget evaluation Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-surface border border-gray-800 rounded-3xl p-6 w-full max-w-md space-y-4"
            >
              <div className="text-center space-y-1">
                <h3 className="text-white font-display font-bold text-base">Budget Impact Assessment</h3>
                <p className="text-gray-400 text-xs">For buying "{selectedProduct.name}" this month</p>
              </div>

              <div className="bg-brand-surface-light border border-gray-800 rounded-2xl p-4 space-y-3 text-xs leading-relaxed text-gray-400">
                <div className="flex justify-between text-white border-b border-gray-800 pb-2">
                  <span>Product Price</span>
                  <span className="font-bold">₹{selectedProduct.price}</span>
                </div>
                
                <p>⚠️ <strong>Savings Impact:</strong> Storing ₹{selectedProduct.price} for this retail item would absorb <strong>125% of your remaining monthly food delivery cap</strong> (which stands at ₹300 remaining).</p>
                
                <p>💡 <strong>Agent Advice:</strong> Consider waiting 11 days for the next monthly budget cap replenishment, or buying our recommended cheaper student alternative, saving up to ₹1,400!</p>
              </div>

              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-full bg-brand-blue text-white font-sans font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Close evaluation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
