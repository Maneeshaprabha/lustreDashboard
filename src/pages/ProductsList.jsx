import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Pencil, Trash2, ArrowUpDown, Loader2, AlertTriangle
} from 'lucide-react';
import { productService } from '../services/productService'; 

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Delete Modal State ---
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load inventory. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.productId) return;
    
    try {
      setIsDeleting(true);
      await productService.delete(deleteModal.productId);
      
      // UI එකෙන් අයින් කරනවා
      const updatedProducts = products.filter(product => product.id !== deleteModal.productId);
      setProducts(updatedProducts);
      
      // Delete කරාට පස්සේ page එකේ මුකුත් නැත්නම් කලින් page එකට යන්න
      const totalPagesAfterDelete = Math.ceil(updatedProducts.length / itemsPerPage);
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }
      
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Could not delete the product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
    const currentStatus = status || 'Active'; 
    switch(currentStatus) {
      case 'Active': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]';
      case 'Low Stock': return 'bg-[#FFF9F4] dark:bg-orange-500/20 text-[#6A4A2E] dark:text-orange-400 border border-[#F2EAE2] dark:border-orange-500/30';
      case 'Draft': return 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white border border-[#EBE6E0] dark:border-white/20';
      default: return 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white';
    }
  };

  return (
    <>
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
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-[#0F0E0D]/40 dark:text-white/40">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest">Loading Inventory...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[300px] text-red-500 font-bold text-sm">
              {error}
            </div>
          ) : products.length === 0 ? (
             <div className="flex flex-col items-center justify-center min-h-[300px] text-[#0F0E0D]/40 dark:text-white/40">
               <p className="text-xs font-bold uppercase tracking-widest">No products found</p>
             </div>
          ) : (
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
                  {/* ALUTH: mode="wait" එක දැම්මා page මාරු වෙද්දි ලස්සනට පරණ ටික අයින් වෙලා අලුත් ටික එන්න */}
                  <AnimatePresence mode="wait">
                    {currentProducts.map((product) => {
                      const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stock || 0), 0) || 0;

                      return (
                        <motion.tr 
                          key={product.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-[#EBE6E0]/60 dark:border-white/5 hover:bg-[#FBF9F6]/50 dark:hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-4 sm:px-6 py-4 sm:py-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 shrink-0">
                                {product.img_url ? (
                                  <img src={product.img_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-[#EBE6E0] dark:bg-white/10"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-[#0F0E0D] dark:text-white text-sm tracking-tight transition-colors">{product.name}</h4>
                                <p className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-bold uppercase tracking-widest mt-1 transition-colors">
                                  Category #{product.category_id || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-4 sm:px-6 py-4 sm:py-5 font-mono font-bold text-[#0F0E0D]/60 dark:text-white/60 text-xs tracking-wider transition-colors">
                            {product.custom_id || 'N/A'}
                          </td>
                          
                          <td className="px-4 sm:px-6 py-4 sm:py-5 font-extrabold text-[#0F0E0D] dark:text-white text-base tracking-tight transition-colors">
                            ${Number(product.base_price || 0).toFixed(2)}
                          </td>
                          
                          <td className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-[#0F0E0D]/70 dark:text-white/70 text-xs transition-colors">
                            {totalStock > 0 ? (
                              <span className={totalStock < 10 ? 'text-orange-500' : ''}>{totalStock} in stock</span>
                            ) : (
                              <span className="text-red-500 font-bold">Out of stock</span>
                            )}
                          </td>
                          
                          <td className="px-4 sm:px-6 py-4 sm:py-5">
                            <span className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold rounded-full inline-flex items-center ${getStatusBadge(product.status)} transition-colors`}>
                              {product.status || 'Active'}
                            </span>
                          </td>
                          
                          <td className="px-4 sm:px-6 py-4 sm:py-5">
                            <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                              <Link 
                                to={`/edit-product/${product.id}`} 
                                className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10 rounded-xl transition-colors inline-block" 
                                title="Edit Product"
                              >
                                <Pencil size={16} strokeWidth={2.5} />
                              </Link>
                              
                              <button 
                                onClick={() => handleDeleteClick(product.id, product.name)}
                                className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#6A3131] dark:hover:text-red-400 hover:bg-[#FFF4F4] dark:hover:bg-red-500/20 rounded-xl transition-colors" 
                                title="Delete Product"
                              >
                                <Trash2 size={16} strokeWidth={2.5} />
                              </button>
                              
                              <button className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10 rounded-xl transition-colors">
                                <MoreHorizontal size={16} strokeWidth={2.5} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Footer */}
          {!loading && !error && products.length > 0 && (
            <div className="px-6 sm:px-8 py-5 border-t border-[#EBE6E0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 transition-colors">
              <p className="text-center sm:text-left">
                Showing {products.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products.length)} of {products.length} results
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* DELETE CONFIRMATION MODAL UI */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#0F0E0D]/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModal({ isOpen: false, productId: null, productName: '' })}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl border border-[#EBE6E0] dark:border-white/10 p-8 sm:p-10 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                  <AlertTriangle size={32} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white mb-2 transition-colors">Delete Product?</h3>
                
                <p className="text-sm font-medium text-[#0F0E0D]/60 dark:text-white/60 mb-8 leading-relaxed transition-colors">
                  Are you sure you want to delete <span className="font-bold text-[#0F0E0D] dark:text-white">"{deleteModal.productName}"</span>? This action cannot be undone and will remove all stock variants.
                </p>
                
                <div className="flex w-full gap-3">
                  <button 
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-4 bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center px-6 py-4 bg-red-500 text-white rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 transition-colors shadow-[0_10px_20px_-10px_rgba(239,68,68,0.4)] disabled:opacity-70"
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}