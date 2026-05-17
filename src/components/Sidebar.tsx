import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Compass, Trophy, User, Bookmark, BarChart3, Settings, LogOut, Search, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

import logo from "../assets/images/zascout_logo_1779052819094.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Compass, label: "Explorer", path: "/explorer" },
  { icon: Trophy, label: "Bounties", path: "/bounties" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: User, label: "Intelligence", path: "/intelligence" },
  { icon: Bookmark, label: "Saved Items", path: "/saved" },
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
              <img src={logo} alt="ZA Scout Logo" className="w-full h-full object-contain" />
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
        </nav>

        <div className="border-t border-border-main p-4">
          <div className="mb-4 rounded-lg bg-brand-blue/5 p-4 ring-1 ring-brand-blue/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">AI Credit Status</p>
            <div className="mt-2 h-1 w-full rounded-full bg-border-main">
              <div className="h-full w-3/4 rounded-full bg-brand-blue"></div>
            </div>
            <p className="mt-2 text-[10px] text-neutral-500 font-mono">740 / 1000 searches remaining</p>
          </div>
          
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Connect Wallet
          </button>
        </div>
      </aside>
    </>
  );
}
