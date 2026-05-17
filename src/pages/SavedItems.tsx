import React from "react";
import { Bookmark, Search, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SavedItems() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-main">Saved Opportunities</h1>
          <p className="text-neutral-500 mt-1">Manage your watched grants, bounties, and proposals.</p>
        </div>
        <button className="text-sm font-bold text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Mock saved items */}
        <SavedItemCard 
          title="AI Tooling Grant" 
          dao="ZeroAuth" 
          reward="$5,000" 
          type="grant"
          date="Saved 2 days ago"
        />
        <SavedItemCard 
          title="ZKP Research Proposal" 
          dao="PrivacyDAO" 
          reward="N/A" 
          type="proposal"
          date="Saved 5 days ago"
        />
      </div>

      <div className="py-20 text-center space-y-6 bg-card-bg border border-border-main rounded-3xl mt-12 mx-4 md:mx-0">
        <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8 text-brand-blue" />
        </div>
        <div className="max-w-xs mx-auto px-4">
          <h3 className="text-xl font-bold mb-2 text-text-main">Track more items</h3>
          <p className="text-neutral-500 text-sm mb-6">Found an interesting opportunity? Bookmark it to track its status and updates.</p>
          <Link to="/explorer" className="inline-flex items-center gap-2 bg-brand-blue px-6 py-3 rounded-full font-bold text-sm text-white">
            Go to Explorer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SavedItemCard({ title, dao, reward, type, date }: any) {
  return (
    <div className="bloomberg-card group flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6">
      <div className="flex items-center gap-4 md:gap-6 w-full">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-nav-hover border border-border-main rounded-xl flex items-center justify-center group-hover:bg-brand-blue/10 transition-all shrink-0">
          <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-brand-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded tracking-widest">{type}</span>
            <span className="text-[10px] uppercase font-mono text-neutral-500 overflow-hidden text-ellipsis whitespace-nowrap">{dao}</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-text-main group-hover:text-brand-blue transition-colors truncate">{title}</h3>
          <p className="text-[10px] md:text-xs text-neutral-500 mt-1">{date}</p>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
        <div className="md:text-right">
          <div className="text-[10px] uppercase font-mono text-neutral-500">Reward</div>
          <div className="text-lg font-mono font-bold text-text-main">{reward}</div>
        </div>
        <button className="p-2.5 md:p-3 bg-card-bg border border-border-main rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
