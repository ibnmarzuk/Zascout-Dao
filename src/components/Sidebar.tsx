import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Compass, Trophy, User, Bookmark, BarChart3, Settings, LogOut, Search, X, HelpCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { LogoIcon } from "./Header";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Compass, label: "Explorer", path: "/explorer" },
  { icon: Trophy, label: "Bounties", path: "/bounties" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: User, label: "Intelligence", path: "/intelligence" },
  { icon: Bookmark, label: "Saved Items", path: "/saved" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 bg-brand-charcoal border-r border-border-main flex flex-col h-screen fixed left-0 top-0 z-[60] transition-all duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-8">
          <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex h-10 w-10 items-center justify-center rounded overflow-hidden group-hover:scale-110 transition-transform">
              <LogoIcon className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-main font-display uppercase italic">ZA Scout</span>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-neutral-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "nav-item",
                location.pathname === item.path && "nav-item-active"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("trigger-onboarding"));
              onClose?.();
            }}
            className="nav-item w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-neutral-500 hover:bg-card-hover hover:text-text-main transition-all mt-4 border-t border-border-main/50 pt-4"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Restart Tour</span>
          </button>
        </nav>

        <div className="border-t border-border-main p-4">
          <div className="mb-4 rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-4 ring-1 ring-border-main border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-main flex items-center gap-1">
                ZAScout <span className="bg-brand-blue text-white px-1.5 py-0.5 rounded text-[8px]">PRO</span>
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 mb-3 leading-relaxed">Unlock advanced AI scouting, API alerts, and Team Workspaces.</p>
            <button className="w-full rounded bg-card-bg border border-brand-blue/30 py-1.5 text-[10px] font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
              Upgrade Plan
            </button>
          </div>
          
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-white text-brand-charcoal py-2.5 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
            Connect Wallet
          </button>
        </div>
      </aside>
    </>
  );
}
