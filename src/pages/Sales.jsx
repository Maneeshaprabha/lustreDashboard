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
  RotateCcw,
  DollarSign,
  Wallet,
  ShoppingBag
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
        return { style: 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]', icon: <CheckCircle2 size={14} /> };
      case 'Pending': 
        return { style: 'bg-[#FFF9F4] dark:bg-orange-500/20 text-[#6A4A2E] dark:text-orange-400 border border-[#F2EAE2] dark:border-orange-500/30', icon: <Clock size={14} /> };
      case 'Refunded': 
        return { style: 'bg-[#FFF4F4] dark:bg-red-500/20 text-[#6A3131] dark:text-red-400 border border-[#F2E2E2] dark:border-red-500/30', icon: <RotateCcw size={14} /> };
      default: 
        return { style: 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white', icon: null };
    }
  };

  // Mock days for the chart X-axis
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Sales & Transactions</h1>
            <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-2 transition-colors">Manage your revenue stream</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white flex items-center gap-2 hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm">
              <Filter size={16} /> Filter
            </button>
            <button className="px-6 py-2.5 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Gross Sales" 
            value="$84,250" 
            trend="+12.5%" 
            isPositive={true} 
            icon={<DollarSign size={24} />} 
            variants={itemVariants} 
            isDark={true} 
          />
          <StatCard 
            title="Net Sales" 
            value="$78,120" 
            trend="+14.2%" 
            isPositive={true} 
            icon={<Wallet size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Average Order Value" 
            value="$124.50" 
            trend="-2.1%" 
            isPositive={false} 
            icon={<ShoppingBag size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Refund Rate" 
            value="1.2%" 
            trend="-0.5%" 
            isPositive={true} 
            icon={<RotateCcw size={24} />} 
            variants={itemVariants} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* SALES TREND CHART AREA */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 flex flex-col min-h-[420px] transition-colors">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Sales Trend</h2>
                <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium mt-1 transition-colors">Daily revenue over the last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#0F0E0D] dark:text-white transition-colors">$12,450</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center justify-end gap-1 transition-colors">
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
                    <span className="text-xs font-bold text-[#0F0E0D]/30 dark:text-white/30 w-8 text-right transition-colors">{val}</span>
                    <div className="flex-1 border-t border-dashed border-[#EBE6E0] dark:border-white/10 transition-colors"></div>
                  </div>
                ))}
              </div>

              {/* SVG Line Chart */}
              <div className="absolute inset-0 ml-14 mb-8 mt-2">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F0E0D" className="dark:stop-color-white" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0F0E0D" className="dark:stop-color-white" stopOpacity={0}/>
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
                    stroke="#0F0E0D" 
                    className="dark:stroke-white transition-colors"
                    strokeWidth="4" 
                    strokeLinecap="round" 
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
                      fill="white" 
                      className="dark:fill-[#111111] stroke-[#0F0E0D] dark:stroke-white transition-colors" 
                      strokeWidth="3" 
                      className="hover:r-8 transition-all cursor-pointer" 
                    />
                  ))}
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="mt-auto ml-14 flex justify-between pr-2 relative z-10">
                {days.map((day, i) => (
                  <span key={i} className="text-xs font-bold text-[#0F0E0D]/40 dark:text-white/40 transition-colors">{day}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* QUICK TRANSFER / WALLET (Right Column) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 flex flex-col justify-between transition-colors">
            <div>
              <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white mb-6 transition-colors">Lustre Wallet</h2>
              
              <div className="bg-[#0F0E0D] dark:bg-[#1A1A1A] border dark:border-white/10 rounded-2xl p-6 text-[#E9E3DB] relative overflow-hidden shadow-lg mb-6 transition-colors">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#C4BEB6]/20 dark:bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-[#E9E3DB]/60 dark:text-white/60 text-sm font-bold tracking-wider mb-2 uppercase transition-colors">Available Balance</p>
                <p className="text-4xl font-bold tracking-tight mb-6 text-white">$42,850.00</p>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-[#E9E3DB]/50 dark:text-white/50 mb-1 transition-colors">Next Payout</p>
                    <p className="font-bold text-sm text-white">Aug 10, 2026</p>
                  </div>
                  <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center text-white">
                    <CreditCard size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3.5 bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white font-bold rounded-2xl text-sm hover:bg-[#EBE6E0] dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                Withdraw Funds <ArrowUpRight size={16} />
              </button>
              <button className="w-full py-3.5 bg-transparent border-2 border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D] dark:text-white font-bold rounded-2xl text-sm hover:border-[#0F0E0D]/40 dark:hover:border-white/30 transition-colors">
                Manage Accounts
              </button>
            </div>
          </motion.div>
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Recent Transactions</h2>
            <button className="text-sm font-bold text-[#0F0E0D]/60 dark:text-white/60 hover:text-[#0F0E0D] dark:hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EBE6E0]/30 dark:bg-white/5 text-[#0F0E0D]/50 dark:text-white/50 text-xs uppercase tracking-wider border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
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
                    <tr key={index} className="border-b border-[#EBE6E0] dark:border-white/10 hover:bg-[#EBE6E0]/30 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#0F0E0D]/80 dark:text-white/80 transition-colors">{trx.id}</td>
                      <td className="px-6 py-4 font-bold text-[#0F0E0D] dark:text-white transition-colors">{trx.customer}</td>
                      <td className="px-6 py-4 font-medium text-[#0F0E0D]/60 dark:text-white/60 transition-colors">{trx.items} item(s)</td>
                      <td className="px-6 py-4 font-medium text-[#0F0E0D]/60 dark:text-white/60 transition-colors">{trx.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-fit ${statusInfo.style} transition-colors`}>
                          {statusInfo.icon} {trx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#0F0E0D] dark:text-white text-right transition-colors">{trx.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 text-[#0F0E0D]/40 dark:text-white/40 hover:text-[#0F0E0D] dark:hover:text-white transition-colors rounded-lg hover:bg-[#EBE6E0] dark:hover:bg-white/10 inline-flex">
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

// Subcomponents
function StatCard({ title, value, trend, isPositive, icon, variants, isDark = false }) {
  const cardBg = isDark ? "bg-[#111111] dark:bg-[#E9E3DB]" : "bg-white dark:bg-[#111111]";
  const textColor = isDark ? "text-white dark:text-[#0F0E0D]" : "text-[#0F0E0D] dark:text-white";
  const titleColor = isDark ? "text-white/40 dark:text-[#0F0E0D]/40" : "text-[#0F0E0D]/40 dark:text-white/40";
  const borderColor = isDark ? "border-transparent" : "border-[#EBE6E0] dark:border-white/10";
  
  // Custom pill colors
  const pillBg = isPositive ? "bg-[#E6F4EA]" : "bg-[#FCE8E6]";
  const pillText = isPositive ? "text-[#1E7E34]" : "text-[#C5221F]";

  return (
    <motion.div 
      variants={variants} 
      className={`${cardBg} ${borderColor} border p-7 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[190px] group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden`}
    >
      {/* Top Row: Icon and Badge */}
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className={`${textColor} stroke-2 transition-colors`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${pillBg} ${pillText} transition-colors`}>
          {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />} {trend}
        </div>
      </div>
      
      {/* Bottom Row: Text content */}
      <div className="relative z-10 mt-6">
        <h3 className={`${titleColor} font-bold text-[10px] uppercase tracking-[0.15em] mb-1.5 transition-colors`}>{title}</h3>
        <p className={`${textColor} text-[2rem] font-extrabold tracking-tight leading-none transition-colors`}>{value}</p>
      </div>
      
      {/* Decorative Wavy Lines */}
      <div className="absolute -right-4 -bottom-4 pointer-events-none z-0">
        {isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="dark:hidden">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#1C1C1C"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : null}
        {isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="hidden dark:block">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#D5CBB9"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#C4BEB6" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : null}

        {!isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="dark:hidden">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#FAFAFA"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#E5E5E5" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : null}
        {!isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="hidden dark:block">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#151515"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : null}
      </div>
    </motion.div>
  );
}