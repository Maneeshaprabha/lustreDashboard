import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  Settings,
  ShoppingCart,
  Plus,
  Layers,
  Receipt,
  X
} from 'lucide-react';

export default function Sidebar({ activePage, isOpen, onClose }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0A0A0A] border-r border-[#EBE6E0] dark:border-white/10 flex flex-col p-4 shrink-0 h-full transition-transform duration-300 ease-in-out print:hidden
      md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      
      <div className="flex items-center justify-between mb-10 px-2 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] flex items-center justify-center rounded-xl font-extrabold text-lg transition-colors">
            L
          </div>
          <span className="text-xl font-extrabold tracking-wide text-[#0F0E0D] dark:text-white transition-colors">LUSTRE</span>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white transition-colors"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide pr-2">
        <p className="px-2 text-[10px] font-bold text-[#0F0E0D]/40 dark:text-white/40 mb-3 uppercase tracking-[0.25em] transition-colors">
          Main Menu
        </p>
        
        <NavItem icon={<LayoutDashboard size={20} strokeWidth={2.5} />} label="Overview" path="/overview" active={activePage === 'Overview'} onClick={onClose} />
        <NavItem icon={<BarChart3 size={20} strokeWidth={2.5} />} label="Analytics" path="/analytics" active={activePage === 'Analytics'} onClick={onClose} />
        <NavItem icon={<ShoppingBag size={20} strokeWidth={2.5} />} label="Products" path="/products" active={activePage === 'Product'} onClick={onClose} />
        <NavItem icon={<Layers size={20} strokeWidth={2.5} />} label="Categories" path="/categories" active={activePage === 'Categories'} onClick={onClose} />
        <NavItem icon={<ShoppingCart size={20} strokeWidth={2.5} />} label="Orders" path="/orders" active={activePage === 'Orders'} onClick={onClose} />
        <NavItem icon={<CreditCard size={20} strokeWidth={2.5} />} label="Sales" path="/sales" active={activePage === 'Sales'} onClick={onClose} />
        <NavItem icon={<Receipt size={20} strokeWidth={2.5} />} label="Extra Bills" path="/expenses" active={activePage === 'Expenses'} onClick={onClose} />
        <NavItem icon={<Plus size={20} strokeWidth={2.5} />} label="Add Order" path="/add-order" active={activePage === 'AddOrder'} onClick={onClose} />
      </nav>
      
      <div className="mt-auto pt-4 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
        <NavItem icon={<Settings size={20} strokeWidth={2.5} />} label="Settings" path="/settings" active={activePage === 'Setting'} onClick={onClose} />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, path, active, onClick }) {
  return (
    <Link 
      to={path} 
      onClick={onClick} // Closes the mobile menu when a link is clicked
      className={`
        flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] cursor-pointer transition-all duration-300 text-sm font-bold tracking-wide
        ${active 
          ? 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_-5px_rgba(255,255,255,0.1)]' 
          : 'text-[#0F0E0D]/60 dark:text-white/60 hover:bg-[#EBE6E0]/50 dark:hover:bg-white/5 hover:text-[#0F0E0D] dark:hover:text-white'}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}