import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Plus, Trash2, MoreHorizontal, LayoutGrid, Tag, FolderOpen
} from 'lucide-react';

export default function Categories() {
  // Mock Data for Categories
  const [categories, setCategories] = useState([
    { id: '#CAT-001', name: 'Outerwear & Jackets', products: 24, status: 'Active', date: 'Aug 10, 2026' },
    { id: '#CAT-002', name: 'Dresses & Jumpsuits', products: 18, status: 'Active', date: 'Aug 05, 2026' },
    { id: '#CAT-003', name: 'Tops & Knitwear', products: 42, status: 'Active', date: 'Jul 28, 2026' },
    { id: '#CAT-004', name: 'Tailored Bottoms', products: 15, status: 'Active', date: 'Jul 15, 2026' },
    { id: '#CAT-005', name: 'Swimwear', products: 0, status: 'Draft', date: 'Aug 11, 2026' },
  ]);

  // Form State
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('Active');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newName) return;
    
    const newCat = {
      id: `#CAT-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      products: 0,
      status: newStatus,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    setCategories([newCat, ...categories]);
    setNewName('');
    setNewStatus('Active');
  };

  const handleDelete = (idToRemove) => {
    setCategories(categories.filter(cat => cat.id !== idToRemove));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]';
      case 'Draft': return 'bg-[#FBF9F6] dark:bg-white/10 border border-[#EBE6E0] dark:border-white/20 text-[#0F0E0D] dark:text-white';
      default: return 'bg-[#EBE6E0]/50 dark:bg-white/5 text-[#0F0E0D] dark:text-white';
    }
  };

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Product Categories</h1>
            <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Manage your store's collections and taxonomy</p>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StatCard 
            title="Total Categories" 
            value={categories.length} 
            trend="Active Collections" 
            icon={<Layers size={24} />} 
            variants={itemVariants} 
            isDark={true} 
          />
          <StatCard 
            title="Total Products Linked" 
            value={categories.reduce((sum, cat) => sum + cat.products, 0)} 
            trend="Across all categories" 
            icon={<Tag size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Most Popular" 
            value="Tops" 
            trend="42 Active Products" 
            icon={<LayoutGrid size={24} />} 
            variants={itemVariants} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* CATEGORIES TABLE (LEFT COLUMN) */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Category List</h2>
            </div>
            
            <div className="overflow-x-auto min-h-[300px] sm:min-h-[400px]">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[#0F0E0D]/50 dark:text-white/50 text-[9px] uppercase tracking-[0.25em] border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <th className="pb-5 font-bold">Category Name</th>
                    <th className="pb-5 font-bold text-center">Products</th>
                    <th className="pb-5 font-bold">Status</th>
                    <th className="pb-5 font-bold">Date Created</th>
                    <th className="pb-5 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <AnimatePresence>
                    {categories.map((cat) => (
                      <motion.tr 
                        key={cat.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-[#EBE6E0]/60 dark:border-white/5 hover:bg-[#FBF9F6]/50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-4 sm:py-5">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-2xl bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 flex items-center justify-center text-[#0F0E0D] dark:text-white transition-colors">
                              <FolderOpen size={16} strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="font-extrabold text-[#0F0E0D] dark:text-white text-sm tracking-tight transition-colors">{cat.name}</p>
                              <p className="font-mono font-bold text-[#0F0E0D]/40 dark:text-white/40 text-[10px] mt-0.5 transition-colors">{cat.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 sm:py-5 text-center font-bold text-[#0F0E0D]/70 dark:text-white/70 transition-colors">{cat.products}</td>
                        <td className="py-4 sm:py-5">
                          <span className={`px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full inline-flex transition-colors ${getStatusBadge(cat.status)}`}>
                            {cat.status}
                          </span>
                        </td>
                        <td className="py-4 sm:py-5 font-medium text-[#0F0E0D]/60 dark:text-white/60 text-xs transition-colors">{cat.date}</td>
                        <td className="py-4 sm:py-5 text-center">
                          <div className="flex justify-center items-center gap-1 sm:gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-[#0F0E0D]/40 dark:text-white/40 hover:text-[#0F0E0D] dark:hover:text-white transition-colors rounded-xl hover:bg-[#EBE6E0] dark:hover:bg-white/10 inline-flex">
                              <MoreHorizontal size={16} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleDelete(cat.id)}
                              className="p-2 text-[#0F0E0D]/30 dark:text-white/30 hover:text-[#6A3131] dark:hover:text-red-400 transition-colors rounded-xl hover:bg-[#FFF4F4] dark:hover:bg-red-500/20 inline-flex"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/40 dark:text-white/40">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ADD CATEGORY FORM (RIGHT COLUMN) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 flex flex-col h-fit transition-colors">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white mb-2 transition-colors">Create Category</h2>
              <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.25em] mb-6 sm:mb-8 transition-colors">Add a new collection</p>
              
              <form onSubmit={handleAddCategory} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Category Name</label>
                  <input 
                    type="text" 
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Winter Jackets" 
                    className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors"
                  >
                    <option className="dark:bg-[#111111]" value="Active">Active (Visible)</option>
                    <option className="dark:bg-[#111111]" value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="w-full py-4 mt-2 sm:mt-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] font-extrabold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)]"
                >
                  <Plus size={16} strokeWidth={3} /> Save Category
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

      {/* Decorative Wavy Lines (Fixed Dark Mode Logic) */}
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