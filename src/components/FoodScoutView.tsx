/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Utensils, Search, MapPin, Star, Sparkles, Navigation,
  Activity, AlertCircle, CheckCircle, ShieldAlert, Heart
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { MOCK_RESTAURANTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const FoodScoutView: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState<boolean>(false);
  const [selectedRest, setSelectedRest] = useState<typeof MOCK_RESTAURANTS[0] | null>(null);

  const handleRequestLocation = () => {
    setIsRequestingLocation(true);
    setTimeout(() => {
      setLocationEnabled(true);
      setIsRequestingLocation(false);
    }, 1500);
  };

  const filteredRests = MOCK_RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Food Scout Intelligence</h2>
          <p className="text-gray-400 text-xs mt-0.5">Scout local student-friendly restaurants within your budget limits</p>
        </div>

        {/* Location permission banner */}
        <button
          onClick={handleRequestLocation}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-all ${
            locationEnabled 
              ? 'bg-brand-orange/10 border border-brand-orange/30 text-brand-orange' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          <MapPin className="w-4 h-4" />
          {isRequestingLocation ? "Requesting..." : (locationEnabled ? "Location Enabled" : "Allow Geolocation")}
        </button>
      </div>

      {/* Query Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="I want biryani under 300, cheesy fries..."
          className="w-full bg-brand-surface/70 border border-gray-800 focus:border-brand-orange rounded-2xl pl-11 pr-4 py-3 text-white text-xs focus:outline-none"
        />
      </div>

      {/* Restaurant listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRests.map((r) => (
          <div 
            key={r.id}
            className="bg-brand-surface/70 border border-gray-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative h-44 bg-gray-900">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-brand-surface/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-sans font-bold text-white flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {r.rating}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-white text-sm font-bold font-display line-clamp-1">{r.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">{r.distance} km away</span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">{r.cuisine}</p>
              </div>

              {/* Price level */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Avg Cost (two)</span>
                <span className="text-white font-mono font-bold">₹{r.estimatedPrice}</span>
              </div>

              {/* Match Score Indicator */}
              <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-brand-orange">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-sans font-semibold">AI Match Score</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">{r.aiMatchScore}%</span>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed italic line-clamp-2">
                "{r.reviewSummary}"
              </p>

              <button 
                onClick={() => setSelectedRest(r)}
                className="w-full bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/40 text-brand-orange font-sans font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Inspect Food Scores
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Food Scores breakdown modal */}
      <AnimatePresence>
        {selectedRest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-surface border border-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4"
            >
              <div className="text-center space-y-1">
                <h3 className="text-white font-display font-bold text-base">{selectedRest.name}</h3>
                <p className="text-gray-400 text-xs">AI-driven score index assessments</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Taste Rating", val: selectedRest.scores.taste, color: 'bg-brand-orange' },
                  { label: "Value for Money", val: selectedRest.scores.value, color: 'bg-brand-lime' },
                  { label: "Hygiene Standards", val: selectedRest.scores.hygiene, color: 'bg-brand-emerald' },
                  { label: "Student-Friendliness Index", val: selectedRest.scores.studentFriendly, color: 'bg-brand-blue' }
                ].map((sc, index) => (
                  <div key={index} className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>{sc.label}</span>
                      <span className="font-mono font-semibold text-white">{sc.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${sc.color}`} style={{ width: `${sc.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedRest(null)}
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-sans font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
