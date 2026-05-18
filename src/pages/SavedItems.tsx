import React, { useState, useEffect } from "react";
import { Bookmark, Search, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function SavedItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("zascout_saved");
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("zascout_saved", JSON.stringify(updated));
  };

  const clearAll = () => {
    setItems([]);
    localStorage.setItem("zascout_saved", JSON.stringify([]));
  };

  if (loading) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4 md:px-0 min-h-[60vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-main">Saved Opportunities</h1>
          <p className="text-neutral-500 mt-1">Manage your watched grants, bounties, and proposals.</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-sm font-bold text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-2 group"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <SavedItemCard 
                item={item}
                onRemove={() => removeItem(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center space-y-6 bg-card-bg border border-border-main rounded-3xl mt-12 mx-4 md:mx-0"
          >
            <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8 text-brand-blue" />
            </div>
            <div className="max-w-xs mx-auto px-4">
              <h3 className="text-xl font-bold mb-2 text-text-main">No saved items yet</h3>
              <p className="text-neutral-500 text-sm mb-6">Found an interesting opportunity? Bookmark it to track its status and updates.</p>
              <Link to="/explorer" className="inline-flex items-center gap-2 bg-brand-blue px-6 py-3 rounded-full font-bold text-sm text-white hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-brand-blue/30">
                Go to Explorer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SavedItemCard({ item, onRemove }: any) {
  const formatReward = (reward: number) => {
    if (reward === 0) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(reward);
  };

  return (
    <div className="bloomberg-card group flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6">
      <div className="flex items-center gap-4 md:gap-6 w-full">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-nav-hover border border-border-main rounded-xl flex items-center justify-center group-hover:bg-brand-blue/10 transition-all shrink-0">
          <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-brand-blue fill-brand-blue/20" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded tracking-widest">{item.type}</span>
            <span className="text-[10px] uppercase font-mono text-neutral-500 overflow-hidden text-ellipsis whitespace-nowrap">{item.dao}</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-text-main group-hover:text-brand-blue transition-colors truncate">{item.title}</h3>
          <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Deadline: {item.deadline}</p>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
        <div className="md:text-right">
          <div className="text-[10px] uppercase font-mono text-neutral-500">Reward</div>
          <div className="text-lg font-mono font-bold text-text-main tracking-tight">{formatReward(item.reward)}</div>
        </div>
        <button 
          onClick={onRemove}
          className="p-2.5 md:p-3 bg-card-bg border border-border-main rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-90"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
