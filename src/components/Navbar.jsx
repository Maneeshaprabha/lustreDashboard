import React from "react";
import { Search, Calendar, TrendingUp } from "lucide-react";
import ThemeToggle from "./ThemeToggle"; 

export default function Navbar({ title }) {
  return (
    <header className="h-[72px] shrink-0 flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#EBE6E0] dark:border-white/10 z-10 sticky top-0 transition-colors duration-300 print:hidden">
      
      <div className="min-w-0">
        <h1 className="text-xl font-extrabold tracking-tight text-[#0F0E0D] dark:text-white truncate transition-colors">
          {title}
        </h1>
      </div>

      <div className="flex gap-4 items-center shrink-0">
        
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={16} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FBF9F6] dark:bg-white/5 border border-transparent rounded-[1.5rem] text-sm focus:bg-white dark:focus:bg-[#111111] focus:border-[#0F0E0D]/20 dark:focus:border-white/20 outline-none transition-all font-bold placeholder:text-[#0F0E0D]/40 dark:placeholder:text-white/40 text-[#0F0E0D] dark:text-white shadow-inner"
          />
        </div>

        {/* Current Profit Pill */}
        <div className="hidden lg:flex px-4 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-xs uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_5px_15px_-5px_rgba(0,0,0,0.02)]">
          <TrendingUp size={14} strokeWidth={2.5} className="text-[#2E4A35] dark:text-green-400" />
          <span>$124,563</span>
        </div>

        {/* Date Pill */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-xs uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_5px_15px_-5px_rgba(0,0,0,0.02)]">
          <Calendar size={14} strokeWidth={2.5} className="text-[#0F0E0D]/70 dark:text-white/70" />
          <span>Aug 2026</span>
        </div>

        {/* --- THEME TOGGLE BUTTON --- */}
        <ThemeToggle />

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-[#EBE6E0] dark:border-white/10 pl-4 ml-1 cursor-pointer group transition-colors">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-[#EBE6E0] dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform object-cover"
          />
          <div className="text-sm hidden md:block">
            <p className="font-extrabold tracking-tight leading-none text-[#0F0E0D] dark:text-white transition-colors">Kamisato Aya</p>
            <p className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] mt-1.5 font-bold uppercase tracking-[0.2em] transition-colors">Manager</p>
          </div>
        </div>

      </div>
    </header>
  );
}