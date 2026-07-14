/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Share2, Sparkles, Wand2, Shield,
  ArrowRight, Tag, HelpCircle, CheckCircle, Flame, Loader2
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { MOCK_FASHION_POSTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const FashionFeedView: React.FC = () => {
  const { addToCart } = useFinancial();
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('men');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const BRAND_LOGOS = [
    { name: "NIKE", style: "text-red-500 font-extrabold italic tracking-tighter" },
    { name: "ESSENTIALS", style: "text-amber-50 font-black tracking-widest font-mono" },
    { name: "ZARA", style: "text-stone-300 font-serif tracking-tight text-xs font-bold" },
    { name: "BALENCIAGA", style: "text-neutral-100 font-sans tracking-wide uppercase font-black text-[10px]" },
    { name: "OFF-WHITE™", style: "text-amber-400 font-mono tracking-tighter font-extrabold italic" },
    { name: "SUPREME", style: "text-white bg-red-600 px-1 py-0.5 rounded-sm font-sans tracking-tighter font-bold font-black text-[9px]" },
  ];

  const CURATED_PRODUCTS = {
    men: [
      {
        id: "mc-1",
        name: "Fleece Essentials Hoodie",
        brand: "ESSENTIALS",
        category: "Clothing",
        price: 6500,
        dealPrice: 2100,
        source: "Ajio Club",
        savings: 4400,
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300",
        rating: "A+"
      },
      {
        id: "ms-1",
        name: "Air Jordan 1 Retro Red",
        brand: "NIKE",
        category: "Shoes",
        price: 16995,
        dealPrice: 11999,
        source: "Myntra Hype",
        savings: 4996,
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300",
        rating: "S-Tier"
      },
      {
        id: "mc-2",
        name: "Structured Trench Coat",
        brand: "ZARA",
        category: "Clothing",
        price: 8990,
        dealPrice: 3999,
        source: "Zara Store sale",
        savings: 4991,
        img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300",
        rating: "A"
      },
      {
        id: "ms-2",
        name: "Defender Extreme Sneakers",
        brand: "BALENCIAGA",
        category: "Shoes",
        price: 84000,
        dealPrice: 12500,
        source: "SoleSearch Outlet",
        savings: 71500,
        img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=300",
        rating: "A+"
      },
      {
        id: "mc-3",
        name: "Industrial Arrows Tee",
        brand: "OFF-WHITE™",
        category: "Clothing",
        price: 28000,
        dealPrice: 4500,
        source: "Hype Fly India",
        savings: 23500,
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300",
        rating: "S-Tier"
      },
      {
        id: "mc-4",
        name: "Supreme Box Logo Tee",
        brand: "SUPREME",
        category: "Clothing",
        price: 12000,
        dealPrice: 3100,
        source: "CopUnderdog",
        savings: 8900,
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=300",
        rating: "A+"
      }
    ],
    women: [
      {
        id: "wc-1",
        name: "Dunk Low Panda Retro",
        brand: "NIKE",
        category: "Shoes",
        price: 9695,
        dealPrice: 8499,
        source: "VegNonVeg Store",
        savings: 1196,
        img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=300",
        rating: "S-Tier"
      },
      {
        id: "ws-1",
        name: "Oversized Sweatpants",
        brand: "ESSENTIALS",
        category: "Clothing",
        price: 7200,
        dealPrice: 2400,
        source: "Ajio Luxe",
        savings: 4800,
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
        rating: "A+"
      },
      {
        id: "wc-2",
        name: "Structured Blazer Dress",
        brand: "ZARA",
        category: "Clothing",
        price: 7990,
        dealPrice: 2999,
        source: "Myntra",
        savings: 4991,
        img: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=300",
        rating: "A"
      },
      {
        id: "ws-2",
        name: "Hourglass Mini Shoulder Bag",
        brand: "BALENCIAGA",
        category: "Bags",
        price: 165000,
        dealPrice: 9999,
        source: "Luxury Preloved",
        savings: 155001,
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300",
        rating: "S-Tier"
      },
      {
        id: "wc-3",
        name: "Ribbed Knit Crop Top",
        brand: "OFF-WHITE™",
        category: "Clothing",
        price: 18500,
        dealPrice: 3200,
        source: "H&M Trend",
        savings: 15300,
        img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=300",
        rating: "A+"
      },
      {
        id: "ws-3",
        name: "Supreme Classic Backpack",
        brand: "SUPREME",
        category: "Accessories",
        price: 14000,
        dealPrice: 4200,
        source: "Flipkart Luxe",
        savings: 9800,
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=300",
        rating: "S-Tier"
      }
    ]
  };

  // Filter products by activeGender and selectedBrand (if set)
  const filteredProducts = CURATED_PRODUCTS[activeGender].filter(product => {
    if (!selectedBrand) return true;
    return product.brand.toUpperCase() === selectedBrand.toUpperCase();
  });

  const handleBrandClick = (brandName: string) => {
    if (selectedBrand?.toUpperCase() === brandName.toUpperCase()) {
      setSelectedBrand(null); // Deselect
    } else {
      setSelectedBrand(brandName);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Fashion Intelligence Feed</h2>
          <p className="text-gray-400 text-xs mt-0.5 font-sans">Discover premium streetwear, compare real brand rates & reconstruct looks for student budgets</p>
        </div>

        {/* Brand Showcase Hub - Clickable for Filtering */}
        <div className="flex items-center gap-2 border border-gray-800/80 bg-gray-950/40 p-2 rounded-2xl overflow-x-auto max-w-full">
          <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase pl-1 shrink-0">FILTER BRAND:</span>
          {BRAND_LOGOS.map((b, idx) => {
            const isSelected = selectedBrand?.toUpperCase() === b.name.toUpperCase();
            return (
              <button 
                key={idx} 
                onClick={() => handleBrandClick(b.name)}
                className={`border rounded-lg px-2.5 py-1 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-brand-pink/20 border-brand-pink scale-105 shadow-[0_0_8px_rgba(236,72,153,0.3)]' 
                    : 'bg-gray-900 border-gray-800/60 hover:border-gray-700/80'
                }`}
              >
                <span className={b.style}>{b.name}</span>
              </button>
            );
          })}
          {selectedBrand && (
            <button 
              onClick={() => setSelectedBrand(null)}
              className="text-[9px] font-mono text-brand-pink hover:text-white bg-brand-pink/10 hover:bg-brand-pink/20 border border-brand-pink/30 rounded-lg px-2.5 py-1 cursor-pointer shrink-0 transition-all font-bold"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Curated Catalog Section with interactive Gender Toggle (Google & Apple inspired minimalism) */}
      <div className="bg-brand-surface/50 border border-gray-800/80 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-base font-bold font-display">Curated Alternative Catalogs</h3>
              {selectedBrand && (
                <span className="text-[10px] bg-brand-pink/10 text-brand-pink font-mono px-2 py-0.5 rounded-full font-bold">
                  {selectedBrand} ONLY
                </span>
              )}
            </div>
            <span className="text-gray-500 text-[10px] font-mono tracking-wider uppercase">COMPARE OR CHECK RECREATION OPTIONS</span>
          </div>

          {/* Clean Segment Control Slider */}
          <div className="flex bg-gray-950/80 p-1 border border-gray-800 rounded-xl relative">
            <button
              onClick={() => setActiveGender('men')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all z-10 cursor-pointer ${
                activeGender === 'men' ? 'text-black bg-brand-pink' : 'text-gray-400 hover:text-white'
              }`}
            >
              Men's Lookbook
            </button>
            <button
              onClick={() => setActiveGender('women')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all z-10 cursor-pointer ${
                activeGender === 'women' ? 'text-black bg-brand-pink' : 'text-gray-400 hover:text-white'
              }`}
            >
              Women's Lookbook
            </button>
          </div>
        </div>

        {/* Dynamic products list */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-brand-surface/80 border border-gray-800/85 hover:border-gray-700/80 rounded-2xl p-3 flex flex-col justify-between space-y-3 group transition-all duration-300 shadow-md relative"
              >
                {/* Product Label */}
                <span className="absolute top-5 right-5 z-15 bg-brand-pink text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow">
                  {product.rating}
                </span>

                {/* Product Visual */}
                <div className="aspect-square rounded-xl bg-gray-950 overflow-hidden border border-gray-800/60 relative">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                    <span className="text-[8px] text-brand-pink font-mono block uppercase tracking-wider font-extrabold">{product.brand}</span>
                    <h4 className="text-white text-xs font-bold font-display truncate leading-tight mt-0.5">{product.name}</h4>
                  </div>
                </div>

                {/* Compare section */}
                <div className="bg-gray-950/40 border border-gray-800/40 rounded-xl p-2.5 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 font-sans">Brand Price:</span>
                    <span className="text-gray-400 line-through font-mono">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-t border-gray-800/50 pt-1.5">
                    <span className="text-brand-lime font-sans font-bold">Best Deal:</span>
                    <span className="text-brand-lime font-mono font-black">₹{product.dealPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action buttons & detail tag */}
                <div className="flex justify-between items-center gap-2 pt-1">
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] text-gray-500 font-mono truncate block">via {product.source}</span>
                    <span className="text-[9px] text-brand-pink font-mono font-bold">
                      Save ₹{product.savings.toLocaleString('en-IN')}!
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      dealPrice: product.dealPrice,
                      img: product.img,
                      brand: product.brand,
                      source: product.source,
                      fromSection: "Fashion Feed"
                    })}
                    className="px-2.5 py-1.5 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white font-sans font-bold text-[10px] tracking-wide transition-all shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-800/60 border-dashed rounded-2xl bg-gray-950/20 text-gray-500 text-xs">
            No curated looks found for <strong className="text-white font-semibold">{selectedBrand}</strong> under {activeGender === 'men' ? "Men's" : "Women's"} Category.
          </div>
        )}
      </div>

    </div>
  );
};
