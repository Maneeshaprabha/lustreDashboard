import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, TrendingUp, ChevronDown, User, Settings, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle"; 

export default function Navbar({ title }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close the dropdown if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate('/auth'); 
  };

  return (
    <header className="h-[72px] shrink-0 flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#EBE6E0] dark:border-white/10 z-50 sticky top-0 transition-colors duration-300 print:hidden">
      
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
        <div className="hidden sm:flex px-4 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-xs uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_5px_15px_-5px_rgba(0,0,0,0.02)]">
          <Calendar size={14} strokeWidth={2.5} className="text-[#0F0E0D]/70 dark:text-white/70" />
          <span>Aug 2026</span>
        </div>

        {/* --- THEME TOGGLE BUTTON --- */}
        <ThemeToggle />

        {/* User Profile & Dropdown */}
        <div className="relative ml-1 pl-4 border-l border-[#EBE6E0] dark:border-white/10 transition-colors" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="https://i.pravatar.cc/100?img=32"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-[#EBE6E0] dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform object-cover"
            />
            <div className="text-sm hidden md:block">
              <p className="font-extrabold tracking-tight leading-none text-[#0F0E0D] dark:text-white transition-colors">Kamisato Aya</p>
              <p className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] mt-1.5 font-bold uppercase tracking-[0.2em] transition-colors">Manager</p>
            </div>
            <ChevronDown 
              size={14} 
              strokeWidth={3} 
              className={`hidden md:block text-[#0F0E0D]/40 dark:text-white/40 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : "rotate-0"}`} 
            />
          </div>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 24 }}
                className="absolute right-0 mt-4 w-56 bg-white dark:bg-[#111111] rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-[#EBE6E0] dark:border-white/10 overflow-hidden py-2 transition-colors"
              >
                {/* Mobile Info */}
                <div className="md:hidden px-5 py-3 border-b border-[#EBE6E0] dark:border-white/10 mb-2 transition-colors">
                  <p className="font-extrabold text-[#0F0E0D] dark:text-white transition-colors">Kamisato Aya</p>
                  <p className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors">Manager</p>
                </div>

                {/* NOTE THE NEW STATE PROPERTY ADDED TO THESE LINKS */}
                <Link 
                  to="/settings" 
                  state={{ targetTab: 'account' }}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-[#0F0E0D]/80 dark:text-white/80 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors"
                >
                  <User size={16} strokeWidth={2.5} /> My Profile
                </Link>
                
                <Link 
                  to="/settings" 
                  state={{ targetTab: 'security' }}
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-[#0F0E0D]/80 dark:text-white/80 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors"
                >
                  <Settings size={16} strokeWidth={2.5} /> Account Security
                </Link>
                
                <div className="h-px bg-[#EBE6E0] dark:bg-white/10 my-2 transition-colors" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-[#FFF4F4] dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} strokeWidth={2.5} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}