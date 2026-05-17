import React from "react";
import { User, Trophy, Shield, Zap, Search, Wallet, ExternalLink, Activity, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Intelligence() {
  return (
    <div className="space-y-8 md:space-y-12 max-w-5xl mx-auto py-6 md:py-8 px-1 md:px-0 animate-in fade-in duration-700">
      {/* Search Contributor */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-5xl font-display font-bold tracking-tight text-text-main leading-tight">Contributor Intelligence</h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-sm md:text-base px-4">Analyze reputations, participation history, and ecosystem signals across the DAO landscape.</p>
        
        <div className="max-w-2xl mx-auto relative group mt-8 px-4 md:px-0">
          <span className="absolute left-8 md:left-4 top-1/2 -translate-y-1/2 flex items-center text-neutral-500 group-focus-within:text-brand-blue transition-colors">
            <Sparkles className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search wallet or ENS..." 
            className="w-full bg-card-bg border border-border-main rounded-2xl py-4 md:py-5 pl-12 pr-4 focus:outline-none focus:border-brand-blue/50 transition-all font-medium text-sm md:text-lg text-text-main placeholder:text-neutral-500" 
          />
        </div>
      </div>

      {/* Featured Profile (Mocked) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 px-4">
          <Activity className="w-3 h-3 text-brand-blue" /> 
          Featured Contributor Signal
        </div>

        <div className="bloomberg-card p-4 md:p-8 border-border-main m-4 md:m-0">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-brand-blue to-indigo-700 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-brand-blue/20 mx-auto md:mx-0">
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-text-main">explorer.eth</h2>
                  <p className="text-sm font-mono text-neutral-500 mt-1">0x71C...4921</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-6 py-2.5 bg-brand-blue rounded-md text-sm font-bold text-white hover:bg-brand-blue/90 transition-all">Follow Signal</button>
                  <button className="p-2.5 bg-card-bg border border-border-main rounded-md hover:bg-card-hover transition-all">
                    <ExternalLink className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4 border-t border-border-main">
                <ScoreItem label="Reputation" value="94" />
                <ScoreItem label="Participation" value="82" />
                <ScoreItem label="Governance" value="68" />
                <ScoreItem label="Reliability" value="98%" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-border-main">
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-text-main">
                <Shield className="w-4 h-4 text-brand-blue" />
                DAO Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge label="Core Developer" />
                <Badge label="Governance Pro" />
                <Badge label="Security Audit" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-text-main">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Recent Contributions
              </h3>
              <div className="space-y-3">
                <ContributionItem title="Smart Contract Optimizer" dao="ZeroAuth" reward="$4,500" date="Oct 24" />
                <ContributionItem title="Frontend UI Overhaul" dao="DeveloperDAO" reward="$1,200" date="Oct 12" />
                <ContributionItem title="ZKP Research Paper" dao="PrivacyDAO" reward="Grant" date="Sep 28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreItem({ label, value }: any) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-bold tracking-tight text-text-main">{value}</div>
    </div>
  );
}

function Badge({ label }: any) {
  return (
    <span className="px-3 py-1 bg-card-bg border border-border-main rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-400">
      {label}
    </span>
  );
}

function ContributionItem({ title, dao, reward, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-card-bg border border-border-main rounded-xl hover:border-brand-blue/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand-blue/5 border border-brand-blue/20">
          <Zap className="w-4 h-4 text-brand-blue" />
        </div>
        <div>
          <div className="text-sm font-bold text-text-main group-hover:text-brand-blue transition-colors">{title}</div>
          <div className="text-[10px] text-neutral-500 uppercase font-mono tracking-tighter">{dao}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-text-main tracking-tight">{reward}</div>
        <div className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">{date}</div>
      </div>
    </div>
  );
}
