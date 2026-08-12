import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Package, TrendingUp, TrendingDown, MoreHorizontal, ShoppingBag } from 'lucide-react';

export default function Overview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Mock data for the chart labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value="$124,563" 
            trend="+12.5%" 
            isPositive={true} 
            icon={<DollarSign size={24} />} 
            variants={itemVariants} 
            isDark={true} // Enables the black design
          />
          <StatCard 
            title="Active Orders" 
            value="842" 
            trend="+5.2%" 
            isPositive={true} 
            icon={<ShoppingBag size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Total Customers" 
            value="3,291" 
            trend="-1.4%" 
            isPositive={false} 
            icon={<Users size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Total Products" 
            value="1,423" 
            trend="+8.1%" 
            isPositive={true} 
            icon={<Package size={24} />} 
            variants={itemVariants} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* REVENUE ANALYTICS CHART */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 flex flex-col min-h-[420px] transition-colors">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Revenue Analytics</h2>
                <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium mt-1 transition-colors">Monthly performance summary</p>
              </div>
              <select className="bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold border-none outline-none cursor-pointer hover:bg-[#EBE6E0] dark:hover:bg-white/20 transition-colors">
                <option className="dark:bg-[#111111]">This Year</option>
                <option className="dark:bg-[#111111]">Last 6 Months</option>
              </select>
            </div>
            
            {/* The Actual Chart Area */}
            <div className="flex-1 relative flex flex-col">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-8 px-2">
                {[100, 75, 50, 25, 0].map((val, i) => (
                  <div key={i} className="flex items-center gap-4 w-full">
                    <span className="text-xs font-bold text-[#0F0E0D]/30 dark:text-white/30 w-8 text-right transition-colors">{val}k</span>
                    <div className="flex-1 border-t border-dashed border-[#EBE6E0] dark:border-white/10 transition-colors"></div>
                  </div>
                ))}
              </div>

              {/* SVG Line Chart (FIXED COLORS) */}
              <div className="absolute inset-0 ml-14 mb-8">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1" className="text-[#0F0E0D] dark:text-white transition-colors">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path 
                    d="M 0,250 C 100,200 200,280 300,180 C 400,80 500,150 600,100 C 700,50 800,120 900,40 C 950,0 1000,50 1000,50 L 1000,300 L 0,300 Z" 
                    fill="url(#colorRevenue)" 
                  />
                  {/* Line */}
                  <path 
                    d="M 0,250 C 100,200 200,280 300,180 C 400,80 500,150 600,100 C 700,50 800,120 900,40 C 950,0 1000,50 1000,50" 
                    fill="none" 
                    className="stroke-[#0F0E0D] dark:stroke-white transition-colors drop-shadow-md"
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Data Point Dots */}
                  {[
                    { cx: "300", cy: "180" },
                    { cx: "600", cy: "100" },
                    { cx: "900", cy: "40" }
                  ].map((point, i) => (
                    <circle 
                      key={i} 
                      cx={point.cx} 
                      cy={point.cy} 
                      r="6" 
                      className="fill-white dark:fill-[#111111] stroke-[#0F0E0D] dark:stroke-white transition-all duration-300 cursor-pointer hover:scale-125 origin-center" 
                      strokeWidth="3" 
                    />
                  ))}
                </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="mt-auto ml-14 flex justify-between pr-4 relative z-10">
                {months.map((month, i) => (
                  <span key={i} className="text-xs font-bold text-[#0F0E0D]/40 dark:text-white/40 transition-colors">{month}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* TOP SELLING PRODUCTS */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Top Products</h2>
              <button className="text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
            </div>
            <div className="space-y-5">
              <TopProductRow name="Puffer Jacket with Pocket" category="Outerwear" price="$89.00" sales="245 sales" img="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop" />
              <TopProductRow name="Minimalist Knit Sweater" category="Tops" price="$65.00" sales="190 sales" img="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=150&auto=format&fit=crop" />
              <TopProductRow name="Wide Leg Tailored Pants" category="Bottoms" price="$110.00" sales="156 sales" img="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop" />
            </div>
            <button className="w-full mt-6 py-3.5 bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white font-bold rounded-2xl text-sm hover:bg-[#EBE6E0] dark:hover:bg-white/20 transition-colors">
              View All Products
            </button>
          </motion.div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Recent Orders</h2>
              <button className="text-sm font-bold text-[#0F0E0D]/60 dark:text-white/60 hover:text-[#0F0E0D] dark:hover:text-white transition-colors">See All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#0F0E0D]/50 dark:text-white/50 text-xs uppercase tracking-wider border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
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
  const pillBg = isPositive ? "bg-[#E6F4EA] dark:bg-green-100" : "bg-[#FCE8E6] dark:bg-red-100";
  const pillText = isPositive ? "text-[#1E7E34] dark:text-green-700" : "text-[#C5221F] dark:text-red-700";

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
      
      {/* Decorative Wavy Lines (FIXED FOR DARK MODE) */}
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

function TopProductRow({ name, category, price, sales, img }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#EBE6E0] dark:bg-white/10 transition-colors">
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#0F0E0D] dark:text-white group-hover:opacity-75 transition-colors">{name}</h4>
          <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">{price}</p>
        <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">{sales}</p>
      </div>
    </div>
  );
}

function OrderRow({ id, name, date, status, amount }) {
  const getStatusStyle = (s) => {
    switch(s) {
      case 'Delivered': return 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]';
      case 'Processing': return 'bg-[#EBE6E0] dark:bg-white/10 text-[#0F0E0D] dark:text-white';
      case 'Cancelled': return 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400';
      default: return 'bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white';
    }
  };
  return (
    <tr className="border-b border-[#EBE6E0] dark:border-white/10 hover:bg-[#EBE6E0]/30 dark:hover:bg-white/5 transition-colors group">
      <td className="py-4 font-bold text-[#0F0E0D] dark:text-white transition-colors">{id}</td>
      <td className="py-4 font-bold text-[#0F0E0D]/80 dark:text-white/80 transition-colors">{name}</td>
      <td className="py-4 font-medium text-[#0F0E0D]/60 dark:text-white/60 transition-colors">{date}</td>
      <td className="py-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(status)} transition-colors`}>{status}</span></td>
      <td className="py-4 font-bold text-[#0F0E0D] dark:text-white text-right transition-colors">{amount}</td>
    </tr>
  );
}