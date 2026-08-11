import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  Settings,
  ShoppingCart,
  Plus
} from 'lucide-react';

export default function Sidebar({ activePage }) {
  return (
    <aside className="w-64 bg-white dark:bg-[#0A0A0A] border-r border-[#EBE6E0] dark:border-white/10 flex flex-col p-4 shrink-0 h-full z-20 transition-colors duration-300 print:hidden">
      
      <div className="flex items-center gap-3 mb-10 px-2 mt-2">
        <div className="w-9 h-9 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] flex items-center justify-center rounded-xl font-extrabold text-lg transition-colors">
          L
        </div>
        <span className="text-xl font-extrabold tracking-wide text-[#0F0E0D] dark:text-white transition-colors">LUSTRE</span>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
        <p className="px-2 text-[10px] font-bold text-[#0F0E0D]/40 dark:text-white/40 mb-3 uppercase tracking-[0.25em] transition-colors">
          Main Menu
        </p>
        
        <NavItem 
          icon={<LayoutDashboard size={20} strokeWidth={2.5} />} 
          label="Overview" 
          path="/overview"
          active={activePage === 'Overview'} 
        />
        <NavItem 
          icon={<BarChart3 size={20} strokeWidth={2.5} />} 
          label="Analytics" 
          path="/analytics" 
          active={activePage === 'Analytics'} 
        />
        <NavItem 
          icon={<ShoppingBag size={20} strokeWidth={2.5} />} 
          label="Product" 
          path="/products"
          active={activePage === 'Product'} 
        />
        <NavItem 
          icon={<ShoppingCart size={20} strokeWidth={2.5} />} 
          label="Orders" 
          path="/orders"
          active={activePage === 'Orders'} 
        />
        <NavItem 
          icon={<CreditCard size={20} strokeWidth={2.5} />} 
          label="Sales" 
          path="/sales"
          active={activePage === 'Sales'} 
        />
        <NavItem 
          icon={<Plus size={20} strokeWidth={2.5} />} 
          label="Add Order" 
          path="/add-order"
          active={activePage === 'AddOrder'} 
        />
      </nav>
      
      <div className="mt-auto pt-4 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
        <NavItem 
          icon={<Settings size={20} strokeWidth={2.5} />} 
          label="Setting" 
          path="/settings" 
          active={activePage === 'Setting'} 
        />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, path, active }) {
  return (
    <Link to={path} className={`
      flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] cursor-pointer transition-all duration-300 text-sm font-bold tracking-wide
      ${active 
        ? 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_-5px_rgba(255,255,255,0.1)]' 
        : 'text-[#0F0E0D]/60 dark:text-white/60 hover:bg-[#EBE6E0]/50 dark:hover:bg-white/5 hover:text-[#0F0E0D] dark:hover:text-white'}
    `}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}