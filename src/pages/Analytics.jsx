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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1400px] w-full mx-auto space-y-8">
      
      {/* HEADER CONTROLS */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">Performance Analytics</h1>
        
        <div className="flex gap-3">
          <select className="bg-white border border-[#C4BEB6]/40 px-5 py-2.5 rounded-full text-sm font-bold text-[#1A1A1A] outline-none cursor-pointer hover:bg-[#C4BEB6]/5 transition-colors">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="px-6 py-2.5 bg-[#1A1A1A] text-[#E9E3DB] rounded-full text-sm font-bold shadow-lg hover:bg-[#1A1A1A]/80 transition-colors">
            Download Report
          </button>
        </div>
      </motion.div>

      {/* TOP METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$234,563.00" 
          trend="+14.5%" 
          isPositive={true} 
          icon={<DollarSign size={20} />} 
          variants={itemVariants} 
        />
        <StatCard 
          title="Store Visitors" 
          value="45,291" 
          trend="+22.4%" 
          isPositive={true} 
          icon={<Users size={20} />} 
          variants={itemVariants} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          trend="-0.4%" 
          isPositive={false} 
          icon={<Activity size={20} />} 
          variants={itemVariants} 
        />
        <StatCard 
          title="Total Clicks" 
          value="112,403" 
          trend="+8.1%" 
          isPositive={true} 
          icon={<MousePointerClick size={20} />} 
          variants={itemVariants} 
        />
      </div>

      {/* MAIN CHART SECTION */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Revenue vs. Orders</h2>
            <p className="text-sm text-[#1A1A1A]/50 font-medium mt-1">Daily performance tracking</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]/70">
              <div className="w-3 h-3 rounded-full bg-[#1A1A1A]"></div> Revenue
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]/70">
              <div className="w-3 h-3 rounded-full bg-[#C4BEB6]"></div> Orders
            </div>
          </div>
        </div>
        
        {/* Abstract Chart Graphic */}
        <div className="h-[350px] w-full bg-[#E9E3DB]/20 rounded-2xl border-2 border-dashed border-[#C4BEB6]/40 flex items-end justify-between px-8 pt-10 pb-4 relative group overflow-hidden">
          {/* Y-Axis Labels */}
          <div className="absolute left-4 top-10 bottom-4 flex flex-col justify-between text-xs font-bold text-[#1A1A1A]/30">
            <span>100k</span>
            <span>75k</span>
            <span>50k</span>
            <span>25k</span>
            <span>0</span>
          </div>

          {/* Abstract Bars */}
          {[60, 45, 80, 50, 95, 70, 110, 85, 120, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-full max-w-[40px] group-hover:scale-y-[1.02] transition-transform origin-bottom cursor-pointer relative">
              <div className="w-full bg-[#1A1A1A] rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${h * 2}px` }}></div>
              <div className="w-full bg-[#C4BEB6] rounded-t-lg absolute bottom-0 opacity-80 transition-all duration-500" style={{ height: `${(h * 2) * 0.6}px` }}></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* BOTTOM ROW: CATEGORIES & TRAFFIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sales By Category */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2"><PieChart size={20} /> Sales by Category</h2>
          </div>
          
          <div className="space-y-6">
            <CategoryBar name="Outerwear" percentage={45} color="bg-[#1A1A1A]" amount="$105,553" />
            <CategoryBar name="Tops & Shirts" percentage={28} color="bg-[#3d352e]" amount="$65,677" />
            <CategoryBar name="Bottoms" percentage={17} color="bg-[#C4BEB6]" amount="$39,875" />
            <CategoryBar name="Accessories" percentage={10} color="bg-[#E9E3DB]" amount="$23,458" textColor="text-[#1A1A1A]" />
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2"><BarChart2 size={20} /> Traffic Sources</h2>
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

function StatCard({ title, value, trend, isPositive, icon, variants }) {
  return (
    <motion.div variants={variants} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-[#C4BEB6]/20 flex flex-col group hover:border-[#1A1A1A]/30 transition-colors cursor-pointer relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#C4BEB6]/15 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-[#E9E3DB] transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-[#1A1A1A]/60 font-medium text-sm mb-1">{title}</h3>
        <p className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{value}</p>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#C4BEB6]/5 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
    </motion.div>
  );
}

function CategoryBar({ name, percentage, color, amount, textColor = "text-white" }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-[#1A1A1A]">{name}</span>
        <span className="text-[#1A1A1A]/60">{amount}</span>
      </div>
      <div className="w-full h-4 bg-[#C4BEB6]/20 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full flex items-center justify-end pr-2 text-[10px] font-bold ${textColor}`}
        >
          {percentage}%
        </motion.div>
      </div>
    </div>
  );
}

function TrafficRow({ source, visits, percentage, isPositive }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#C4BEB6]/10 transition-colors border border-transparent hover:border-[#C4BEB6]/30 cursor-pointer">
      <div className="font-bold text-[#1A1A1A] text-sm">{source}</div>
      <div className="flex items-center gap-6">
        <span className="text-[#1A1A1A]/70 font-medium text-sm">{visits} visits</span>
        <span className={`text-xs font-bold w-12 text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {percentage}
        </span>
      </div>
    </div>
  );
}