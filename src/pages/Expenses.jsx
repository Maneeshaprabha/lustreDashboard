import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, TrendingDown, Plus, Trash2, Tag, Box, X
} from 'lucide-react';

export default function Expenses() {
  // Expense Data State
  const [expenses, setExpenses] = useState([
    { id: '#EXP-001', item: 'Matte Black Courier Bags (500pcs)', category: 'Packaging', date: 'Aug 10, 2026', amount: 125.00 },
    { id: '#EXP-002', item: 'Premium Business Cards', category: 'Branding', date: 'Aug 09, 2026', amount: 85.50 },
    { id: '#EXP-003', item: 'Custom Price Tags & String', category: 'Branding', date: 'Aug 05, 2026', amount: 45.00 },
    { id: '#EXP-004', item: 'Thermal Printer Labels', category: 'Office Supplies', date: 'Aug 02, 2026', amount: 22.00 },
    { id: '#EXP-005', item: 'Branded Tissue Paper', category: 'Packaging', date: 'Jul 28, 2026', amount: 110.00 },
  ]);

  // Categories State (Dynamic)
  const [categories, setCategories] = useState(['Packaging', 'Branding', 'Office Supplies', 'Logistics', 'Miscellaneous']);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Form State
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [newAmount, setNewAmount] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Handle adding a new main expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newItem || !newAmount) return;
    
    const expense = {
      id: `#EXP-${Math.floor(100 + Math.random() * 900)}`,
      item: newItem,
      category: newCategory,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      amount: parseFloat(newAmount)
    };

    setExpenses([expense, ...expenses]);
    setNewItem('');
    setNewAmount('');
  };

  // Handle adding a brand new custom category
  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      const formattedCategory = customCategory.trim();
      setCategories([...categories, formattedCategory]);
      setNewCategory(formattedCategory); // Automatically select it
    }
    setCustomCategory('');
    setShowAddCategory(false);
  };

  const handleDelete = (idToRemove) => {
    setExpenses(expenses.filter(exp => exp.id !== idToRemove));
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Dynamic badge styling based on category
  const getCategoryStyle = (category) => {
    switch(category) {
      case 'Packaging': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] border border-transparent';
      case 'Branding': return 'bg-[#FBF9F6] dark:bg-white/10 border border-[#EBE6E0] dark:border-white/20 text-[#0F0E0D] dark:text-white';
      case 'Office Supplies': return 'bg-[#F4F8F4] dark:bg-green-500/20 text-[#2E4A35] dark:text-green-400 border border-[#E2EBE2] dark:border-green-500/30';
      default: return 'bg-[#EBE6E0]/50 dark:bg-white/5 border border-transparent text-[#0F0E0D] dark:text-white';
    }
  };

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Extra Bills & Expenses</h1>
            <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-2 transition-colors">Track packaging, branding, and operational costs</p>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Expenses" 
            value={`$${totalSpent.toFixed(2)}`} 
            trend="All Time" 
            icon={<Receipt size={24} />} 
            variants={itemVariants} 
            isDark={true} 
          />
          <StatCard 
            title="Packaging Costs" 
            value={`$${expenses.filter(e => e.category === 'Packaging').reduce((s, e) => s + e.amount, 0).toFixed(2)}`} 
            trend="Courier Bags & Boxes" 
            icon={<Box size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Branding & Marketing" 
            value={`$${expenses.filter(e => e.category === 'Branding').reduce((s, e) => s + e.amount, 0).toFixed(2)}`} 
            trend="Tags & Business Cards" 
            icon={<Tag size={24} />} 
            variants={itemVariants} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* EXPENSES TABLE (LEFT COLUMN) */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Expense History</h2>
            </div>
            
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] uppercase tracking-[0.25em] border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <th className="pb-5 font-bold">Bill ID</th>
                    <th className="pb-5 font-bold">Item Description</th>
                    <th className="pb-5 font-bold">Category</th>
                    <th className="pb-5 font-bold">Date</th>
                    <th className="pb-5 font-bold text-right">Amount</th>
                    <th className="pb-5 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <AnimatePresence>
                    {expenses.map((exp) => (
                      <motion.tr 
                        key={exp.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-[#EBE6E0]/60 dark:border-white/5 hover:bg-[#FBF9F6]/50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-5 font-mono font-bold text-[#0F0E0D]/60 dark:text-white/60 text-xs tracking-wider transition-colors">{exp.id}</td>
                        <td className="py-5 font-extrabold text-[#0F0E0D] dark:text-white text-sm tracking-tight transition-colors">{exp.item}</td>
                        <td className="py-5">
                          <span className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-1.5 w-fit transition-colors ${getCategoryStyle(exp.category)}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-5 font-medium text-[#0F0E0D]/60 dark:text-white/60 text-xs transition-colors">{exp.date}</td>
                        <td className="py-5 font-extrabold text-[#0F0E0D] dark:text-white text-right text-base transition-colors">${exp.amount.toFixed(2)}</td>
                        <td className="py-5 text-center">
                          <button 
                            onClick={() => handleDelete(exp.id)}
                            className="p-2 text-[#0F0E0D]/30 dark:text-white/30 hover:text-[#6A3131] dark:hover:text-red-400 transition-colors rounded-xl hover:bg-[#FFF4F4] dark:hover:bg-red-500/20 inline-flex opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/40 dark:text-white/40">No expenses recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ADD EXPENSE FORM (RIGHT COLUMN) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 flex flex-col h-fit transition-colors">
            <div>
              <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white mb-2 transition-colors">Record New Bill</h2>
              <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.25em] mb-8 transition-colors">Log your operational costs</p>
              
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Item Description</label>
                  <input 
                    type="text" 
                    required
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="e.g. Courier Bags" 
                    className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" 
                  />
                </div>

                <div>
                  {/* Dynamic Category Header */}
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 transition-colors">Category</label>
                    {!showAddCategory && (
                      <button 
                        type="button" 
                        onClick={() => setShowAddCategory(true)}
                        className="text-[9px] font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:opacity-70 transition-opacity"
                      >
                        + Add New
                      </button>
                    )}
                  </div>

                  {/* Toggle between Select Dropdown and Custom Input */}
                  {showAddCategory ? (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                      <input 
                        type="text" 
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="New Category" 
                        autoFocus
                        className="flex-1 bg-[#FBF9F6] dark:bg-white/5 px-4 py-4 rounded-2xl border border-[#0F0E0D] dark:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" 
                      />
                      <button 
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="px-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                      >
                        Add
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowAddCategory(false)}
                        className="px-3 bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white rounded-2xl hover:bg-[#EBE6E0] dark:hover:bg-white/20 transition-colors"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </motion.div>
                  ) : (
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat} className="dark:bg-[#111111]">{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Amount</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-[#0F0E0D]/50 dark:text-white/50">$</span>
                    <input 
                      type="number" 
                      required
                      min="0" step="0.01"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#FBF9F6] dark:bg-white/5 pl-9 pr-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" 
                    />
                  </div>
                </div>

                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="w-full py-4 mt-2 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] font-extrabold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)]"
                >
                  <Plus size={16} strokeWidth={3} /> Record Expense
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}

// Subcomponent for the top cards
function StatCard({ title, value, trend, icon, variants, isDark = false }) {
  const cardBg = isDark ? "bg-[#111111] dark:bg-[#E9E3DB]" : "bg-white dark:bg-[#111111]";
  const textColor = isDark ? "text-white dark:text-[#0F0E0D]" : "text-[#0F0E0D] dark:text-white";
  const titleColor = isDark ? "text-white/40 dark:text-[#0F0E0D]/40" : "text-[#0F0E0D]/40 dark:text-white/40";
  const borderColor = isDark ? "border-transparent" : "border-[#EBE6E0] dark:border-white/10";
  
  return (
    <motion.div 
      variants={variants} 
      className={`${cardBg} ${borderColor} border p-8 rounded-[2.5rem] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[180px] relative overflow-hidden transition-colors`}
    >
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className={`${textColor} stroke-2 transition-colors`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-white/10 text-white dark:bg-black/10 dark:text-black' : 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white'} transition-colors`}>
          {trend}
        </div>
      </div>
      
      <div className="relative z-10 mt-6">
        <h3 className={`${titleColor} font-bold text-[10px] uppercase tracking-[0.15em] mb-1.5 transition-colors`}>{title}</h3>
        <p className={`${textColor} text-[2.2rem] font-extrabold tracking-tight leading-none transition-colors`}>{value}</p>
      </div>

      <div className="absolute -right-4 -bottom-4 pointer-events-none z-0 transition-opacity">
        {isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="dark:hidden">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#1C1C1C"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="dark:hidden">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#FAFAFA"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#E5E5E5" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    </motion.div>
  );
}