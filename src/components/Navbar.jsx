import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, TrendingUp, ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle"; 
import { orderService } from '../services/orderService';
import { expenseService } from '../services/expenseService';

export default function Navbar({ title, onMenuClick }) { 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic Profit & Date States
  const [totalProfit, setTotalProfit] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  // --- ALUTH: Dynamic User State ---
  const [userData, setUserData] = useState({
    name: "Admin User",
    role: "Manager",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0F0E0D&color=fff"
  });

  useEffect(() => {
    // 1. Get Logged In User Data
    const loadUserData = () => {
      try {
        // Assume user data is saved in localStorage after login
        const storedUserStr = localStorage.getItem('user'); 
        
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          
          // Nama, email eken hari gannawa
          const userName = storedUser.name || storedUser.full_name || storedUser.firstName || (storedUser.email ? storedUser.email.split('@')[0] : 'Admin User');
          const userRole = storedUser.role || 'Manager';
          
          // Avatar eka naththam nama use karala auto hadanawa
          const userAvatar = storedUser.avatar || storedUser.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0F0E0D&color=fff`;

          setUserData({
            name: userName,
            role: userRole,
            avatar: userAvatar
          });
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    };

    loadUserData();

    // 2. Set dynamic exact date (e.g., "Aug 30, 2026")
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));

    // 3. Fetch and calculate total profit
    const fetchProfitData = async () => {
      try {
        const [orders, expenses] = await Promise.all([
          orderService.getAll(),
          expenseService.getAll()
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
        const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

        setTotalProfit(totalRevenue - totalExpenses);
      } catch (error) {
        console.error("Failed to fetch profit data for navbar", error);
      }
    };

    fetchProfitData();

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
    // User wa local storage eken clear karanna oni nam meka uncomment karanna:
    // localStorage.removeItem('user');
    // localStorage.removeItem('token');
    navigate('/auth'); 
  };

  return (
    <header className="h-[72px] shrink-0 flex items-center justify-between px-4 md:px-10 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#EBE6E0] dark:border-white/10 z-30 sticky top-0 transition-colors duration-300 print:hidden">
      
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-[#0F0E0D] dark:text-white hover:bg-[#EBE6E0]/50 dark:hover:bg-white/10 rounded-xl transition-colors"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
        
        <h1 className="text-xl font-extrabold tracking-tight text-[#0F0E0D] dark:text-white truncate transition-colors">
          {title}
        </h1>
      </div>

      <div className="flex gap-2 md:gap-4 items-center shrink-0">
        
        {/* Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={16} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FBF9F6] dark:bg-white/5 border border-transparent rounded-[1.5rem] text-sm focus:bg-white dark:focus:bg-[#111111] focus:border-[#0F0E0D]/20 dark:focus:border-white/20 outline-none transition-all font-bold placeholder:text-[#0F0E0D]/40 dark:placeholder:text-white/40 text-[#0F0E0D] dark:text-white shadow-inner"
          />
        </div>

        {/* Current Profit Pill (Dynamic) */}
        <div className="hidden xl:flex px-4 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-xs uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_5px_15px_-5px_rgba(0,0,0,0.02)]">
          <TrendingUp size={14} strokeWidth={2.5} className="text-[#2E4A35] dark:text-green-400" />
          <span>${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* Date Pill (Dynamic Full Date) */}
        <div className="hidden sm:flex px-4 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-xs uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_5px_15px_-5px_rgba(0,0,0,0.02)]">
          <Calendar size={14} strokeWidth={2.5} className="text-[#0F0E0D]/70 dark:text-white/70" />
          <span>{currentDate}</span>
        </div>

        {/* --- THEME TOGGLE BUTTON --- */}
        <ThemeToggle />

        {/* User Profile & Dropdown (Dynamic) */}
        <div className="relative md:ml-1 md:pl-4 border-l border-transparent md:border-[#EBE6E0] dark:md:border-white/10 transition-colors" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer group pl-2 md:pl-0"
          >
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#EBE6E0] dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform object-cover"
            />
            <div className="text-sm hidden md:block">
              <p className="font-extrabold tracking-tight leading-none text-[#0F0E0D] dark:text-white transition-colors">{userData.name}</p>
              <p className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] mt-1.5 font-bold uppercase tracking-[0.2em] transition-colors">{userData.role}</p>
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
                  <p className="font-extrabold text-[#0F0E0D] dark:text-white transition-colors">{userData.name}</p>
                  <p className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors">{userData.role}</p>
                </div>

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