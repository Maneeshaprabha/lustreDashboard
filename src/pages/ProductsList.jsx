import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Pencil, Trash2, ArrowUpDown 
} from 'lucide-react';

export default function ProductsList() {
  // Dummy data for your products table with local state for deletion
  const [products, setProducts] = useState([
    { id: '#PRD-001', name: 'Puffer Jacket With Pocket Detail', category: 'Outerwear', price: '$89.00', stock: 77, status: 'Active', img: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-002', name: 'Minimalist Knit Sweater', category: 'Tops', price: '$65.00', stock: 12, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-003', name: 'Wide Leg Tailored Pants', category: 'Bottoms', price: '$110.00', stock: 45, status: 'Active', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-004', name: 'Oversized Cotton Tee', category: 'Tops', price: '$35.00', stock: 0, status: 'Draft', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-005', name: 'Classic Trench Coat', category: 'Outerwear', price: '$180.00', stock: 24, status: 'Active', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop' },
  ]);

  const handleDelete = (idToRemove) => {
    setProducts(products.filter(product => product.id !== idToRemove));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]';
      case 'Low Stock': return 'bg-[#FFF9F4] dark:bg-orange-500/20 text-[#6A4A2E] dark:text-orange-400 border border-[#F2EAE2] dark:border-orange-500/30';
      case 'Draft': return 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white border border-[#EBE6E0] dark:border-white/20';
      default: return 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-8 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      
      {/* Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Product Inventory</h1>
          <p className="text-[10px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Manage your store catalog and stock</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={16} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-sm focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all font-bold placeholder:text-[#0F0E0D]/40 dark:placeholder:text-white/40 text-[#0F0E0D] dark:text-white shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none justify-center px-6 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors flex items-center gap-2 shadow-sm">
              <Filter size={14} strokeWidth={2.5} /> Filter
            </button>
            
            <Link to="/add-product" className="flex-1 sm:flex-none">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full justify-center px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors whitespace-nowrap">
                <Plus size={16} strokeWidth={3} /> Add Product
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Products Table Card */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
        <div className="overflow-x-auto min-h-[300px] sm:min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/40 dark:text-white/40 text-[9px] uppercase tracking-[0.25em] border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold flex items-center gap-1.5 cursor-pointer hover:text-[#0F0E0D] dark:hover:text-white">Product <ArrowUpDown size={12} strokeWidth={2.5} /></th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">SKU</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Price</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Stock</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#EBE6E0]/60 dark:border-white/5 hover:bg-[#FBF9F6]/50 dark:hover:bg-white/5 transition-colors group">
                  
                  {/* Product Info (Image + Name + Category) */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 shrink-0">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#0F0E0D] dark:text-white text-sm tracking-tight transition-colors">{product.name}</h4>
                        <p className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-bold uppercase tracking-widest mt-1 transition-colors">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* SKU */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-mono font-bold text-[#0F0E0D]/60 dark:text-white/60 text-xs tracking-wider transition-colors">{product.id}</td>
                  
                  {/* Price */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-extrabold text-[#0F0E0D] dark:text-white text-base tracking-tight transition-colors">{product.price}</td>
                  
                  {/* Stock */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-[#0F0E0D]/70 dark:text-white/70 text-xs transition-colors">{product.stock} in stock</td>
                  
                  {/* Status Badge */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <span className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold rounded-full inline-flex items-center ${getStatusBadge(product.status)} transition-colors`}>
                      {product.status}
                    </span>
                  </td>
                  
                  {/* Actions (Edit / Delete) */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                      {/* Update/Edit Button */}
                      <button className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10 rounded-xl transition-colors" title="Edit Product">
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#6A3131] dark:hover:text-red-400 hover:bg-[#FFF4F4] dark:hover:bg-red-500/20 rounded-xl transition-colors" 
                        title="Delete Product"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                      {/* More Options */}
                      <button className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10 rounded-xl transition-colors">
                        <MoreHorizontal size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 sm:px-8 py-5 border-t border-[#EBE6E0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 transition-colors">
          <p className="text-center sm:text-left">Showing 1 to {products.length} of {products.length} results</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center">Previous</button>
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center">Next</button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}