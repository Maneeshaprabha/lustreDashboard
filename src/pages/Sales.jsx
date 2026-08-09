import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function Sales() {
  const [salesData] = useState([
    { id: '#TRX-9082', customer: 'Emma Thompson', items: 3, date: 'Aug 08, 2026', status: 'Paid', amount: '$345.00' },
    { id: '#TRX-9081', customer: 'James Wilson', items: 1, date: 'Aug 08, 2026', status: 'Pending', amount: '$89.00' },
    { id: '#TRX-9080', customer: 'Sophia Chen', items: 2, date: 'Aug 07, 2026', status: 'Paid', amount: '$210.00' },
    { id: '#TRX-9079', customer: 'Lucas Martinez', items: 1, date: 'Aug 07, 2026', status: 'Refunded', amount: '$65.00' },
    { id: '#TRX-9078', customer: 'Olivia Davis', items: 4, date: 'Aug 06, 2026', status: 'Paid', amount: '$540.00' },
    { id: '#TRX-9077', customer: 'Liam Garcia', items: 1, date: 'Aug 06, 2026', status: 'Paid', amount: '$110.00' },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Paid': 
        return { style: 'bg-[#1A1A1A] text-[#E9E3DB]', icon: <CheckCircle2 size={14} /> };
      case 'Pending': 
        return { style: 'bg-orange-100 text-orange-700', icon: <Clock size={14} /> };
      case 'Refunded': 
        return { style: 'bg-red-50 text-red-600', icon: <RotateCcw size={14} /> };
      default: 
        return { style: 'bg-[#C4BEB6]/20 text-[#1A1A1A]', icon: null };
    }
  };

  // Mock days for the chart X-axis
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">Sales & Transactions</h1>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] flex items-center gap-2 hover:bg-[#C4BEB6]/10 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="px-6 py-2.5 bg-[#1A1A1A] text-[#E9E3DB] rounded-full text-sm font-bold shadow-lg hover:bg-[#1A1A1A]/80 transition-colors flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Gross Sales" value="$84,250.00" trend="+12.5%" isPositive={true} variants={itemVariants} />
          <StatCard title="Net Sales" value="$78,120.00" trend="+14.2%" isPositive={true} variants={itemVariants} />
          <StatCard title="Average Order Value" value="$124.50" trend="-2.1%" isPositive={false} variants={itemVariants} />
          <StatCard title="Refund Rate" value="1.2%" trend="-0.5%" isPositive={true} subtitle="vs last month" variants={itemVariants} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* SALES TREND CHART AREA (FIXED) */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 flex flex-col min-h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Sales Trend</h2>
                <p className="text-sm text-[#1A1A1A]/50 font-medium mt-1">Daily revenue over the last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1A1A1A]">$12,450</p>
                <p className="text-sm font-bold text-green-600 flex items-center justify-end gap-1">
                  <TrendingUp size={14} /> +8.4%
                </p>
              </div>
            </div>
            
            {/* The Actual Chart Area */}
            <div className="flex-1 relative flex flex-col mt-4">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-8 px-2">
                {['15k', '10k', '5k', '0'].map((val, i) => (
                  <div key={i} className="flex items-center gap-4 w-full">
                    <span className="text-xs font-bold text-[#1A1A1A]/30 w-8 text-right">{val}</span>
                    <div className="flex-1 border-t border-dashed border-[#C4BEB6]/40"></div>
                  </div>
                ))}
              </div>

              {/* SVG Line Chart */}
              <div className="absolute inset-0 ml-14 mb-8 mt-2">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path 
                    d="M 0,220 C 150,220 150,80 300,120 C 450,160 500,40 650,90 C 800,140 850,180 1000,100 L 1000,300 L 0,300 Z" 
                    fill="url(#colorSales)" 
                  />
                  {/* Line */}
                  <path 
                    d="M 0,220 C 150,220 150,80 300,120 C 450,160 500,40 650,90 C 800,140 850,180 1000,100" 
                    fill="none" 
                    stroke="#1A1A1A" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    className="drop-shadow-lg"
                  />
                  
                  {/* Interactive Data Points */}
                  {[
                    { cx: "0", cy: "220" },
                    { cx: "166", cy: "150" },
                    { cx: "333", cy: "128" },
                    { cx: "500", cy: "60" },
                    { cx: "666", cy: "95" },
                    { cx: "833", cy: "160" },
                    { cx: "1000", cy: "100" },
                  ].map((point, i) => (
                    <circle 
                      key={i} 
                      cx={point.cx} 
                      cy={point.cy} 
                      r="6" 
                      fill="#white" 
                      stroke="#1A1A1A" 
                      strokeWidth="3" 
                      className="hover:r-8 transition-all cursor-pointer" 
                    />
                  ))}
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="mt-auto ml-14 flex justify-between pr-2 relative z-10">
                {days.map((day, i) => (
                  <span key={i} className="text-xs font-bold text-[#1A1A1A]/40">{day}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* QUICK TRANSFER / WALLET (Right Column) */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Lustre Wallet</h2>
              
              <div className="bg-[#1A1A1A] rounded-2xl p-6 text-[#E9E3DB] relative overflow-hidden shadow-lg mb-6">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#C4BEB6]/20 rounded-full blur-2xl"></div>
                <p className="text-[#E9E3DB]/60 text-sm font-bold tracking-wider mb-2 uppercase">Available Balance</p>
                <p className="text-4xl font-bold tracking-tight mb-6">$42,850.00</p>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-[#E9E3DB]/50 mb-1">Next Payout</p>
                    <p className="font-bold text-sm">Aug 10, 2026</p>
                  </div>
                  <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3.5 bg-[#C4BEB6]/20 text-[#1A1A1A] font-bold rounded-2xl text-sm hover:bg-[#C4BEB6]/40 transition-colors flex items-center justify-center gap-2">
                Withdraw Funds <ArrowUpRight size={16} />
              </button>
              <button className="w-full py-3.5 bg-transparent border-2 border-[#C4BEB6]/40 text-[#1A1A1A] font-bold rounded-2xl text-sm hover:border-[#1A1A1A]/40 transition-colors">
                Manage Accounts
              </button>
            </div>
          </motion.div>
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Transactions</h2>
            <button className="text-sm font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#C4BEB6]/5 text-[#1A1A1A]/50 text-xs uppercase tracking-wider border-b border-[#C4BEB6]/20">
                  <th className="px-6 py-5 font-bold">Transaction ID</th>
                  <th className="px-6 py-5 font-bold">Customer</th>
                  <th className="px-6 py-5 font-bold">Items</th>
                  <th className="px-6 py-5 font-bold">Date</th>
                  <th className="px-6 py-5 font-bold">Status</th>
                  <th className="px-6 py-5 font-bold text-right">Amount</th>
                  <th className="px-6 py-5 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {salesData.map((trx, index) => {
                  const statusInfo = getStatusDisplay(trx.status);
                  return (
                    <tr key={index} className="border-b border-[#C4BEB6]/10 hover:bg-[#C4BEB6]/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#1A1A1A]/80">{trx.id}</td>
                      <td className="px-6 py-4 font-bold text-[#1A1A1A]">{trx.customer}</td>
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]/60">{trx.items} item(s)</td>
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]/60">{trx.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-fit ${statusInfo.style}`}>
                          {statusInfo.icon} {trx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1A1A1A] text-right">{trx.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors rounded-lg hover:bg-[#C4BEB6]/20 inline-flex">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// Reusable Stat Card specific to the Sales page
function StatCard({ title, value, trend, isPositive, subtitle, variants }) {
  return (
    <motion.div variants={variants} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-[#C4BEB6]/20 flex flex-col group hover:border-[#1A1A1A]/30 transition-colors cursor-pointer">
      <h3 className="text-[#1A1A1A]/60 font-bold text-sm mb-4">{title}</h3>
      <div className="mb-2">
        <p className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">{value}</p>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </div>
        {subtitle && <span className="text-xs text-[#1A1A1A]/40 font-medium">{subtitle}</span>}
      </div>
    </motion.div>
  );
}