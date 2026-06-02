import React, { useState } from "react";
import { Bell, Check, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "bounty" | "proposal" | "system";
  unread: boolean;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "bounties" | "proposals">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Bounty Match",
      description: "A new React and Web3 smart contract integration bounty was just posted by Developer DAO.",
      time: "10m ago",
      type: "bounty",
      unread: true,
    },
    {
      id: "2",
      title: "Proposal Update",
      description: "Governance Proposal #42 on Arbitrum DAO just entered the active voting phase.",
      time: "2h ago",
      type: "proposal",
      unread: true,
    },
    {
      id: "3",
      title: "Application Status",
      description: "Your application for the 'Frontend Optimization' bounty is under review.",
      time: "1d ago",
      type: "bounty",
      unread: false,
    },
    {
      id: "4",
      title: "System Update",
      description: "Zero Authority database synchronization complete.",
      time: "2d ago",
      type: "system",
      unread: false,
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "bounties") return n.type === "bounty";
    if (activeTab === "proposals") return n.type === "proposal";
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'bounty': return <TrendingUp className="w-4 h-4 text-brand-blue" />;
      case 'proposal': return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case 'system': return <RefreshCw className="w-4 h-4 text-neutral-400" />;
      default: return <Bell className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-main bg-card-bg text-neutral-400 hover:text-brand-blue transition-all relative outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-brand-charcoal animate-pulse" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-80 md:w-96 rounded-xl border border-border-main bg-card-bg shadow-2xl overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-main bg-card-hover/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-main">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-brand-blue/20 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-neutral-500 hover:text-brand-blue font-medium transition-colors">
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="flex px-4 py-2 bg-card-hover/30 border-b border-border-main">
                <div className="flex space-x-4">
                  {(["all", "bounties", "proposals"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-xs font-medium pb-2 border-b-2 transition-colors -mb-[9px] ${activeTab === tab ? "border-brand-blue text-brand-blue" : "border-transparent text-neutral-500 hover:text-text-main"}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[22rem] overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-border-main/50 hover:bg-card-hover transition-colors cursor-pointer group ${notification.unread ? 'bg-brand-blue/5' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.unread ? 'bg-brand-blue/20' : 'bg-card-hover border border-border-main'}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-bold truncate ${notification.unread ? 'text-text-main' : 'text-neutral-300'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-neutral-500 whitespace-nowrap pt-0.5">
                              {notification.time}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${notification.unread ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {notification.description}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="shrink-0 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[10px] text-brand-blue font-semibold bg-brand-blue/10 px-2 py-1 rounded hover:bg-brand-blue/20">
                              Got it
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-card-hover border border-border-main flex items-center justify-center mx-auto mb-3">
                      <Check className="w-5 h-5 text-neutral-500" />
                    </div>
                    <p className="text-sm font-medium text-neutral-400">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
