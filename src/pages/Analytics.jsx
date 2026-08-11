import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  MousePointerClick,
  BarChart2,
  PieChart
} from 'lucide-react';

export default function Analytics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-8 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      
      {/* HEADER CONTROLS */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Performance Analytics</h1>
          <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-2 transition-colors">In-depth performance metrics</p>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white outline-none cursor-pointer hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm">
            <option className="dark:bg-[#111111]">Last 7 Days</option>
            <option className="dark:bg-[#111111]">Last 30 Days</option>
            <option className="dark:bg-[#111111]">This Year</option>
          </select>
          <button className="px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors">
            Download Report
          </button>
        </div>
      </motion.div>

      {/* TOP METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$234,563" 
          trend="+14.5%" 
          isPositive={true} 
          icon={<DollarSign size={24} />} 
          variants={itemVariants} 
          isDark={true} // <-- Enables the inverted black design
        />
        <StatCard 
          title="Store Visitors" 
          value="45,291" 
          trend="+22.4%" 
          isPositive={true} 
          icon={<Users size={24} />} 
          variants={itemVariants} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          trend="-0.4%" 
          isPositive={false} 
          icon={<Activity size={24} />} 
          variants={itemVariants} 
        />
        <StatCard 
          title="Total Clicks" 
          value="112,403" 
          trend="+8.1%" 
          isPositive={true} 
          icon={<MousePointerClick size={24} />} 
          variants={itemVariants} 
        />
      </div>

      {/* MAIN CHART SECTION */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 transition-colors">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight transition-colors">Revenue vs. Orders</h2>
            <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium mt-1 transition-colors">Daily performance tracking</p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F0E0D]/70 dark:text-white/70 uppercase tracking-widest transition-colors">
              <div className="w-3 h-3 rounded-full bg-[#0F0E0D] dark:bg-white"></div> Revenue
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F0E0D]/70 dark:text-white/70 uppercase tracking-widest transition-colors">
              <div className="w-3 h-3 rounded-full bg-[#C4BEB6] dark:bg-white/40"></div> Orders
            </div>
          </div>
        </div>
        
        {/* Abstract Chart Graphic */}
        <div className="h-[350px] w-full bg-[#FBF9F6] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#EBE6E0] dark:border-white/10 flex items-end justify-between px-8 pt-10 pb-4 relative group overflow-hidden transition-colors">
          {/* Y-Axis Labels */}
          <div className="absolute left-4 top-10 bottom-4 flex flex-col justify-between text-xs font-bold text-[#0F0E0D]/30 dark:text-white/30 transition-colors">
            <span>100k</span>
            <span>75k</span>
            <span>50k</span>
            <span>25k</span>
            <span>0</span>
          </div>

          {/* Abstract Bars */}
          {[60, 45, 80, 50, 95, 70, 110, 85, 120, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-full max-w-[40px] group-hover:scale-y-[1.02] transition-transform origin-bottom cursor-pointer relative">
              <div className="w-full bg-[#0F0E0D] dark:bg-white rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${h * 2}px` }}></div>
              <div className="w-full bg-[#C4BEB6] dark:bg-white/30 rounded-t-lg absolute bottom-0 opacity-80 transition-all duration-500" style={{ height: `${(h * 2) * 0.6}px` }}></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* BOTTOM ROW: CATEGORIES & TRAFFIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sales By Category */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 transition-colors"><PieChart size={22} /> Sales by Category</h2>
          </div>
          
          <div className="space-y-6">
            <CategoryBar name="Outerwear" percentage={45} color="bg-[#0F0E0D] dark:bg-white" amount="$105,553" />
            <CategoryBar name="Tops & Shirts" percentage={28} color="bg-[#3d352e] dark:bg-[#C4BEB6]" amount="$65,677" />
            <CategoryBar name="Bottoms" percentage={17} color="bg-[#C4BEB6] dark:bg-white/50" amount="$39,875" />
            <CategoryBar name="Accessories" percentage={10} color="bg-[#E9E3DB] dark:bg-white/20" amount="$23,458" textColor="text-[#0F0E0D] dark:text-white" />
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 transition-colors"><BarChart2 size={22} /> Traffic Sources</h2>
          </div>
          
          <div className="space-y-4">
            <TrafficRow source="Direct Search" visits="18,492" percentage="+12%" isPositive={true} />
            <TrafficRow source="Instagram" visits="12,105" percentage="+25%" isPositive={true} />
            <TrafficRow source="Google Ads" visits="9,340" percentage="-2%" isPositive={false} />
            <TrafficRow source="Email Newsletter" visits="3,211" percentage="+8%" isPositive={true} />
            <TrafficRow source="TikTok" visits="2,143" percentage="+45%" isPositive={true} />
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}

// --- SUBCOMPONENTS ---

function StatCard({ title, value, trend, isPositive, icon, variants, isDark = false }) {
  const cardBg = isDark ? "bg-[#111111] dark:bg-[#E9E3DB]" : "bg-white dark:bg-[#111111]";
  const textColor = isDark ? "text-white dark:text-[#0F0E0D]" : "text-[#0F0E0D] dark:text-white";
  const titleColor = isDark ? "text-white/40 dark:text-[#0F0E0D]/40" : "text-[#0F0E0D]/40 dark:text-white/40";
  const borderColor = isDark ? "border-transparent" : "border-[#EBE6E0] dark:border-white/10";
  
  const pillBg = isPositive 
    ? (isDark ? "bg-[#E6F4EA] dark:bg-green-100" : "bg-[#E6F4EA] dark:bg-green-500/20") 
    : (isDark ? "bg-[#FCE8E6] dark:bg-red-100" : "bg-[#FCE8E6] dark:bg-red-500/20");
    
  const pillText = isPositive 
    ? (isDark ? "text-[#1E7E34] dark:text-green-700" : "text-[#1E7E34] dark:text-green-400") 
    : (isDark ? "text-[#C5221F] dark:text-red-700" : "text-[#C5221F] dark:text-red-400");

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
      <div className="absolute -right-4 -bottom-4 pointer-events-none z-0 transition-opacity">
        {isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="dark:hidden">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#1C1C1C"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : null}
        
        {isDark ? (
          <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="hidden dark:block">
            <path d="M0 80C35 80 60 40 90 55C115 67.5 130 65 150 50V100H0V80Z" fill="#E2DCD4"/>
            <path d="M20 100C45 75 80 45 110 65C130 78.3333 145 75 150 65" stroke="#D5CBB9" strokeWidth="2.5" strokeLinecap="round"/>
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

function CategoryBar({ name, percentage, color, amount, textColor = "text-white dark:text-[#0F0E0D]" }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-[#0F0E0D] dark:text-white transition-colors">{name}</span>
        <span className="text-[#0F0E0D]/60 dark:text-white/60 transition-colors">{amount}</span>
      </div>
      <div className="w-full h-4 bg-[#EBE6E0] dark:bg-white/10 rounded-full overflow-hidden transition-colors">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full flex items-center justify-end pr-2 text-[10px] font-bold ${textColor} transition-colors`}
        >
          {percentage}%
        </motion.div>
      </div>
    </div>
  );
}

function TrafficRow({ source, visits, percentage, isPositive }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#EBE6E0]/30 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-[#EBE6E0] dark:hover:border-white/10 cursor-pointer">
      <div className="font-bold text-[#0F0E0D] dark:text-white text-sm transition-colors">{source}</div>
      <div className="flex items-center gap-6">
        <span className="text-[#0F0E0D]/70 dark:text-white/70 font-medium text-sm transition-colors">{visits} visits</span>
        <span className={`text-xs font-bold w-12 text-right ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors`}>
          {percentage}
        </span>
      </div>
    </div>
  );
}