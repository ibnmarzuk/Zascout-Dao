import React, { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import { cn } from "@/src/lib/utils";

interface ExplorerProps {
  type?: "grant" | "bounty" | "proposal" | "all";
}

export default function Explorer({ type = "all" }: ExplorerProps) {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [selectedType, setSelectedType] = useState(type);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get("/api/dao/opportunities");
    setOpportunities(res.data);
    setLoading(false);
  };

  const filtered = opportunities.filter(op => {
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          op.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || op.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/discover", { query: searchQuery });
      // The AI returns recommendations and keywords
      // For now, we'll just set the search query to the first keyword to "simulate" the filter
      if (res.data.keywords && res.data.keywords.length > 0) {
        setSearchQuery(res.data.keywords[0]);
      }
    } catch (e) {
      console.error("AI Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold capitalize text-text-main">{selectedType === "all" ? "Opportunity Explorer" : `${selectedType}s`}</h1>
          <p className="text-neutral-500 mt-1">Discover and filter curated opportunities across the Zero Authority ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card-bg p-1 rounded-lg border border-border-main">
          <button 
            onClick={() => setView("grid")}
            className={cn("p-2 rounded-md transition-all", view === "grid" ? "bg-nav-hover text-brand-blue shadow-sm" : "text-neutral-500 hover:text-text-main")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView("list")}
            className={cn("p-2 rounded-md transition-all", view === "list" ? "bg-nav-hover text-brand-blue shadow-sm" : "text-neutral-500 hover:text-text-main")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Help: Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-neutral-500 group-focus-within:text-brand-blue transition-colors">
            <Sparkles className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search title, tech, or DAO..." 
            className="w-full bg-card-bg border border-border-main rounded-xl py-3.5 md:py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue/50 transition-all font-medium text-sm md:text-base text-text-main placeholder:text-neutral-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="h-12 md:h-14 flex-1 lg:px-6 bg-card-bg border border-border-main rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-text-main hover:bg-card-hover transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={handleAISearch}
            disabled={loading}
            className="h-12 md:h-14 flex-1 lg:px-6 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-brand-blue/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "..." : "AI Scout"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 md:gap-8 border-b border-border-main pb-px overflow-x-auto no-scrollbar scroll-smooth">
        {["all", "grant", "bounty", "proposal"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t as any)}
            className={cn(
              "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
              selectedType === t ? "text-brand-blue" : "text-neutral-500 hover:text-text-main"
            )}
          >
            {t}
            {selectedType === t && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className={cn(
        "grid gap-4 transition-all",
        view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
      )}>
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-card-hover animate-pulse rounded-xl border border-border-main" />)
        ) : filtered.length > 0 ? (
          filtered.map(op => (
            view === "grid" ? <OpGridCard key={op.id} op={op} /> : <OpListCard key={op.id} op={op} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-card-bg rounded-2xl border border-dashed border-border-main">
            <Search className="w-12 h-12 text-neutral-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-text-main">No matching opportunities</h3>
            <p className="text-neutral-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OpListCard({ op }: any) {
  // Reuse existing card from Dashboard but styled for Explorer list view
  return (
    <div className="bloomberg-card group cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider">{op.type}</span>
          <span className="text-[10px] uppercase font-mono text-neutral-500">{op.dao}</span>
        </div>
        <h3 className="text-lg font-bold text-text-main group-hover:text-brand-blue transition-colors">{op.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {op.tags.map((t: string) => (
            <span key={t} className="text-[10px] font-mono text-neutral-500 uppercase border border-border-main px-1.5 rounded">{t}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 md:flex items-center gap-4 md:gap-8 md:px-8 border-t md:border-t-0 md:border-l border-border-main pt-4 md:pt-0 w-full md:w-auto">
        <div className="shrink-0 md:text-right">
          <div className="text-[10px] md:text-sm font-mono text-neutral-500 lowercase">Reward</div>
          <div className="text-base md:text-xl font-mono font-bold text-brand-blue tracking-tight">{op.reward}</div>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="text-[10px] md:text-sm font-mono text-neutral-500 lowercase">Deadline</div>
          <div className="text-xs md:text-sm font-bold text-text-main">{op.deadline}</div>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="text-[10px] md:text-sm font-mono text-neutral-500 lowercase">Activity</div>
          <div className="text-xs md:text-sm font-bold text-emerald-500">{op.activityScore}%</div>
        </div>
      </div>
    </div>
  );
}

function OpGridCard({ op }: any) {
  return (
    <div className="bloomberg-card group cursor-pointer flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider">{op.type}</span>
          <span className="text-xl font-mono font-bold text-brand-blue tracking-tighter">{op.reward}</span>
        </div>
        <h3 className="text-xl font-bold text-text-main group-hover:text-brand-blue transition-colors mb-3 leading-tight font-display">{op.title}</h3>
        <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed tracking-tight">Active opportunity from {op.dao} focused on {op.tags.join(', ')}.</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {op.tags.map((t: string) => (
            <span key={t} className="text-[10px] font-mono text-neutral-500 uppercase border border-border-main px-1.5 rounded">{t}</span>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-border-main flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        <div className="flex items-center gap-1"><SlidersHorizontal className="w-3 h-3 text-brand-blue" /> {op.dao}</div>
        <div>Score: {op.activityScore}</div>
      </div>
    </div>
  );
}
