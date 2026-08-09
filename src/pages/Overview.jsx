import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Package, TrendingUp, TrendingDown, MoreHorizontal, BarChart3, ShoppingBag } from 'lucide-react';


export default function Overview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex h-screen bg-[#E9E3DB]/20 text-[#1A1A1A] font-sans antialiased overflow-hidden">
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
      
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1400px] w-full mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value="$124,563.00" trend="+12.5%" isPositive={true} icon={<DollarSign size={24} />} variants={itemVariants} />
            <StatCard title="Active Orders" value="842" trend="+5.2%" isPositive={true} icon={<ShoppingBag size={24} />} variants={itemVariants} />
            <StatCard title="Total Customers" value="3,291" trend="-1.4%" isPositive={false} icon={<Users size={24} />} variants={itemVariants} />
            <StatCard title="Total Products" value="1,423" trend="+8.1%" isPositive={true} icon={<Package size={24} />} variants={itemVariants} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="xl:col-span-2 bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">Revenue Analytics</h2>
                  <p className="text-sm text-[#1A1A1A]/50 font-medium mt-1">Monthly performance summary</p>
                </div>
                <select className="bg-[#C4BEB6]/10 px-4 py-2 rounded-xl text-sm font-bold border-none outline-none cursor-pointer">
                  <option>This Year</option>
                  <option>Last 6 Months</option>
                </select>
              </div>
              <div className="flex-1 bg-[#E9E3DB]/30 rounded-2xl border-2 border-dashed border-[#C4BEB6]/40 flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <BarChart3 className="mx-auto text-[#1A1A1A]/20 mb-3" size={48} />
                  <p className="text-[#1A1A1A]/40 font-bold text-sm">Interactive Chart Component Area</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Top Products</h2>
                <button className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"><MoreHorizontal size={20} /></button>
              </div>
              <div className="space-y-5">
                <TopProductRow name="Puffer Jacket with Pocket" category="Outerwear" price="$89.00" sales="245 sales" img="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop" />
                <TopProductRow name="Minimalist Knit Sweater" category="Tops" price="$65.00" sales="190 sales" img="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=150&auto=format&fit=crop" />
                <TopProductRow name="Wide Leg Tailored Pants" category="Bottoms" price="$110.00" sales="156 sales" img="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop" />
              </div>
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Orders</h2>
                <button className="text-sm font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A]">See All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#1A1A1A]/50 text-xs uppercase tracking-wider border-b border-[#C4BEB6]/20">
                      <th className="pb-4 font-bold">Order ID</th>
                      <th className="pb-4 font-bold">Customer</th>
                      <th className="pb-4 font-bold">Date</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <OrderRow id="#ORD-7391" name="Elena Rodriguez" date="Aug 08, 2026" status="Delivered" amount="$124.50" />
                    <OrderRow id="#ORD-7390" name="Marcus Chen" date="Aug 07, 2026" status="Processing" amount="$89.00" />
                    <OrderRow id="#ORD-7389" name="Sarah Jenkins" date="Aug 07, 2026" status="Delivered" amount="$210.00" />
                  </tbody>
                </table>
              </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon, variants }) {
  return (
    <motion.div variants={variants} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-[#C4BEB6]/20 flex flex-col group hover:border-[#1A1A1A]/20 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#C4BEB6]/10 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#E9E3DB] transition-colors">{icon}</div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
        </div>
      </div>
      <div>
        <h3 className="text-[#1A1A1A]/60 font-medium text-sm mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
      </div>
    </motion.div>
  );
}

function TopProductRow({ name, category, price, sales, img }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#C4BEB6]/10">
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#3d352e] transition-colors">{name}</h4>
          <p className="text-xs text-[#1A1A1A]/50 font-medium">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[#1A1A1A]">{price}</p>
        <p className="text-xs text-[#1A1A1A]/50 font-medium">{sales}</p>
      </div>
    </div>
  );
}

function OrderRow({ id, name, date, status, amount }) {
  const getStatusStyle = (s) => {
    switch(s) {
      case 'Delivered': return 'bg-[#1A1A1A] text-[#E9E3DB]';
      case 'Processing': return 'bg-[#C4BEB6]/40 text-[#1A1A1A]';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-[#C4BEB6]/10 text-[#1A1A1A]';
    }
  };
  return (
    <tr className="border-b border-[#C4BEB6]/10 hover:bg-[#C4BEB6]/5 transition-colors group">
      <td className="py-4 font-bold text-[#1A1A1A]">{id}</td>
      <td className="py-4 font-bold text-[#1A1A1A]/80">{name}</td>
      <td className="py-4 font-medium text-[#1A1A1A]/60">{date}</td>
      <td className="py-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(status)}`}>{status}</span></td>
      <td className="py-4 font-bold text-[#1A1A1A] text-right">{amount}</td>
    </tr>
  );
}