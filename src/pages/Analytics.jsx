import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  MousePointerClick,
  BarChart2,
  PieChart,
  Loader2,
  ChevronDown,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // --- ALUTH: Notification & Dropdown States ---
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeframes = ['Last 7 Days', 'Last 30 Days', 'This Year'];

  // Metrics States
  const [metrics, setMetrics] = useState({
    revenue: 0,
    visitors: 0,
    conversion: 0,
    clicks: 0
  });

  // Chart & Filter States
  const [timeframe, setTimeframe] = useState('Last 7 Days');
  const [chartData, setChartData] = useState({ bars: [], maxRev: 100, maxOrd: 10, labels: [] });
  
  // Category States
  const [categorySales, setCategorySales] = useState([]);

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3500);
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [orders, products] = await Promise.all([
          orderService.getAll(),
          productService.getAll()
        ]);

        setAllOrders(orders);
        setAllProducts(products);

        // 1. Calculate Real Revenue
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        
        const baseVisitors = orders.length > 0 ? orders.length * 85 : 0; 
        const convRate = orders.length > 0 ? ((orders.length / baseVisitors) * 100).toFixed(1) : 0;

        setMetrics({
          revenue: totalRevenue,
          visitors: baseVisitors + Math.floor(Math.random() * 500),
          conversion: convRate,
          clicks: (baseVisitors * 2.4) + Math.floor(Math.random() * 1000)
        });

        // 2. Calculate Category Sales
        const catTotals = {};
        let grandTotalItems = 0;

        const productMap = {};
        products.forEach(p => { productMap[p.id] = p.category || 'General'; });

        orders.forEach(order => {
          let items = order.items;
          
          if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch (e) { items = []; }
          }

          if (items && Array.isArray(items)) {
            items.forEach(item => {
              const cat = productMap[item.product_id] || item.category || 'General';
              const itemTotal = (Number(item.price || item.unit_price) || 0) * (Number(item.qty || item.quantity) || 1);
              
              if (itemTotal > 0) {
                catTotals[cat] = (catTotals[cat] || 0) + itemTotal;
                grandTotalItems += itemTotal;
              }
            });
          }
        });

        // Format for UI (Top 4 categories)
        const catArray = Object.keys(catTotals).map(cat => ({
          name: cat,
          amount: catTotals[cat],
          percentage: grandTotalItems > 0 ? Math.round((catTotals[cat] / grandTotalItems) * 100) : 0
        })).sort((a, b) => b.amount - a.amount).slice(0, 4);

        setCategorySales(catArray);

      } catch (error) {
        console.error("Failed to load analytics", error);
        showNotification("Failed to load analytics data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // --- Dynamic Chart Calculation ---
  useEffect(() => {
    if (!allOrders.length) return;

    const now = new Date();
    const dataMap = new Map();
    let labelKeys = [];
    let maxR = 0;
    let maxO = 0;

    if (timeframe === 'Last 7 Days') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-US', { weekday: 'short' });
        labelKeys.push(key);
        dataMap.set(key, { rev: 0, ord: 0, rawDate: d.toDateString() });
      }

      allOrders.forEach(order => {
        const d = new Date(order.created_at);
        const key = d.toLocaleDateString('en-US', { weekday: 'short' });
        if (dataMap.has(key)) {
          const current = dataMap.get(key);
          current.rev += Number(order.total_amount) || 0;
          current.ord += 1;
        }
      });
    } else if (timeframe === 'Last 30 Days') {
      for (let i = 5; i >= 0; i--) {
        const key = `Week ${6-i}`;
        labelKeys.push(key);
        dataMap.set(key, { rev: 0, ord: 0 });
      }
      
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      allOrders.forEach(order => {
        const d = new Date(order.created_at);
        if(d >= thirtyDaysAgo) {
           const dayDiff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
           const weekIndex = Math.max(0, 5 - Math.floor(dayDiff / 6));
           const key = `Week ${weekIndex + 1}`;
           if(dataMap.has(key)) {
             dataMap.get(key).rev += Number(order.total_amount) || 0;
             dataMap.get(key).ord += 1;
           }
        }
      });
    } else if (timeframe === 'This Year') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labelKeys = monthNames;
      labelKeys.forEach(m => dataMap.set(m, { rev: 0, ord: 0 }));

      allOrders.forEach(order => {
        const d = new Date(order.created_at);
        if (d.getFullYear() === now.getFullYear()) {
          const key = monthNames[d.getMonth()];
          dataMap.get(key).rev += Number(order.total_amount) || 0;
          dataMap.get(key).ord += 1;
        }
      });
    }

    const processedData = labelKeys.map(key => {
      const d = dataMap.get(key);
      if(d.rev > maxR) maxR = d.rev;
      if(d.ord > maxO) maxO = d.ord;
      return { label: key, rev: d.rev, ord: d.ord };
    });

    setChartData({
      bars: processedData,
      maxRev: maxR > 0 ? maxR : 100, 
      maxOrd: maxO > 0 ? maxO : 10,
      labels: labelKeys
    });

  }, [timeframe, allOrders]);

  // --- ALUTH: Download Report Logic (CSV Generation) ---
  const handleDownloadReport = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Header
      csvContent += "LUSTRE PERFORMANCE REPORT\n";
      csvContent += `Timeframe: ${timeframe}\n`;
      csvContent += `Generated On: ${new Date().toLocaleDateString()}\n\n`;
      
      // Metrics
      csvContent += "METRICS SUMMARY\n";
      csvContent += `Total Revenue,LKR ${metrics.revenue.toFixed(2)}\n`;
      csvContent += `Store Visitors,${metrics.visitors}\n`;
      csvContent += `Conversion Rate,${metrics.conversion}%\n`;
      csvContent += `Total Clicks,${metrics.clicks}\n\n`;

      // Category Sales
      csvContent += "CATEGORY SALES\n";
      csvContent += "Category,Amount,Percentage\n";
      categorySales.forEach(cat => {
        csvContent += `${cat.name},$${cat.amount.toFixed(2)},${cat.percentage}%\n`;
      });

      // Chart Data (Timeframe specifics)
      csvContent += `\nREVENUE OVER TIME (${timeframe})\n`;
      csvContent += "Period,Revenue,Orders\n";
      chartData.bars.forEach(bar => {
        csvContent += `${bar.label},$${bar.rev.toFixed(2)},${bar.ord}\n`;
      });

      // Create download link and click it
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Lustre_Report_${timeframe.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("Report downloaded successfully!", "success");
    } catch (error) {
      console.error("Download failed", error);
      showNotification("Failed to generate report", "error");
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  const catColors = [
    { bg: "bg-[#0F0E0D] dark:bg-white", text: "text-white dark:text-[#0F0E0D]" },
    { bg: "bg-[#3d352e] dark:bg-[#C4BEB6]", text: "text-white dark:text-[#0F0E0D]" },
    { bg: "bg-[#C4BEB6] dark:bg-white/50", text: "text-[#0F0E0D] dark:text-white" },
    { bg: "bg-[#E9E3DB] dark:bg-white/20", text: "text-[#0F0E0D] dark:text-white" }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBF9F6] dark:bg-[#0A0A0A] text-[#0F0E0D]/40 dark:text-white/40 transition-colors">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300 relative">
      
      {/* --- NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} 
            exit={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md border ${
              notification.type === 'error' 
                ? 'bg-white/90 dark:bg-[#111111]/90 border-red-200 dark:border-red-500/20' 
                : 'bg-white/90 dark:bg-[#111111]/90 border-green-200 dark:border-green-500/20'
            }`}
          >
            {notification.type === 'error' ? (
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <AlertCircle size={16} strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                <Check size={16} strokeWidth={2.5} />
              </div>
            )}
            <span className={`text-sm font-bold tracking-wide ${notification.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Performance Analytics</h1>
            <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">In-depth performance metrics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0 relative z-40">
            
            {/* --- ALUTH: CUSTOM DROPDOWN UI --- */}
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-48 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 px-5 py-3.5 sm:py-3 rounded-full sm:rounded-[1.5rem] text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white outline-none hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm flex items-center justify-between gap-3"
              >
                <span>{timeframe}</span>
                <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 sm:left-0 top-[110%] w-full sm:w-48 bg-white dark:bg-[#181818] border border-[#EBE6E0] dark:border-white/10 rounded-2xl shadow-xl overflow-hidden p-1 z-50"
                    >
                      {timeframes.map(tf => (
                        <button
                          key={tf}
                          onClick={() => {
                            setTimeframe(tf);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors ${timeframe === tf ? 'bg-[#0F0E0D] text-white dark:bg-white dark:text-[#0F0E0D]' : 'text-[#0F0E0D]/60 dark:text-white/60 hover:bg-[#FBF9F6] dark:hover:bg-white/5'}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* --- ALUTH: DOWNLOAD BUTTON ACTION --- */}
            <button 
              onClick={handleDownloadReport}
              className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-full sm:rounded-[1.5rem] text-xs font-bold uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <Download size={16} strokeWidth={2.5} />
              Download Report
            </button>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          <StatCard 
            title="Total Revenue" 
            value={`LKR  ${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            trend="Real-time" 
            isPositive={true} 
            icon={<DollarSign size={24} />} 
            variants={itemVariants} 
            isDark={true} 
          />
          <StatCard 
            title="Store Visitors" 
            value={metrics.visitors.toLocaleString()} 
            trend="Simulated" 
            isPositive={true} 
            icon={<Users size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Conversion Rate" 
            value={`${metrics.conversion}%`} 
            trend="Average" 
            isPositive={metrics.conversion > 2} 
            icon={<Activity size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Total Clicks" 
            value={metrics.clicks.toLocaleString()} 
            trend="Est. Traffic" 
            isPositive={true} 
            icon={<MousePointerClick size={24} />} 
            variants={itemVariants} 
          />
        </div>

        {/* MAIN CHART SECTION */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight transition-colors">Revenue vs. Orders</h2>
              <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium mt-1 transition-colors">Data mapped by {timeframe}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F0E0D]/70 dark:text-white/70 uppercase tracking-widest transition-colors">
                <div className="w-3 h-3 rounded-full bg-[#0F0E0D] dark:bg-white/20"></div> Revenue
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F0E0D]/70 dark:text-white/70 uppercase tracking-widest transition-colors">
                <div className="w-3 h-3 rounded-full bg-[#C4BEB6] dark:bg-white"></div> Orders
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto w-full pb-4 scrollbar-hide">
            <div className="h-[250px] sm:h-[350px] min-w-[600px] w-full bg-[#FBF9F6] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#EBE6E0] dark:border-white/10 flex items-end justify-between px-6 sm:px-8 pt-10 pb-8 relative group overflow-hidden transition-colors">
              
              <div className="absolute left-4 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs font-bold text-[#0F0E0D]/30 dark:text-white/30 transition-colors">
                <span>{chartData.maxRev >= 1000 ? `${(chartData.maxRev/1000).toFixed(1)}k` : chartData.maxRev}</span>
                <span>{chartData.maxRev >= 1000 ? `${((chartData.maxRev*0.75)/1000).toFixed(1)}k` : Math.round(chartData.maxRev*0.75)}</span>
                <span>{chartData.maxRev >= 1000 ? `${((chartData.maxRev*0.5)/1000).toFixed(1)}k` : Math.round(chartData.maxRev*0.5)}</span>
                <span>{chartData.maxRev >= 1000 ? `${((chartData.maxRev*0.25)/1000).toFixed(1)}k` : Math.round(chartData.maxRev*0.25)}</span>
                <span>0</span>
              </div>

              {chartData.bars.map((dataPoint, i) => {
                const revPercent = (dataPoint.rev / chartData.maxRev) * 100;
                const ordPercent = (dataPoint.ord / chartData.maxOrd) * 100;
                
                const revHeight = Math.max(revPercent * 2.2, 5); 
                const ordHeight = Math.max(ordPercent * 2.2, 5);

                return (
                  <div key={i} className="flex flex-col items-center gap-2 w-full max-w-[30px] sm:max-w-[40px] group-hover:scale-y-[1.02] transition-transform origin-bottom cursor-pointer relative" title={`${dataPoint.label}: $${dataPoint.rev.toFixed(2)} | ${dataPoint.ord} Orders`}>
                    <div className="w-full bg-[#0F0E0D] dark:bg-white/20 rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${revHeight}px` }}></div>
                    <div className="w-full bg-[#C4BEB6] dark:bg-white rounded-t-lg absolute bottom-0 opacity-80 transition-all duration-500" style={{ height: `${ordHeight * 0.6}px` }}></div>
                    <span className="absolute -bottom-6 text-[9px] font-bold text-[#0F0E0D]/40 dark:text-white/40 whitespace-nowrap">{dataPoint.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM ROW: CATEGORIES & TRAFFIC */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 transition-colors"><PieChart size={22} /> Sales by Category</h2>
            </div>
            
            <div className="space-y-6">
              {categorySales.length > 0 ? categorySales.map((cat, idx) => (
                <CategoryBar 
                  key={idx}
                  name={cat.name} 
                  percentage={cat.percentage} 
                  color={catColors[idx % 4].bg} 
                  textColor={catColors[idx % 4].text}
                  amount={`$${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                />
              )) : (
                <p className="text-sm font-bold text-[#0F0E0D]/40 text-center py-4">Add products to orders to see data</p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 transition-colors"><BarChart2 size={22} /> Traffic Sources</h2>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <TrafficRow source="Direct Search" visits={Math.floor(metrics.visitors * 0.4).toLocaleString()} percentage="+12%" isPositive={true} />
              <TrafficRow source="Instagram" visits={Math.floor(metrics.visitors * 0.25).toLocaleString()} percentage="+25%" isPositive={true} />
              <TrafficRow source="Google Ads" visits={Math.floor(metrics.visitors * 0.2).toLocaleString()} percentage="-2%" isPositive={false} />
              <TrafficRow source="Email Newsletter" visits={Math.floor(metrics.visitors * 0.1).toLocaleString()} percentage="+8%" isPositive={true} />
              <TrafficRow source="TikTok" visits={Math.floor(metrics.visitors * 0.05).toLocaleString()} percentage="+45%" isPositive={true} />
            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </div>
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
    <motion.div variants={variants} className={`${cardBg} ${borderColor} border p-6 sm:p-7 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[160px] sm:min-h-[190px] group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden`}>
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className={`${textColor} stroke-2 transition-colors`}>{icon}</div>
        <div className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full ${pillBg} ${pillText} transition-colors`}>
          {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />} {trend}
        </div>
      </div>
      <div className="relative z-10 mt-5 sm:mt-6">
        <h3 className={`${titleColor} font-bold text-[10px] uppercase tracking-[0.15em] mb-1.5 transition-colors`}>{title}</h3>
        <p className={`${textColor} text-[1.75rem] sm:text-[2rem] font-extrabold tracking-tight leading-none transition-colors`}>{value}</p>
      </div>
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
    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-[#EBE6E0]/30 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-[#EBE6E0] dark:hover:border-white/10 cursor-pointer">
      <div className="font-bold text-[#0F0E0D] dark:text-white text-xs sm:text-sm transition-colors">{source}</div>
      <div className="flex items-center gap-3 sm:gap-6">
        <span className="text-[#0F0E0D]/70 dark:text-white/70 font-medium text-xs sm:text-sm transition-colors">{visits} visits</span>
        <span className={`text-xs font-bold w-10 sm:w-12 text-right ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors`}>
          {percentage}
        </span>
      </div>
    </div>
  );
}