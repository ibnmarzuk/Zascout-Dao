import React, { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, Sparkles, Bookmark } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import { cn } from "@/src/lib/utils";

interface ExplorerProps {
  type?: "grant" | "bounty" | "proposal" | "all";
}

interface Opportunity {
  id: string;
  type: string;
  title: string;
  dao: string;
  tags: string[];
  reward: number;
  deadline: string;
  activityScore: number;
  sourcePlatform?: string;
  status: string;
}

export default function Explorer({ type = "all" }: ExplorerProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [selectedType, setSelectedType] = useState(type);
  
  // New Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [daoFilter, setDaoFilter] = useState<string>("all");
  const [rewardRange, setRewardRange] = useState<[number, number]>([0, 20000]);
  const [showFilters, setShowFilters] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    const saved = localStorage.getItem("zascout_saved");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedIds(parsed.map((item: Record<string, string>) => item.id));
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // First try to fetch from the general opportunities mock
      const res = await axios.get("/api/dao/opportunities");
      setOpportunities(res.data);
      
      // Optionally fetch real bounties if available via proxy
      // const realBounties = await axios.get("/api/v1/bounties");
      // console.log("Real bounties:", realBounties.data);
    } catch (e) {
      console.error("Failed to fetch opportunities", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (e: React.MouseEvent, op: Opportunity) => {
    e.stopPropagation();
    const isSaved = savedIds.includes(op.id);
    let updatedSaved;
    
    const currentSavedStr = localStorage.getItem("zascout_saved");
    const currentSaved = currentSavedStr ? JSON.parse(currentSavedStr) : [];

    if (isSaved) {
      updatedSaved = currentSaved.filter((item: Opportunity) => item.id !== op.id);
      setSavedIds(savedIds.filter(id => id !== op.id));
    } else {
      updatedSaved = [...currentSaved, op];
      setSavedIds([...savedIds, op.id]);
    }
    
    localStorage.setItem("zascout_saved", JSON.stringify(updatedSaved));
  };

  const filtered = opportunities.filter((op: Opportunity) => {
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          op.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          op.dao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || op.type === selectedType;
    const matchesStatus = statusFilter === "all" || op.status === statusFilter;
    const matchesDao = daoFilter === "all" || op.dao === daoFilter;
    const matchesReward = op.reward >= rewardRange[0] && (rewardRange[1] === 20000 ? true : op.reward <= rewardRange[1]);
    
    return matchesSearch && matchesType && matchesStatus && matchesDao && matchesReward;
  });

  const daos = Array.from(new Set(opportunities.map(op => op.dao))).sort();

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await axios.post("/api/ai/discover", { query: searchQuery });
      if (res.data.keywords) {
        setAiSuggestions(res.data.keywords);
      }
      if (res.data.filterHints) {
        if (res.data.filterHints.status) setStatusFilter(res.data.filterHints.status);
        if (res.data.filterHints.type) setSelectedType(res.data.filterHints.type);
      }
      if (!res.data.keywords?.length && !res.data.filterHints) {
        setAiError("Scout couldn't find specific matching criteria, but here are some global results.");
      }
    } catch (e) {
      console.error("AI Search failed", e);
      setAiError("Failed to get AI insights. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearActiveFilters = () => {
    setStatusFilter("all");
    setDaoFilter("all");
    setRewardRange([0, 20000]);
    setSearchQuery("");
    setSelectedType("all");
    setAiSuggestions([]);
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
      <div className="flex flex-col gap-4">
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
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-12 md:h-14 flex-1 lg:px-6 border rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                showFilters ? "bg-brand-blue/10 border-brand-blue text-brand-blue" : "bg-card-bg border-border-main text-text-main hover:bg-card-hover"
              )}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
            <button 
              onClick={handleAISearch}
              disabled={aiLoading}
              className="h-12 md:h-14 flex-1 lg:px-6 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-brand-blue/20 transition-all disabled:opacity-50"
            >
              {aiLoading ? (
                <div className="w-4 h-4 border-2 border-brand-blue animate-spin border-t-transparent rounded-full" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {aiLoading ? "Searching..." : "AI Scout"}
            </button>
          </div>
        </div>

        {/* AI Error/Feedback */}
        {aiError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-xs font-medium animate-in fade-in duration-300">
            {aiError}
          </div>
        )}

        {/* AI Keywords suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1 py-1">AI Suggestions:</span>
            {aiSuggestions.map(kw => (
              <button 
                key={kw} 
                onClick={() => setSearchQuery(kw)}
                className="px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/20 text-brand-blue text-[10px] font-bold hover:bg-brand-blue/20 transition-all"
              >
                {kw}
              </button>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-card-bg border border-border-main rounded-2xl">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Status</label>
                <div className="flex flex-wrap gap-2">
                  {["all", "active", "open", "voting"].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-all",
                        statusFilter === s ? "bg-brand-blue/10 border-brand-blue text-brand-blue" : "bg-card-hover border-border-main text-neutral-500 hover:text-text-main"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">DAO Ecosystem</label>
                <select 
                  value={daoFilter}
                  onChange={(e) => setDaoFilter(e.target.value)}
                  className="w-full bg-card-hover border border-border-main rounded-lg p-2.5 text-xs font-bold text-text-main focus:outline-none focus:border-brand-blue/50"
                >
                  <option value="all">All Ecosystems</option>
                  {daos.map(dao => (
                    <option key={dao} value={dao}>{dao}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Reward Range (USD)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="20000" 
                    step="500"
                    value={rewardRange[1]}
                    onChange={(e) => setRewardRange([0, parseInt(e.target.value, 10)])}
                    className="flex-1 accent-brand-blue h-1 bg-border-main rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-brand-blue min-w-[70px] text-right">
                    {rewardRange[1] === 20000 ? "Any" : `< $${rewardRange[1]}`}
                  </span>
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={clearActiveFilters}
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-red-500 transition-all underline underline-offset-4"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 md:gap-8 border-b border-border-main pb-px overflow-x-auto no-scrollbar scroll-smooth">
        {["all", "grant", "bounty", "proposal"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t as "grant" | "bounty" | "proposal" | "all")}
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
        "grid transition-all",
        view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "grid-cols-1 gap-4"
      )}>
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-card-hover animate-pulse rounded-xl border border-border-main" />)
        ) : filtered.length > 0 ? (
          filtered.map(op => (
            view === "grid" ? (
              <OpGridCard 
                key={op.id} 
                op={op} 
                isSaved={savedIds.includes(op.id)}
                onToggleSave={(e: React.MouseEvent) => toggleSave(e, op)}
              />
            ) : (
              <OpListCard 
                key={op.id as string} 
                op={op} 
                isSaved={savedIds.includes(op.id as string)}
                onToggleSave={(e: React.MouseEvent) => toggleSave(e, op)}
              />
            )
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

function formatReward(reward: number) {
  if (reward === 0) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(reward);
}

const OpListCard: React.FC<{ op: Opportunity, isSaved: boolean, onToggleSave: (e: React.MouseEvent) => void }> = ({ op, isSaved, onToggleSave }) => {
  // Reuse existing card from Dashboard but styled for Explorer list view
  return (
    <div className="bloomberg-card group cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 relative">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider">{op.type}</span>
          {op.sourcePlatform && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              via {op.sourcePlatform}
            </span>
          )}
          <span className="text-[10px] uppercase font-mono text-neutral-500">{op.dao}</span>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
            op.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
            op.status === "voting" ? "bg-brand-purple/10 text-brand-purple" :
            "bg-orange-500/10 text-orange-500"
          )}>
            {op.status}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-text-main group-hover:text-brand-blue transition-colors leading-tight">{op.title}</h3>
          <button 
            onClick={onToggleSave}
            className={cn(
              "p-2 rounded-lg border transition-all active:scale-95 shrink-0",
              isSaved 
                ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue shadow-lg shadow-brand-blue/10" 
                : "bg-card-bg border-border-main text-neutral-500 hover:text-brand-blue hover:border-brand-blue/30"
            )}
            title={isSaved ? "Remove from saved" : "Save opportunity"}
          >
            <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {op.tags.map((t: string) => (
            <span key={t} className="text-[10px] font-mono text-neutral-500 uppercase border border-border-main px-1.5 rounded">{t}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center gap-4 md:gap-8 md:px-8 border-t md:border-t-0 md:border-l border-border-main pt-4 md:pt-0 w-full md:w-auto">
        <div className="shrink-0 md:text-right">
          <div className="text-[10px] md:text-sm font-mono text-neutral-500 lowercase">Reward</div>
          <div className="text-base md:text-xl font-mono font-bold text-brand-blue tracking-tight">{formatReward(op.reward)}</div>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="text-[10px] md:text-sm font-mono text-neutral-500 lowercase">Deadline</div>
          <div className="text-xs md:text-sm font-bold text-text-main">{op.deadline}</div>
        </div>
        <div className="shrink-0 sm:col-span-1 col-span-2 md:text-right">
          <div className="text-[10px] md:text-sm font-mono text-neutral-500 lowercase">Activity</div>
          <div className="text-xs md:text-sm font-bold text-emerald-500">{op.activityScore}%</div>
        </div>
      </div>
    </div>
  );
}

const OpGridCard: React.FC<{ op: Opportunity, isSaved: boolean, onToggleSave: (e: React.MouseEvent) => void }> = ({ op, isSaved, onToggleSave }) => {
  return (
    <div className="bloomberg-card group cursor-pointer flex flex-col justify-between h-full relative">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider">{op.type}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold text-brand-blue tracking-tighter">{formatReward(op.reward)}</span>
            <button 
              onClick={onToggleSave}
              className={cn(
                "p-2 rounded-lg border transition-all active:scale-95",
                isSaved 
                  ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue shadow-lg shadow-brand-blue/10" 
                  : "bg-card-bg border-border-main text-neutral-500 hover:text-brand-blue hover:border-brand-blue/30"
              )}
              title={isSaved ? "Remove from saved" : "Save opportunity"}
            >
              <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
            op.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
            op.status === "voting" ? "bg-brand-purple/10 text-brand-purple" :
            "bg-orange-500/10 text-orange-500"
          )}>
            {op.status}
          </span>
          <span className="text-[10px] uppercase font-mono text-neutral-500">{op.dao}</span>
          {op.sourcePlatform && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              via {op.sourcePlatform}
            </span>
          )}
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
        <div>Score: {op.activityScore}%</div>
      </div>
    </div>
  );
}
