import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Users, DollarSign, Clock, ArrowRight, ExternalLink, Bookmark } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import { cn } from "@/src/lib/utils";

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [trendingSkills, setTrendingSkills] = useState(["Rust", "ZKP", "Solidity"]);

  useEffect(() => {
    axios.get("/api/dao/opportunities")
      .then(res => {
        setOpportunities(res.data);
        setLoading(false);
      });
  }, []);

  const handleAISubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiQuery.trim() || aiLoading) return;

    setAiLoading(true);
    try {
      const res = await axios.post("/api/ai/discover", { query: aiQuery });
      if (res.data.summary) {
        setAiInsight(res.data.summary);
      }
      if (res.data.keywords) {
        setTrendingSkills(res.data.keywords.slice(0, 3));
      }
    } catch (error) {
      // Handle silently in production
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 md:px-0">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-main leading-tight">Good morning, Explorer</h1>
          <p className="text-neutral-500 mt-1 text-sm md:text-base">Here is what's happening today.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="px-4 py-2 bg-brand-blue/5 border border-brand-blue/20 rounded-md text-[10px] md:text-sm font-medium flex items-center gap-2 w-full md:w-auto justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            24 New Opportunities
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Grants" value="142" subValue="+$2.4M Volume" icon={DollarSign} />
        <StatCard label="Open Bounties" value="58" subValue="12 added today" icon={TrendingUp} />
        <StatCard label="Total Contributors" value="1,204" subValue="Active Reputation" icon={Users} />
        <StatCard label="Gov Proposals" value="34" subValue="Avg. Consensus 82%" icon={Clock} />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Alerts & Workflows + Trending Ops */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SaaS Specific: Saved Workflows / Alerts */}
          <div className="rounded-2xl border border-border-main bg-card-bg p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main">Your Automation is Active</h3>
                <p className="text-xs text-neutral-500">Auto-applying to "React" specific bounties under DevDAO.</p>
              </div>
            </div>
            <button className="text-[10px] uppercase tracking-wider font-bold text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg hover:bg-brand-blue hover:text-white transition-colors">
              Manage Workflows
            </button>
          </div>

          <div className="flex items-center justify-between mt-8 mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-text-main">
              <Sparkles className="w-5 h-5 text-brand-blue" />
              Trending Opportunities
            </h2>
            <button className="text-sm font-medium text-brand-blue hover:underline">View all</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-32 bg-card-hover animate-pulse rounded-lg border border-border-main" />)
            ) : (
              opportunities.map((op) => (
                <OpCard key={op.id} op={op} />
              ))
            )}
          </div>
        </div>

        {/* Right: AI Assistant & Feed */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-700 p-[1px] shadow-2xl shadow-brand-blue/20">
            <div className="h-full rounded-2xl bg-card-bg p-5">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                <h3 className="text-sm font-bold text-text-main uppercase tracking-tight">AI Scout Insight</h3>
              </div>
              
              <div className={cn("transition-all duration-500", aiLoading ? "opacity-50 blur-sm" : "opacity-100 blur-0")}>
                <p className="text-xs italic text-neutral-500 leading-relaxed font-serif">
                  {aiInsight || (
                    `"The ecosystem is currently seeing a surge in ${opportunities?.[0]?.tags?.[0] || 'DeFi'}-focused grant proposals. Top performers are pivoting toward ${opportunities?.[1]?.tags?.[1] || 'infrastructure'} solutions."`
                  )}
                </p>
              </div>

              <div className="mt-4 border-t border-border-main pt-4">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase">Top Trending Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {trendingSkills.map(skill => (
                    <span key={skill} className="rounded bg-brand-blue/10 border border-brand-blue/20 px-2 py-1 text-[9px] text-brand-blue">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <form onSubmit={handleAISubmit} className="relative">
                  <input 
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask Scout anything..." 
                    className="w-full bg-card-hover border border-border-main rounded-lg py-3 px-4 text-xs focus:outline-none focus:border-brand-blue transition-all pr-12 text-text-main placeholder:text-neutral-500"
                    disabled={aiLoading}
                  />
                  <button 
                    type="submit"
                    disabled={aiLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-blue p-1.5 rounded-md hover:bg-brand-blue/80 transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-text-main tracking-tight uppercase text-xs">Recent Ecosystem Activity</h3>
            <div className="space-y-6">
              <ActivityItem 
                title="PrivacyDAO" 
                desc="New Governance Proposal: ZKP Integration" 
                time="2h ago" 
                color="blue"
              />
              <ActivityItem 
                title="ZeroAuth" 
                desc="Bounty Completed: Security Audit v2" 
                time="5h ago" 
                color="purple"
              />
              <ActivityItem 
                title="DeveloperDAO" 
                desc="Grant Approved: AI Dashboard Tooling" 
                time="8h ago" 
                color="green"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, icon: Icon }: { label: string, value: string, subValue: string, icon: React.ElementType }) {
  return (
    <div className="stats-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{label}</p>
        <Icon className="w-3 h-3 text-brand-blue opacity-50" />
      </div>
      <p className="text-2xl font-semibold text-text-main">{value}</p>
      <p className="mt-1 text-[10px] text-brand-blue font-bold tracking-tight">{subValue}</p>
    </div>
  );
}

