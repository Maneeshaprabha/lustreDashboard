import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // 1. Import Link from React Router
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  Settings 
} from 'lucide-react';

export default function Sidebar({ activePage = 'Overview' }) {
  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-[#C4BEB6]/30 flex flex-col p-4 z-20 shrink-0 h-screen"
    >
      <div className="flex items-center gap-3 mb-10 px-2 mt-2">
        <div className="w-8 h-8 bg-[#1A1A1A] text-[#E9E3DB] flex items-center justify-center rounded-lg font-bold">
          L
        </div>
        <span className="text-xl font-extrabold tracking-wide text-[#3d352e]">LUSTRE</span>
      </div>

      <nav className="flex-1 space-y-1.5">
        <p className="px-2 text-[10px] font-bold text-[#1A1A1A]/40 mb-3 uppercase tracking-widest">
          Main Menu
        </p>
        {/* 2. Add 'path' props mapped to your App.jsx routes */}
        <NavItem 
          icon={<LayoutDashboard size={20} strokeWidth={2} />} 
          label="Overview" 
          path="/overview"
          active={activePage === 'Overview'} 
        />
        <NavItem 
          icon={<BarChart3 size={20} strokeWidth={2} />} 
          label="Analytics" 
          path="/analytics" /* Linking to analytics route */
          active={activePage === 'Analytics'} 
        />
        <NavItem 
          icon={<ShoppingBag size={20} strokeWidth={2} />} 
          label="Product" 
          path="/products"
          active={activePage === 'Product'} 
        />
        <NavItem 
          icon={<CreditCard size={20} strokeWidth={2} />} 
          label="Sales" 
          path="/sales" /* Linking to sales route */
          active={activePage === 'Sales'} 
        />
      </nav>
      
      <div className="mt-auto">
        <NavItem 
          icon={<Settings size={20} strokeWidth={2} />} 
          label="Setting" 
          path="/overview" /* Linking to overview for now */
          active={activePage === 'Setting'} 
        />
      </div>
    </motion.aside>
  );
}

// 3. Change NavItem from a <div> to a React Router <Link>
function NavItem({ icon, label, path, active = false }) {
  return (
    <Link to={path} className={`
      flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 text-sm font-bold
      ${active ? 'bg-[#1A1A1A] text-[#E9E3DB] shadow-md' : 'text-[#1A1A1A]/60 hover:bg-[#C4BEB6]/20 hover:text-[#1A1A1A]'}
    `}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}