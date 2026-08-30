import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, TrendingDown, Plus, Trash2, Tag, Box, X, Pencil, Loader2, Save
} from 'lucide-react';
import { expenseService } from '../services/expenseService';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Categories State
  const defaultCategories = ['Packaging', 'Branding', 'Office Supplies', 'Logistics', 'Miscellaneous'];
  const [categories, setCategories] = useState(defaultCategories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Form State
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState(defaultCategories[0]);
  const [newAmount, setNewAmount] = useState('');

  // Fetch Data from Backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
      
      // Update categories if there are custom ones in DB
      const dbCategories = data.map(exp => exp.category);
      const uniqueCategories = [...new Set([...defaultCategories, ...dbCategories])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem || !newAmount) return;

    try {
      setIsSaving(true);
      const payload = {
        item: newItem,
        category: newCategory,
        amount: parseFloat(newAmount)
      };

      if (isEditing && editId) {
        // UPDATE EXPENSE
        const updatedExpense = await expenseService.update(editId, payload);
        setExpenses(expenses.map(exp => exp.id === editId ? updatedExpense : exp));
        setIsEditing(false);
        setEditId(null);
      } else {
        // CREATE NEW EXPENSE
        const createdExpense = await expenseService.create(payload);
        setExpenses([createdExpense, ...expenses]);
      }

      // Reset form
      setNewItem('');
      setNewAmount('');
      setNewCategory(categories[0]);
    } catch (error) {
      console.error("Error saving expense", error);
      alert("Failed to save expense");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (exp) => {
    setIsEditing(true);
    setEditId(exp.id);
    setNewItem(exp.item);
    setNewCategory(exp.category);
    setNewAmount(exp.amount.toString());
    
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewItem('');
    setNewAmount('');
    setNewCategory(categories[0]);
  };

  // Delete Expense
  const handleDelete = async (idToRemove) => {
    if(!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await expenseService.delete(idToRemove);
      setExpenses(expenses.filter(exp => exp.id !== idToRemove));
    } catch (error) {
      console.error("Error deleting expense", error);
      alert("Failed to delete expense");
    }
  };

  // Handle Custom Category
  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      const formattedCategory = customCategory.trim();
      setCategories([...categories, formattedCategory]);
      setNewCategory(formattedCategory);
    }
    setCustomCategory('');
    setShowAddCategory(false);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const getCategoryStyle = (category) => {
    switch(category) {
      case 'Packaging': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] border border-transparent';
      case 'Branding': return 'bg-[#FBF9F6] dark:bg-white/10 border border-[#EBE6E0] dark:border-white/20 text-[#0F0E0D] dark:text-white';
      case 'Office Supplies': return 'bg-[#F4F8F4] dark:bg-green-500/20 text-[#2E4A35] dark:text-green-400 border border-[#E2EBE2] dark:border-green-500/30';
      default: return 'bg-[#EBE6E0]/50 dark:bg-white/5 border border-transparent text-[#0F0E0D] dark:text-white';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBF9F6] dark:bg-[#0A0A0A] text-[#0F0E0D]/40 dark:text-white/40">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Expenses...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Extra Bills & Expenses</h1>
            <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Track packaging, branding, and operational costs</p>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
            value={`$${expenses.filter(e => e.category === 'Packaging').reduce((s, e) => s + Number(e.amount), 0).toFixed(2)}`} 
            trend="Courier Bags & Boxes" 
            icon={<Box size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Branding & Marketing" 
            value={`$${expenses.filter(e => e.category === 'Branding').reduce((s, e) => s + Number(e.amount), 0).toFixed(2)}`} 
            trend="Tags & Business Cards" 
            icon={<Tag size={24} />} 
            variants={itemVariants} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* EXPENSES TABLE (LEFT COLUMN) */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Expense History</h2>
            </div>
            
            <div className="overflow-x-auto min-h-[300px] sm:min-h-[400px]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] uppercase tracking-[0.25em] border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <th className="pb-5 font-bold">Bill ID</th>
                    <th className="pb-5 font-bold">Item Description</th>
                    <th className="pb-5 font-bold">Category</th>
                    <th className="pb-5 font-bold">Date</th>
                    <th className="pb-5 font-bold text-right">Amount</th>
                    <th className="pb-5 font-bold text-right">Actions</th>
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
                        <td className="py-4 sm:py-5 font-mono font-bold text-[#0F0E0D]/60 dark:text-white/60 text-xs tracking-wider transition-colors">{exp.custom_id}</td>
                        <td className="py-4 sm:py-5 font-extrabold text-[#0F0E0D] dark:text-white text-sm tracking-tight transition-colors">{exp.item}</td>
                        <td className="py-4 sm:py-5">
                          <span className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-1.5 w-fit transition-colors ${getCategoryStyle(exp.category)}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 sm:py-5 font-medium text-[#0F0E0D]/60 dark:text-white/60 text-xs transition-colors">{formatDate(exp.created_at)}</td>
                        <td className="py-4 sm:py-5 font-extrabold text-[#0F0E0D] dark:text-white text-right text-base transition-colors">${Number(exp.amount).toFixed(2)}</td>
                        <td className="py-4 sm:py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(exp)}
                              className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white transition-colors rounded-xl hover:bg-[#EBE6E0] dark:hover:bg-white/10"
                              title="Edit Expense"
                            >
                              <Pencil size={16} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleDelete(exp.id)}
                              className="p-2 text-[#0F0E0D]/30 dark:text-white/30 hover:text-[#6A3131] dark:hover:text-red-400 transition-colors rounded-xl hover:bg-[#FFF4F4] dark:hover:bg-red-500/20"
                              title="Delete Expense"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                          </div>
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

          {/* ADD/EDIT EXPENSE FORM (RIGHT COLUMN) */}
          <motion.div variants={itemVariants} className={`p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border transition-colors flex flex-col h-fit ${isEditing ? 'bg-[#F4F8F9] dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' : 'bg-white dark:bg-[#111111] border-[#EBE6E0] dark:border-white/10'}`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${isEditing ? 'text-[#2E3A4A] dark:text-blue-400' : 'text-[#0F0E0D] dark:text-white'}`}>
                  {isEditing ? 'Edit Bill' : 'Record New Bill'}
                </h2>
                {isEditing && (
                  <button onClick={cancelEdit} className="text-[#0F0E0D]/40 hover:text-red-500 transition-colors bg-white dark:bg-[#1A1A1A] p-1.5 rounded-full shadow-sm">
                    <X size={16} strokeWidth={3} />
                  </button>
                )}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-6 sm:mb-8 transition-colors ${isEditing ? 'text-[#2E3A4A]/60 dark:text-blue-400/60' : 'text-[#0F0E0D]/50 dark:text-white/50'}`}>
                {isEditing ? 'Update operational costs' : 'Log your operational costs'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${isEditing ? 'text-[#2E3A4A]/80 dark:text-blue-400/80' : 'text-[#0F0E0D]/60 dark:text-white/60'}`}>Item Description</label>
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
                  <div className="flex justify-between items-center mb-3">
                    <label className={`block text-xs font-bold uppercase tracking-widest transition-colors ${isEditing ? 'text-[#2E3A4A]/80 dark:text-blue-400/80' : 'text-[#0F0E0D]/60 dark:text-white/60'}`}>Category</label>
                    {!showAddCategory && (
                      <button 
                        type="button" 
                        onClick={() => setShowAddCategory(true)}
                        className={`text-[9px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity ${isEditing ? 'text-[#2E3A4A] dark:text-blue-400' : 'text-[#0F0E0D] dark:text-white'}`}
                      >
                        + Add New
                      </button>
                    )}
                  </div>

                  {showAddCategory ? (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                      <input 
                        type="text" 
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="New Category" 
                        autoFocus
                        className="flex-1 min-w-0 bg-[#FBF9F6] dark:bg-white/5 px-4 py-4 rounded-2xl border border-[#0F0E0D] dark:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" 
                      />
                      <button 
                        type="button"
                        onClick={handleAddCustomCategory}
                        className="px-4 shrink-0 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                      >
                        Add
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowAddCategory(false)}
                        className="px-3 shrink-0 bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white rounded-2xl hover:bg-[#EBE6E0] dark:hover:bg-white/20 transition-colors"
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
                  <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${isEditing ? 'text-[#2E3A4A]/80 dark:text-blue-400/80' : 'text-[#0F0E0D]/60 dark:text-white/60'}`}>Amount</label>
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

                <div className="flex gap-2 mt-2 sm:mt-4">
                  {isEditing && (
                    <motion.button 
                      type="button"
                      onClick={cancelEdit}
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="w-1/3 py-4 bg-white dark:bg-[#1A1A1A] text-[#0F0E0D] dark:text-white font-extrabold uppercase tracking-widest text-[10px] rounded-2xl border border-[#EBE6E0] dark:border-white/10 hover:bg-[#FBF9F6] transition-colors flex items-center justify-center shadow-sm"
                    >
                      Cancel
                    </motion.button>
                  )}
                  <motion.button 
                    type="submit"
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    className={`flex-1 py-4 font-extrabold uppercase tracking-widest text-[10px] rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] disabled:opacity-70 ${isEditing ? 'bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700' : 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90'}`}
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isEditing ? <Save size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />)} 
                    {isEditing ? 'Update Expense' : 'Record Expense'}
                  </motion.button>
                </div>
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
      className={`${cardBg} ${borderColor} border p-6 sm:p-8 rounded-[2.5rem] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[160px] sm:min-h-[180px] relative overflow-hidden transition-colors`}
    >
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className={`${textColor} stroke-2 transition-colors`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-white/10 text-white dark:bg-black/10 dark:text-black' : 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white'} transition-colors`}>
          {trend}
        </div>
      </div>
      
      <div className="relative z-10 mt-5 sm:mt-6">
        <h3 className={`${titleColor} font-bold text-[10px] uppercase tracking-[0.15em] mb-1.5 transition-colors`}>{title}</h3>
        <p className={`${textColor} text-[1.75rem] sm:text-[2.2rem] font-extrabold tracking-tight leading-none transition-colors`}>{value}</p>
      </div>

      <div className="absolute -right-4 -bottom-4 pointer-events-none z-0">
        <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
          <path 
            d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" 
            className={`transition-colors duration-300 ${isDark ? 'fill-[#1C1C1C] dark:fill-[#D5CBB9]' : 'fill-[#FAFAFA] dark:fill-[#151515]'}`}
          />
          <path 
            d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" 
            className={`transition-colors duration-300 stroke-[2.5px] ${isDark ? 'stroke-[#2A2A2A] dark:stroke-[#C4BEB6]' : 'stroke-[#E5E5E5] dark:stroke-[#1F1F1F]'}`}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}