interface Opportunity {
  id: string;
  type: string;
  title: string;
  dao: string;
  tags: string[];
  reward: number | string;
  deadline: string;
  sourcePlatform?: string;
}

const OpCard: React.FC<{ op: Opportunity }> = ({ op }) => {
  const isBounty = op.type === 'bounty';
  const isGrant = op.type === 'grant';
  const isProposal = op.type === 'proposal';

  const formatReward = (reward: number | string) => {
    if (typeof reward === 'string') return reward;
    if (reward === 0) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(reward);
  };

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(37,99,235,0.08)" }}
      className={cn(
        "group relative rounded-2xl border border-border-main bg-card-bg p-5 transition-all hover:bg-card-hover hover:shadow-xl",
        isGrant && "hover:border-brand-blue/50",
        isBounty && "hover:border-brand-purple/50",
        isProposal && "hover:border-emerald-500/50"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            isGrant && "bg-brand-blue/10 text-brand-blue",
            isBounty && "bg-brand-purple/10 text-brand-purple",
            isProposal && "bg-emerald-500/10 text-emerald-500"
          )}>
            {op.type.toUpperCase()}
          </span>
          {op.sourcePlatform && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              via {op.sourcePlatform}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-neutral-600">ID: ZA-{op.id}</span>
      </div>
      <h3 className="text-md font-semibold text-text-main group-hover:text-brand-blue transition-colors">{op.title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500 line-clamp-2">
        Curated {op.type} from {op.dao} focusing on {op.tags.join(', ')}.
      </p>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-600 uppercase tracking-tighter">Reward</span>
          <span className="text-sm font-bold text-text-main tracking-tight">{formatReward(op.reward)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-600 uppercase tracking-tighter">Deadline</span>
            <span className="text-[10px] font-bold text-neutral-400">{op.deadline}</span>
          </div>
          <button className="text-[10px] text-text-main underline underline-offset-4 decoration-neutral-700 hover:decoration-brand-blue transition-all">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityItem({ title, desc, time, color }: { title: string, desc: string, time: string, color: 'blue' | 'purple' | 'green' }) {
  const colors: Record<'blue' | 'purple' | 'green', string> = {
    blue: "bg-brand-blue",
    purple: "bg-brand-purple",
    green: "bg-green-500",
  };

  return (
    <div className="flex gap-4 group cursor-default">
      <div className="relative">
        <div className={cn("w-2 h-2 rounded-full absolute top-1.5 left-0", colors[color])} />
        <div className="w-[1px] h-full bg-white/5 absolute left-[3.5px] top-4 group-last:hidden" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider font-mono">{title}</span>
          <span className="text-[10px] text-neutral-600">{time}</span>
        </div>
        <p className="text-sm text-neutral-500 group-hover:text-text-main transition-colors">{desc}</p>
      </div>
    </div>
  );
}
