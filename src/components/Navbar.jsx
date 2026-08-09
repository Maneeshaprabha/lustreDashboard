import React from 'react';
import { Search, Calendar } from 'lucide-react';

export default function Navbar({ title = 'Dashboard Overview' }) {
  return (
    // Changed to h-16 for a more compact, modern size that matches your action headers
    <header className="h-16 flex items-center justify-between px-8 bg-white/60 backdrop-blur-md sticky top-0 z-10 border-b border-[#C4BEB6]/20 w-full">
      <div className="flex items-center gap-4 text-xl font-bold text-[#1A1A1A]">
        <span>{title}</span>
      </div>
      
      <div className="flex gap-3 items-center">
        
        {/* Search Bar matching your exact pasted style */}
        <div className="relative hidden md:block md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-11 pr-4 py-2 bg-white border border-[#C4BEB6]/40 rounded-full text-sm focus:border-[#1A1A1A]/30 focus:ring-2 focus:ring-[#1A1A1A]/5 outline-none transition-all font-medium placeholder:text-[#1A1A1A]/40 text-[#1A1A1A]"
          />
        </div>
        
        {/* Calendar widget updated to match your Filter button sizing */}
        <div className="px-4 py-2 bg-white border border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-[#C4BEB6]/10 transition-colors flex items-center gap-2 cursor-pointer">
          <Calendar size={16} className="text-[#1A1A1A]/70" />
          <span>Aug 2026</span>
        </div>
        
        {/* Profile Section scaled perfectly for the new height */}
        <div className="flex items-center gap-3 border-l border-[#C4BEB6]/30 pl-4 ml-1 cursor-pointer group">
          <img 
            src="https://i.pravatar.cc/100?img=32" 
            alt="Profile" 
            className="w-9 h-9 rounded-full border border-[#C4BEB6]/40 shadow-sm group-hover:scale-105 transition-transform" 
          />
          <div className="text-sm hidden md:block">
            <p className="font-bold leading-none text-[#1A1A1A]">Kamisato Aya</p>
            <p className="text-[#1A1A1A]/50 text-[10px] mt-0.5 font-bold uppercase tracking-wider">Manager</p>
          </div>
        </div>
        
      </div>
    </header>
  );
}