import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Pencil, Trash2, ArrowUpDown 
} from 'lucide-react';

export default function ProductsList() {
  // Dummy data for your products table
  const [products, setProducts] = useState([
    { id: '#PRD-001', name: 'Puffer Jacket With Pocket Detail', category: 'Outerwear', price: '$89.00', stock: 77, status: 'Active', img: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-002', name: 'Minimalist Knit Sweater', category: 'Tops', price: '$65.00', stock: 12, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-003', name: 'Wide Leg Tailored Pants', category: 'Bottoms', price: '$110.00', stock: 45, status: 'Active', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-004', name: 'Oversized Cotton Tee', category: 'Tops', price: '$35.00', stock: 0, status: 'Draft', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150&auto=format&fit=crop' },
    { id: '#PRD-005', name: 'Classic Trench Coat', category: 'Outerwear', price: '$180.00', stock: 24, status: 'Active', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop' },
  ]);

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
      case 'Active': return 'bg-[#1A1A1A] text-[#E9E3DB]';
      case 'Low Stock': return 'bg-orange-100 text-orange-700';
      case 'Draft': return 'bg-[#C4BEB6]/40 text-[#1A1A1A]';
      default: return 'bg-[#C4BEB6]/20 text-[#1A1A1A]';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1400px] w-full mx-auto space-y-6">
      
      {/* Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">Product Inventory</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#C4BEB6]/40 rounded-full text-sm focus:border-[#1A1A1A]/30 focus:ring-2 focus:ring-[#1A1A1A]/5 outline-none transition-all font-medium placeholder:text-[#1A1A1A]/40"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-[#C4BEB6]/10 transition-colors flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          <Link to="/add-product">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 bg-[#1A1A1A] text-[#E9E3DB] rounded-full text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-[#1A1A1A]/80 transition-colors whitespace-nowrap">
              <Plus size={18} strokeWidth={3} /> Add Product
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Products Table Card */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#C4BEB6]/5 text-[#1A1A1A]/50 text-xs uppercase tracking-wider border-b border-[#C4BEB6]/20">
                <th className="px-6 py-5 font-bold flex items-center gap-1 cursor-pointer hover:text-[#1A1A1A]">Product <ArrowUpDown size={12} /></th>
                <th className="px-6 py-5 font-bold">SKU</th>
                <th className="px-6 py-5 font-bold">Price</th>
                <th className="px-6 py-5 font-bold">Stock</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map((product, index) => (
                <tr key={index} className="border-b border-[#C4BEB6]/10 hover:bg-[#C4BEB6]/5 transition-colors group">
                  
                  {/* Product Info (Image + Name + Category) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#C4BEB6]/10 shrink-0">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A1A]">{product.name}</h4>
                        <p className="text-xs text-[#1A1A1A]/50 font-medium mt-0.5">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* SKU */}
                  <td className="px-6 py-4 font-bold text-[#1A1A1A]/60">{product.id}</td>
                  
                  {/* Price */}
                  <td className="px-6 py-4 font-bold text-[#1A1A1A]">{product.price}</td>
                  
                  {/* Stock */}
                  <td className="px-6 py-4 font-medium text-[#1A1A1A]/80">{product.stock} in stock</td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  
                  {/* Actions (Edit / Delete) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Update/Edit Button */}
                      <button className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#C4BEB6]/20 rounded-lg transition-colors" title="Edit Product">
                        <Pencil size={18} />
                      </button>
                      {/* Delete Button */}
                      <button className="p-2 text-[#1A1A1A]/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Product">
                        <Trash2 size={18} />
                      </button>
                      {/* More Options */}
                      <button className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#C4BEB6]/20 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#C4BEB6]/20 flex items-center justify-between text-sm font-medium text-[#1A1A1A]/60">
          <p>Showing 1 to 5 of 24 results</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#C4BEB6]/40 rounded-xl hover:bg-[#C4BEB6]/10 transition-colors">Previous</button>
            <button className="px-4 py-2 border border-[#C4BEB6]/40 rounded-xl hover:bg-[#C4BEB6]/10 transition-colors">Next</button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}