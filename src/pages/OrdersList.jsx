import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreHorizontal, 
  Pencil, Trash2, ArrowUpDown, Truck, MapPin
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
      case 'Delivered': return 'bg-[#1A1A1A] text-[#E9E3DB]';
      case 'Shipped': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-[#C4BEB6]/20 text-[#1A1A1A]';
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1400px] w-full mx-auto space-y-6">
      
      {/* Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">Order Management</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#C4BEB6]/40 rounded-full text-sm focus:border-[#1A1A1A]/30 focus:ring-2 focus:ring-[#1A1A1A]/5 outline-none transition-all font-medium placeholder:text-[#1A1A1A]/40"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] hover:bg-[#C4BEB6]/10 transition-colors flex items-center gap-2">
            <Filter size={16} /> Filter
          </button>
          
          {/* Linked to your AddOrder page */}
          <Link to="/add-order">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 bg-[#1A1A1A] text-[#E9E3DB] rounded-full text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-[#1A1A1A]/80 transition-colors whitespace-nowrap">
              <Plus size={18} strokeWidth={3} /> Add Order
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Orders Table Card */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#C4BEB6]/5 text-[#1A1A1A]/50 text-xs uppercase tracking-wider border-b border-[#C4BEB6]/20">
                <th className="px-6 py-5 font-bold flex items-center gap-1 cursor-pointer hover:text-[#1A1A1A]">Order ID <ArrowUpDown size={12} /></th>
                <th className="px-6 py-5 font-bold">Customer</th>
                <th className="px-6 py-5 font-bold">Date</th>
                <th className="px-6 py-5 font-bold">Shipping Info</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold">Total</th>
                <th className="px-6 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#C4BEB6]/10 hover:bg-[#C4BEB6]/5 transition-colors group">
                  
                  {/* Order ID */}
                  <td className="px-6 py-4 font-bold text-[#1A1A1A]">{order.id}</td>
                  
                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div>
                      <h4 className="font-bold text-[#1A1A1A]">{order.customer}</h4>
                      <p className="text-xs text-[#1A1A1A]/50 font-medium mt-0.5">{order.email}</p>
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="px-6 py-4 font-medium text-[#1A1A1A]/60">{order.date}</td>

                  {/* Shipping Info */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#1A1A1A]/80 font-bold text-xs">
                        <Truck size={12} /> {order.courier}
                      </div>
                      <div className="text-xs text-[#1A1A1A]/50 font-medium">
                        {order.tracking}
                      </div>
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 font-bold text-[#1A1A1A]">{order.amount}</td>
                  
                  {/* Actions (Edit / Delete) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Update/Edit Button */}
                      <button className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#C4BEB6]/20 rounded-lg transition-colors" title="Edit Order">
                        <Pencil size={18} />
                      </button>
                      {/* Delete Button (Triggers local state update) */}
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-[#1A1A1A]/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete Order"
                      >
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
          <p>Showing 1 to {orders.length} of {orders.length} results</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#C4BEB6]/40 rounded-xl hover:bg-[#C4BEB6]/10 transition-colors">Previous</button>
            <button className="px-4 py-2 border border-[#C4BEB6]/40 rounded-xl hover:bg-[#C4BEB6]/10 transition-colors">Next</button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}