import React, { useState } from "react";
import { Search, Bell, Wallet, Sun, Moon, X, Menu, Sparkles, Compass, ChevronDown, Check, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/ThemeContext";
import ProfileModal from "./ProfileModal";

export const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Search className="absolute w-full h-full text-brand-blue/80" />
    <TrendingUp className="absolute w-2/3 h-2/3 text-brand-blue -translate-y-1 translate-x-1" strokeWidth={3} />
  </div>
);

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");

  return (
    <header className="h-16 border-b border-border-main bg-brand-charcoal/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex flex-1 items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-neutral-500 hover:text-brand-blue"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <Link to="/" className="lg:hidden flex items-center gap-2 shrink-0 mr-2">
          <LogoIcon className="w-7 h-7 object-contain" />
        </Link>

        {/* Workspace Switcher */}
        <div className="hidden lg:relative lg:block mr-2 z-50">
          <button 
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-main hover:bg-card-hover transition-colors"
          >
            <span className="text-xs font-semibold text-text-main">{currentWorkspace}</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>
          
          {isWorkspaceOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-border-main bg-card-bg shadow-xl py-1">
              <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Workspaces</div>
              <WorkspaceItem name="Personal" current={currentWorkspace} onClick={() => { setCurrentWorkspace("Personal"); setIsWorkspaceOpen(false); }} />
              <WorkspaceItem name="MetaAgency DAO" current={currentWorkspace} onClick={() => { setCurrentWorkspace("MetaAgency DAO"); setIsWorkspaceOpen(false); }} />
              <WorkspaceItem name="Builder Team" current={currentWorkspace} onClick={() => { setCurrentWorkspace("Builder Team"); setIsWorkspaceOpen(false); }} />
              <div className="h-px bg-border-main my-1" />
              <button className="w-full text-left px-3 py-2 text-xs text-neutral-500 hover:text-brand-blue font-medium flex items-center gap-2">
                + Create Workspace
              </button>
            </div>
          )}
        </div>
        
        <div className="relative flex-1 max-w-xl group">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500 group-focus-within:text-brand-blue transition-colors">
            <Sparkles className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search bounties, grants, or DAOs..." 
            className="w-full rounded-full border border-border-main bg-card-hover py-2 pl-10 pr-10 text-sm focus:border-brand-blue focus:outline-none transition-all placeholder:text-neutral-500" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button 
              onClick={() => setSearchValue("")}
              className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-brand-blue transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-4">
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold hover:bg-brand-blue/20 transition-all"
        >
          <Wallet className="w-3.5 h-3.5" />
          Connect Wallet
        </button>

        <button 
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-main bg-card-bg text-neutral-400 hover:text-brand-blue transition-all"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-border-main bg-card-bg text-neutral-400 hover:text-brand-blue transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-blue border-2 border-brand-charcoal animate-pulse" />
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 md:w-80 rounded-xl border border-border-main bg-card-bg shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-main bg-card-hover/50">
                <span className="text-xs font-bold text-text-main">Notifications</span>
                <span className="text-[10px] text-brand-blue cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <NotificationItem title="Saved Search Alert" desc="5 new React bounties on DeveloperDAO." time="10m ago" unread />
                <NotificationItem title="Proposal Update" desc="Governance Dashboard Bounty has closed." time="2h ago" />
                <NotificationItem title="Zero Authority" desc="Your application for 'ZKP Research' is under review." time="1d ago" />
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="h-8 w-8 overflow-hidden rounded-full border border-border-main hover:border-brand-blue transition-all"
        >
          <img src="https://api.dicebear.com/7.x/identicon/svg?seed=za-scout" alt="avatar" />
        </button>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
}

function WorkspaceItem({ name, current, onClick }: { name: string, current: string, onClick: () => void }) {
  const isActive = name === current;
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-card-hover transition-colors"
    >
      <span className={isActive ? "text-text-main font-semibold" : "text-neutral-400"}>{name}</span>
      {isActive && <Check className="w-3 h-3 text-brand-blue" />}
    </button>
  );
}

function NotificationItem({ title, desc, time, unread = false }: { title: string, desc: string, time: string, unread?: boolean }) {
  return (
    <div className={`p-4 border-b border-border-main/50 hover:bg-card-hover transition-colors cursor-pointer ${unread ? 'bg-brand-blue/5' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-text-main">{title}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">{desc}</p>
        </div>
        <span className="text-[9px] text-neutral-500 whitespace-nowrap pt-0.5">{time}</span>
      </div>
    </div>
  );
}
