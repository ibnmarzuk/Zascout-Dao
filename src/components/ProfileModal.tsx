import React, { useState } from "react";
import { X, Wallet, Bell, ChevronRight, Plus, MapPin, Globe, Twitter, Github } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "wallets" | "notifications">("general");
  const [wallets, setWallets] = useState(["0x71C...4f9a"]);

  const addWallet = () => {
    const newWallet = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
    setWallets([...wallets, newWallet]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card-bg border border-border-main rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-main shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-blue/30 p-0.5">
                  <img src="https://api.dicebear.com/7.x/identicon/svg?seed=za-scout" alt="avatar" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main font-display">User Profile</h2>
                  <p className="text-xs text-neutral-500">Manage your identity and preferences</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-card-hover rounded-full transition-colors text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-border-main p-4 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-x-visible shrink-0">
                {[
                  { id: "general", label: "General", icon: Globe },
                  { id: "wallets", label: "Wallets", icon: Wallet },
                  { id: "notifications", label: "Notifications", icon: Bell },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2 rounded-xl text-[10px] md:text-sm font-bold transition-all whitespace-nowrap",
                      activeTab === tab.id ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" : "text-neutral-500 hover:bg-card-hover hover:text-text-main"
                    )}
                  >
                    <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
                {activeTab === "general" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Display Name</label>
                        <input type="text" defaultValue="Scout Navigator" className="w-full bg-card-hover border border-border-main rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-brand-blue focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input type="text" defaultValue="Global" className="w-full bg-card-hover border border-border-main rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:border-brand-blue focus:outline-none" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Bio</label>
                      <textarea className="w-full bg-card-hover border border-border-main rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-brand-blue focus:outline-none h-24 resize-none" defaultValue="Ecosystem analyst diving deep into Zero Authority data." />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Linked Accounts</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center gap-3 p-3 rounded-xl bg-card-hover border border-border-main hover:border-brand-blue transition-all group">
                          <Github className="w-5 h-5 text-neutral-500 group-hover:text-text-main" />
                          <span className="text-xs font-bold text-neutral-500 group-hover:text-text-main">GitHub</span>
                          <ChevronRight className="w-4 h-4 ml-auto text-neutral-700" />
                        </button>
                        <button className="flex items-center gap-3 p-3 rounded-xl bg-card-hover border border-border-main hover:border-brand-blue transition-all group">
                          <Twitter className="w-5 h-5 text-neutral-500 group-hover:text-text-main" />
                          <span className="text-xs font-bold text-neutral-500 group-hover:text-text-main">Twitter</span>
                          <ChevronRight className="w-4 h-4 ml-auto text-neutral-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "wallets" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      {wallets.map((wallet, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-card-hover border border-border-main rounded-2xl group transition-all hover:border-brand-blue/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                              <Wallet className="w-4 h-4 text-brand-blue" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-text-main">{wallet}</p>
                              <p className="text-[10px] text-neutral-500">{idx === 0 ? "Primary Wallet" : "Secondary Wallet"}</p>
                            </div>
                          </div>
                          <button className="text-[10px] font-bold text-neutral-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">Disconnect</button>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={addWallet}
                      className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border-main rounded-2xl text-neutral-500 hover:text-brand-blue hover:border-brand-blue transition-all font-bold text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Connect More Wallets
                    </button>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      {[
                        { title: "Opportunity Alerts", desc: "Get notified when new grants or bounties match your skills." },
                        { title: "Status Updates", desc: "Receive updates on items you've bookmarked or applied for." },
                        { title: "Ecosystem Signals", desc: "Weekly digests of trending DAO activity and funding surges." },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-card-hover border border-border-main">
                          <div>
                            <h4 className="text-sm font-bold text-text-main mb-1">{item.title}</h4>
                            <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                          </div>
                          <div className="shrink-0">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 2} />
                              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-border-main flex justify-end gap-3 bg-brand-charcoal/50 shrink-0">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-neutral-500 hover:text-text-main transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:scale-[1.02] transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
