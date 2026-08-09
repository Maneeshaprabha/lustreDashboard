import React from "react";
import { Search, Calendar } from "lucide-react";

export default function Navbar({ title }) {
  return (
    // Added print:hidden here!
    <header className="h-[72px] shrink-0 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-[#C4BEB6]/30 z-10 sticky top-0 print:hidden">
      
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A] truncate">
          {title}
        </h1>
      </div>

      <div className="flex gap-4 items-center shrink-0">
        
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-2 bg-[#E9E3DB]/30 border border-transparent rounded-full text-sm focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-2 focus:ring-[#1A1A1A]/5 outline-none transition-all font-medium placeholder:text-[#1A1A1A]/40 text-[#1A1A1A]"
          />
        </div>

        <div className="px-4 py-2 bg-white border border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-[#C4BEB6]/10 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-sm">
          <Calendar size={16} className="text-[#1A1A1A]/70" />
          <span>Aug 2026</span>
        </div>

        <div className="flex items-center gap-3 border-l border-[#C4BEB6]/40 pl-4 ml-1 cursor-pointer group">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="Profile"
            className="w-10 h-10 rounded-full border border-[#C4BEB6]/40 shadow-sm group-hover:scale-105 transition-transform object-cover"
          />
          <div className="text-sm hidden md:block">
            <p className="font-bold leading-none text-[#1A1A1A]">Kamisato Aya</p>
            <p className="text-[#1A1A1A]/50 text-[10px] mt-1 font-bold uppercase tracking-wider">Manager</p>
          </div>
        </div>

      </div>
    </header>
  );
}