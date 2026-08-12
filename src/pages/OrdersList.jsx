import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Pencil, Trash2, ArrowUpDown, Truck
} from 'lucide-react';

export default function OrdersList() {
  // Dummy data with local state so you can test the "Delete" functionality
  const [orders, setOrders] = useState([
    { id: '#ORD-4928', customer: 'Emma Thompson', email: 'emma@example.com', date: 'Aug 09, 2026', status: 'Processing', amount: '$89.00', courier: 'DHL Express', tracking: 'TRK-99882211' },
    { id: '#ORD-4927', customer: 'James Wilson', email: 'james.w@example.com', date: 'Aug 08, 2026', status: 'Shipped', amount: '$210.00', courier: 'FedEx Priority', tracking: 'FX-44556677' },
    { id: '#ORD-4926', customer: 'Sophia Chen', email: 'schen99@example.com', date: 'Aug 08, 2026', status: 'Delivered', amount: '$65.00', courier: 'UPS Standard', tracking: '1Z999999999' },
    { id: '#ORD-4925', customer: 'Lucas Martinez', email: 'lucas.m@example.com', date: 'Aug 07, 2026', status: 'Pending', amount: '$345.00', courier: 'Local Courier', tracking: 'Pending' },
    { id: '#ORD-4924', customer: 'Olivia Davis', email: 'olivia.d@example.com', date: 'Aug 06, 2026', status: 'Cancelled', amount: '$110.00', courier: 'None', tracking: 'N/A' },
  ]);

  // Function to handle deleting an order from the local state
  const handleDelete = (idToRemove) => {
    setOrders(orders.filter(order => order.id !== idToRemove));
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
      case 'Delivered': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]';
      case 'Shipped': return 'bg-[#F4F8F4] dark:bg-green-500/20 text-[#2E4A35] dark:text-green-400 border border-[#E2EBE2] dark:border-green-500/30';
      case 'Processing': return 'bg-[#F4F8F9] dark:bg-blue-500/20 text-[#2E3A4A] dark:text-blue-400 border border-[#E2E6EB] dark:border-blue-500/30';
      case 'Pending': return 'bg-[#FFF9F4] dark:bg-orange-500/20 text-[#6A4A2E] dark:text-orange-400 border border-[#F2EAE2] dark:border-orange-500/30';
      case 'Cancelled': return 'bg-[#FFF4F4] dark:bg-red-500/20 text-[#6A3131] dark:text-red-400 border border-[#F2E2E2] dark:border-red-500/30';
      default: return 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-8 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      
      {/* Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Order Management</h1>
          <p className="text-[10px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Track and fulfill customer requests</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={16} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-sm focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all font-bold placeholder:text-[#0F0E0D]/40 dark:placeholder:text-white/40 text-[#0F0E0D] dark:text-white shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none justify-center px-6 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors flex items-center gap-2 shadow-sm">
              <Filter size={14} strokeWidth={2.5} /> Filter
            </button>
            
            <Link to="/add-order" className="flex-1 sm:flex-none">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full justify-center px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors whitespace-nowrap">
                <Plus size={16} strokeWidth={3} /> Add Order
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Orders Table Card */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
        <div className="overflow-x-auto min-h-[300px] sm:min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/40 dark:text-white/40 text-[9px] uppercase tracking-[0.25em] border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold flex items-center gap-1.5 cursor-pointer hover:text-[#0F0E0D] dark:hover:text-white">Order ID <ArrowUpDown size={12} strokeWidth={2.5} /></th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Customer</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Date</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Shipping Info</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Total</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#EBE6E0]/60 dark:border-white/5 hover:bg-[#FBF9F6]/50 dark:hover:bg-white/5 transition-colors group">
                  
                  {/* Order ID */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-mono font-bold text-[#0F0E0D]/60 dark:text-white/60 text-xs tracking-wider transition-colors">{order.id}</td>
                  
                  {/* Customer Info */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <div>
                      <h4 className="font-extrabold text-[#0F0E0D] dark:text-white text-sm tracking-tight transition-colors">{order.customer}</h4>
                      <p className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-bold uppercase tracking-widest mt-1 transition-colors">{order.email}</p>
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-[#0F0E0D]/50 dark:text-white/50 text-xs transition-colors">{order.date}</td>

                  {/* Shipping Info */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#0F0E0D]/80 dark:text-white/80 font-bold text-xs transition-colors">
                        <Truck size={12} strokeWidth={2.5} /> {order.courier}
                      </div>
                      <div className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-mono font-bold transition-colors">
                        {order.tracking}
                      </div>
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <span className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold rounded-full inline-flex items-center ${getStatusBadge(order.status)} transition-colors`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5 font-extrabold text-[#0F0E0D] dark:text-white text-base tracking-tight transition-colors">{order.amount}</td>
                  
                  {/* Actions (Edit / Delete) */}
                  <td className="px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                      {/* Update/Edit Button */}
                      <button className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10 rounded-xl transition-colors" title="Edit Order">
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      {/* Delete Button (Triggers local state update) */}
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#6A3131] dark:hover:text-red-400 hover:bg-[#FFF4F4] dark:hover:bg-red-500/20 rounded-xl transition-colors" 
                        title="Delete Order"
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
          <p className="text-center sm:text-left">Showing 1 to {orders.length} of {orders.length} results</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center">Previous</button>
            <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center">Next</button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}