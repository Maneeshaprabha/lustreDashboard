import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShoppingBag,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';

export default function Sales() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  
  // Metrics
  const [metrics, setMetrics] = useState({
    grossSales: 0,
    netSales: 0,
    aov: 0,
    refundRate: 0,
  });

  // Chart Data
  const [chartData, setChartData] = useState({ linePath: '', areaPath: '', points: [], labels: [], maxVal: 100 });

  // Pagination for Transactions Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Notification
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3500);
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAll();
        
        // Sort newest first
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(sortedData);

        // Calculate Metrics
        let gross = 0;
        let refunded = 0;
        let validOrdersCount = 0;

        sortedData.forEach(order => {
          const amount = Number(order.total_amount) || 0;
          const status = (order.status || '').toUpperCase();
          
          gross += amount;

          if (status === 'CANCELLED' || status === 'REFUNDED') {
            refunded += amount;
          } else {
            validOrdersCount++;
          }
        });

        const net = gross - refunded;
        const aov = validOrdersCount > 0 ? net / validOrdersCount : 0;
        const refundRate = sortedData.length > 0 ? ((sortedData.length - validOrdersCount) / sortedData.length) * 100 : 0;

        setMetrics({
          grossSales: gross,
          netSales: net,
          aov: aov,
          refundRate: refundRate
        });

        // Calculate 7-Day Chart Data
        generateChartData(sortedData);

      } catch (error) {
        console.error("Failed to fetch sales data", error);
        showNotification("Failed to load sales data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const generateChartData = (allOrders) => {
    const now = new Date();
    const last7Days = [];
    const salesMap = new Map();

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push(dayName);
      salesMap.set(dayName, 0);
    }

    // Map orders to days
    allOrders.forEach(order => {
      const d = new Date(order.created_at);
      const diffTime = Math.abs(now - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 7) {
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        if (salesMap.has(dayName)) {
          salesMap.set(dayName, salesMap.get(dayName) + (Number(order.total_amount) || 0));
        }
      }
    });

    const dataValues = last7Days.map(day => salesMap.get(day));
    const maxVal = Math.max(...dataValues, 100); // Minimum scale 100

    // SVG Constraints
    const minX = 0, maxX = 1000;
    const minY = 50, maxY = 250;

    const points = dataValues.map((val, i) => {
      const x = minX + (i * (maxX - minX) / (dataValues.length - 1));
      const y = maxY - (val / maxVal) * (maxY - minY);
      return { x, y, val, label: last7Days[i] };
    });

    let linePath = `M ${points[0]?.x},${points[0]?.y} `;
    let areaPath = `M ${points[0]?.x},${maxY} L ${points[0]?.x},${points[0]?.y} `;

    for (let i = 1; i < points.length; i++) {
      const pPrev = points[i - 1];
      const p = points[i];
      const cp1x = (pPrev.x + p.x) / 2;
      const cp1y = pPrev.y;
      const cp2x = (pPrev.x + p.x) / 2;
      const cp2y = p.y;
      
      linePath += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y} `;
      areaPath += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y} `;
    }
    
    areaPath += `L ${points[points.length - 1]?.x},${maxY} Z`;

    setChartData({ linePath, areaPath, points, labels: last7Days, maxVal });
  };

  const handleExportCSV = () => {
    try {
      let csv = "Transaction ID,Customer,Items,Date,Status,Amount\n";
      orders.forEach(order => {
        let itemsCount = 0;
        if (typeof order.items === 'string') {
          try { itemsCount = JSON.parse(order.items).length; } catch(e) {}
        } else if (Array.isArray(order.items)) {
          itemsCount = order.items.length;
        }

        const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const amount = Number(order.total_amount || 0).toFixed(2);
        
        csv += `"${order.custom_id || order.order_number}","${order.customer_name}",${itemsCount},"${date}","${order.status}","$${amount}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'Lustre_Sales_Transactions.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showNotification("Sales data exported successfully!", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to export data", "error");
    }
  };

  const getStatusDisplay = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    switch(s) {
      case 'DELIVERED':
      case 'SHIPPED':
        return { style: 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D]', icon: <CheckCircle2 size={14} /> };
      case 'PENDING':
      case 'PROCESSING':
        return { style: 'bg-[#FFF9F4] dark:bg-orange-500/20 text-[#6A4A2E] dark:text-orange-400 border border-[#F2EAE2] dark:border-orange-500/30', icon: <Clock size={14} /> };
      case 'CANCELLED':
      case 'REFUNDED':
        return { style: 'bg-[#FFF4F4] dark:bg-red-500/20 text-[#6A3131] dark:text-red-400 border border-[#F2E2E2] dark:border-red-500/30', icon: <RotateCcw size={14} /> };
      default: 
        return { style: 'bg-[#FBF9F6] dark:bg-white/10 text-[#0F0E0D] dark:text-white', icon: null };
    }
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBF9F6] dark:bg-[#0A0A0A] text-[#0F0E0D]/40 dark:text-white/40 transition-colors">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Sales Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300 relative">
      
      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} 
            exit={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md border ${
              notification.type === 'error' ? 'bg-white/90 dark:bg-[#111111]/90 border-red-200 dark:border-red-500/20' : 'bg-white/90 dark:bg-[#111111]/90 border-green-200 dark:border-green-500/20'
            }`}
          >
            {notification.type === 'error' ? (
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0"><AlertCircle size={16} strokeWidth={2.5} /></div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 shrink-0"><Check size={16} strokeWidth={2.5} /></div>
            )}
            <span className={`text-sm font-bold tracking-wide ${notification.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER CONTROLS */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Sales & Transactions</h1>
            <p className="text-[10px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Manage your revenue stream</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button className="w-full sm:w-auto justify-center px-5 py-3.5 sm:py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full sm:rounded-[1.5rem] text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white flex items-center gap-2 hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm">
              <Filter size={16} /> Filter
            </button>
            <button onClick={handleExportCSV} className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-2.5 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-full sm:rounded-[1.5rem] text-xs font-bold uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </motion.div>

        {/* TOP METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Gross Sales" 
            value={`$${metrics.grossSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            trend="All Time" 
            isPositive={true} 
            icon={<DollarSign size={24} />} 
            variants={itemVariants} 
            isDark={true} 
          />
          <StatCard 
            title="Net Sales" 
            value={`$${metrics.netSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            trend="Valid Orders" 
            isPositive={true} 
            icon={<Wallet size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Average Order Value" 
            value={`$${metrics.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            trend="Per Order" 
            isPositive={true} 
            icon={<ShoppingBag size={24} />} 
            variants={itemVariants} 
          />
          <StatCard 
            title="Refund Rate" 
            value={`${metrics.refundRate.toFixed(1)}%`} 
            trend="Cancelled/Refunded" 
            isPositive={metrics.refundRate < 5} 
            icon={<RotateCcw size={24} />} 
            variants={itemVariants} 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* SALES TREND CHART AREA */}
          <motion.div variants={itemVariants} className="xl:col-span-2 bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 flex flex-col transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Sales Trend</h2>
                <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium mt-1 transition-colors">Daily revenue over the last 7 days</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-[#0F0E0D] dark:text-white transition-colors">
                  ${chartData.points.reduce((s, p) => s + p.val, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center sm:justify-end gap-1 transition-colors">
                  Last 7 Days
                </p>
              </div>
            </div>
            
            {/* The Actual Chart Area (Scrollable on Mobile) */}
            <div className="overflow-x-auto w-full pb-4 scrollbar-hide">
              <div className="h-[250px] sm:h-[300px] min-w-[600px] relative flex flex-col mt-4">
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-8 px-2">
                  {[1, 0.66, 0.33, 0].map((mult, i) => {
                    const val = chartData.maxVal * mult;
                    return (
                      <div key={i} className="flex items-center gap-4 w-full">
                        <span className="text-[10px] sm:text-xs font-bold text-[#0F0E0D]/30 dark:text-white/30 w-8 text-right transition-colors">
                          {val >= 1000 ? `${(val/1000).toFixed(1)}k` : Math.round(val)}
                        </span>
                        <div className="flex-1 border-t border-dashed border-[#EBE6E0] dark:border-white/10 transition-colors"></div>
                      </div>
                    )
                  })}
                </div>

                {/* SVG Line Chart */}
                <div className="absolute inset-0 ml-14 mb-8 mt-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1" className="text-[#0F0E0D] dark:text-white transition-colors">
                        <stop offset="5%" stopColor="currentColor" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    
                    {chartData.points.length > 0 && (
                      <>
                        <path d={chartData.areaPath} fill="url(#colorSales)" />
                        <path 
                          d={chartData.linePath} 
                          fill="none" 
                          className="stroke-[#0F0E0D] dark:stroke-white transition-colors drop-shadow-lg"
                          strokeWidth="4" 
                          strokeLinecap="round" 
                        />
                        
                        {/* Interactive Data Points */}
                        {chartData.points.map((point, i) => (
                          <circle 
                            key={i} 
                            cx={point.x} 
                            cy={point.y} 
                            r="6" 
                            className="fill-white dark:fill-[#111111] stroke-[#0F0E0D] dark:stroke-white transition-all duration-300 cursor-pointer hover:scale-125 origin-center" 
                            strokeWidth="3" 
                          >
                            <title>{point.label}: ${point.val.toFixed(2)}</title>
                          </circle>
                        ))}
                      </>
                    )}
                  </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="mt-auto ml-14 flex justify-between pr-2 relative z-10">
                  {chartData.labels.map((day, i) => (
                    <span key={i} className="text-[10px] sm:text-xs font-bold text-[#0F0E0D]/40 dark:text-white/40 transition-colors">{day}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* QUICK TRANSFER / WALLET (Right Column) */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 flex flex-col justify-between transition-colors">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white mb-6 transition-colors">Lustre Wallet</h2>
              
              <div className="bg-[#0F0E0D] dark:bg-[#1A1A1A] border dark:border-white/10 rounded-2xl p-6 sm:p-8 text-[#E9E3DB] relative overflow-hidden shadow-lg mb-6 sm:mb-8 transition-colors">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#C4BEB6]/20 dark:bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-[#E9E3DB]/60 dark:text-white/60 text-xs sm:text-sm font-bold tracking-wider mb-2 uppercase transition-colors">Available Balance</p>
                <p className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 sm:mb-8 text-white">
                  ${metrics.netSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] sm:text-xs text-[#E9E3DB]/50 dark:text-white/50 mb-1 transition-colors">Next Payout</p>
                    <p className="font-bold text-xs sm:text-sm text-white">Auto-transferred</p>
                  </div>
                  <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white/20 rounded-md flex items-center justify-center text-white">
                    <CreditCard size={18} className="sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3.5 sm:py-4 bg-[#EBE6E0]/50 dark:bg-white/10 text-[#0F0E0D] dark:text-white font-bold rounded-2xl text-xs sm:text-sm hover:bg-[#EBE6E0] dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                Withdraw Funds <ArrowUpRight size={16} />
              </button>
              <button className="w-full py-3.5 sm:py-4 bg-transparent border-2 border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D] dark:text-white font-bold rounded-2xl text-xs sm:text-sm hover:border-[#0F0E0D]/40 dark:hover:border-white/30 transition-colors">
                Manage Accounts
              </button>
            </div>
          </motion.div>
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 overflow-hidden transition-colors">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white transition-colors">All Transactions</h2>
          </div>
          
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#EBE6E0]/30 dark:bg-white/5 text-[#0F0E0D]/50 dark:text-white/50 text-[9px] uppercase tracking-[0.25em] border-b border-[#EBE6E0] dark:border-white/10 transition-colors">
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Transaction ID</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Customer</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Items</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Date</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-right">Amount</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentOrders.length > 0 ? currentOrders.map((trx, index) => {
                  const statusInfo = getStatusDisplay(trx.status);
                  
                  let itemsCount = 0;
                  if (typeof trx.items === 'string') {
                    try { itemsCount = JSON.parse(trx.items).length; } catch(e) {}
                  } else if (Array.isArray(trx.items)) {
                    itemsCount = trx.items.length;
                  }

                  const formattedDate = new Date(trx.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

                  return (
                    <tr key={index} className="border-b border-[#EBE6E0] dark:border-white/10 hover:bg-[#EBE6E0]/30 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-[#0F0E0D]/80 dark:text-white/80 transition-colors">{trx.custom_id || trx.order_number}</td>
                      <td className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-[#0F0E0D] dark:text-white transition-colors">{trx.customer_name}</td>
                      <td className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-[#0F0E0D]/60 dark:text-white/60 transition-colors">{itemsCount} item(s)</td>
                      <td className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-[#0F0E0D]/60 dark:text-white/60 transition-colors">{formattedDate}</td>
                      <td className="px-4 sm:px-6 py-4 sm:py-5">
                        <span className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold rounded-full flex items-center gap-1.5 w-fit ${statusInfo.style} transition-colors`}>
                          {statusInfo.icon} {trx.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 sm:py-5 font-bold text-[#0F0E0D] dark:text-white text-right transition-colors">${Number(trx.total_amount || 0).toFixed(2)}</td>
                      <td className="px-4 sm:px-6 py-4 sm:py-5 text-center">
                        <button className="p-2 text-[#0F0E0D]/40 dark:text-white/40 hover:text-[#0F0E0D] dark:hover:text-white transition-colors rounded-lg hover:bg-[#EBE6E0] dark:hover:bg-white/10 inline-flex">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#0F0E0D]/40 dark:text-white/40 font-bold uppercase tracking-widest text-xs">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {orders.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#EBE6E0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 transition-colors">
              <p className="text-center sm:text-left">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} transactions
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.2rem] hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors text-[#0F0E0D] dark:text-white text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
  const pillBg = isPositive 
    ? (isDark ? "bg-[#E6F4EA] dark:bg-green-100" : "bg-[#E6F4EA] dark:bg-green-500/20") 
    : (isDark ? "bg-[#FCE8E6] dark:bg-red-100" : "bg-[#FCE8E6] dark:bg-red-500/20");
    
  const pillText = isPositive 
    ? (isDark ? "text-[#1E7E34] dark:text-green-700" : "text-[#1E7E34] dark:text-green-400") 
    : (isDark ? "text-[#C5221F] dark:text-red-700" : "text-[#C5221F] dark:text-red-400");

  return (
    <motion.div 
      variants={variants} 
      className={`${cardBg} ${borderColor} border p-6 sm:p-7 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[160px] sm:min-h-[190px] group hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden`}
    >
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className={`${textColor} stroke-2 transition-colors`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full ${pillBg} ${pillText} transition-colors`}>
          {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />} {trend}
        </div>
      </div>
      
      <div className="relative z-10 mt-5 sm:mt-6">
        <h3 className={`${titleColor} font-bold text-[10px] uppercase tracking-[0.15em] mb-1.5 transition-colors`}>{title}</h3>
        <p className={`${textColor} text-[1.75rem] sm:text-[2rem] font-extrabold tracking-tight leading-none transition-colors`}>{value}</p>
      </div>
      
      {/* Decorative Wavy Lines */}
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