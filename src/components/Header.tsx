import React, { useState } from "react";
import { Search, Bell, Wallet, Sun, Moon, X, Menu, Sparkles, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../lib/ThemeContext";
import ProfileModal from "./ProfileModal";

import logo from "../assets/images/zascout_logo_1779052819094.png";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
        </Link>
        
        <div className="relative flex-1 max-w-xl group">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500 group-focus-within:text-brand-blue transition-colors">
            <Sparkles className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search..." 
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

        <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-border-main bg-card-bg text-neutral-400 hover:text-brand-blue transition-all">
          <Bell className="w-4 h-4" />
        </button>
        
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
