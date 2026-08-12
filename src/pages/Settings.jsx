import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // <--- NEW IMPORT
import { 
  Store, User, Bell, Lock, Save, Upload, Check, Globe, Mail, Phone, Palette, Image as ImageIcon
} from 'lucide-react';

export default function Settings() {
  const location = useLocation();

  // Read from the router state, otherwise default to branding
  const [activeTab, setActiveTab] = useState(location.state?.targetTab || 'branding'); 

  // If the user is ALREADY on the settings page and clicks the dropdown again, force an update
  useEffect(() => {
    if (location.state?.targetTab) {
      setActiveTab(location.state.targetTab);
    }
  }, [location.state]);

  // Toggle states for Notifications tab
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifStock, setNotifStock] = useState(false);
  const [notifReport, setNotifReport] = useState(true);

  // State for Theme Colors
  const [primaryColor, setPrimaryColor] = useState('#1A1A1A');
  const [accentColor, setAccentColor] = useState('#C4BEB6');
  const [bgColor, setBgColor] = useState('#E9E3DB');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const tabs = [
    { id: 'branding', label: 'Branding & Theme', icon: <Palette size={18} /> },
    { id: 'store', label: 'Store Details', icon: <Store size={18} /> },
    { id: 'account', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 md:p-10 max-w-[1200px] w-full mx-auto space-y-8 pb-24 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      
      {/* Top Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Settings</h1>
          <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-2 transition-colors">Manage your store preferences and account</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors"
        >
          <Save size={16} strokeWidth={2.5} /> Save Changes
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Settings Navigation */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 text-sm font-bold tracking-wide ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-[#111111] shadow-sm border border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D] dark:text-white' 
                  : 'text-[#0F0E0D]/50 dark:text-white/50 hover:bg-[#EBE6E0]/40 dark:hover:bg-white/5 hover:text-[#0F0E0D] dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* RIGHT COLUMN: Settings Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <AnimatePresence mode="wait">

            {/* BRANDING & THEME TAB */}
            {activeTab === 'branding' && (
              <motion.div 
                key="branding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Branding & Theme</h2>
                  <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Customize the global look and feel of your storefront and dashboard.</p>
                </div>

                <div className="space-y-8">
                  {/* System Logo Upload */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/80 dark:text-white/80 mb-4 flex items-center gap-2 transition-colors">
                      <ImageIcon size={16}/> System Logo
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="w-32 h-32 bg-[#FBF9F6] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#EBE6E0] dark:border-white/20 flex flex-col items-center justify-center text-[#0F0E0D]/40 dark:text-white/40 relative group cursor-pointer hover:border-[#0F0E0D]/40 dark:hover:border-white/40 transition-colors">
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs font-bold">Upload Logo</span>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-[#0F0E0D] dark:text-white mb-1 transition-colors">Upload your brand logo</p>
                        <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 font-medium leading-relaxed max-w-sm mb-4 transition-colors">
                          This logo will appear on your customer storefront, invoice headers, and the top-left of this dashboard. Recommended format: SVG or transparent PNG.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/80 dark:text-white/80 mb-4 flex items-center gap-2 transition-colors">
                      <Palette size={16}/> Global Brand Colors
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Primary Color Picker */}
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Primary Color</label>
                        <div className="flex items-center gap-3">
                          <label className="relative w-12 h-12 rounded-xl shadow-sm border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform hover:scale-105" style={{ backgroundColor: primaryColor }}>
                            <input 
                              type="color" 
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                          </label>
                          <input 
                            type="text" 
                            value={primaryColor.toUpperCase()} 
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 py-3 rounded-xl border border-transparent outline-none text-sm font-bold text-[#0F0E0D] dark:text-white uppercase transition-colors"
                          />
                        </div>
                        <p className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-bold mt-2 transition-colors">Used for main buttons and active states.</p>
                      </div>

                      {/* Accent Color Picker */}
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Accent Color</label>
                        <div className="flex items-center gap-3">
                          <label className="relative w-12 h-12 rounded-xl shadow-sm border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform hover:scale-105" style={{ backgroundColor: accentColor }}>
                            <input 
                              type="color" 
                              value={accentColor}
                              onChange={(e) => setAccentColor(e.target.value)}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                          </label>
                          <input 
                            type="text" 
                            value={accentColor.toUpperCase()} 
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 py-3 rounded-xl border border-transparent outline-none text-sm font-bold text-[#0F0E0D] dark:text-white uppercase transition-colors"
                          />
                        </div>
                        <p className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-bold mt-2 transition-colors">Used for borders and secondary elements.</p>
                      </div>

                      {/* Background Color Picker */}
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Background</label>
                        <div className="flex items-center gap-3">
                          <label className="relative w-12 h-12 rounded-xl shadow-sm border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform hover:scale-105" style={{ backgroundColor: bgColor }}>
                            <input 
                              type="color" 
                              value={bgColor}
                              onChange={(e) => setBgColor(e.target.value)}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                          </label>
                          <input 
                            type="text" 
                            value={bgColor.toUpperCase()} 
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 py-3 rounded-xl border border-transparent outline-none text-sm font-bold text-[#0F0E0D] dark:text-white uppercase transition-colors"
                          />
                        </div>
                        <p className="text-[10px] text-[#0F0E0D]/40 dark:text-white/40 font-bold mt-2 transition-colors">Used for app backgrounds and storefronts.</p>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* STORE DETAILS TAB */}
            {activeTab === 'store' && (
              <motion.div 
                key="store"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Store Information</h2>
                  <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Update your brand name and contact details.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Store Name</label>
                    <input type="text" defaultValue="LUSTRE Fashion" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors"><Mail size={16}/> Support Email</label>
                      <input type="email" defaultValue="hello@lustre.com" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors"><Phone size={16}/> Support Phone</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/80 dark:text-white/80 mb-4 flex items-center gap-2 transition-colors"><Globe size={16}/> Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Currency</label>
                        <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                          <option value="USD" className="dark:bg-[#111111]">USD ($) - US Dollar</option>
                          <option value="EUR" className="dark:bg-[#111111]">EUR (€) - Euro</option>
                          <option value="GBP" className="dark:bg-[#111111]">GBP (£) - British Pound</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Timezone</label>
                        <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                          <option value="EST" className="dark:bg-[#111111]">Eastern Time (EST)</option>
                          <option value="CST" className="dark:bg-[#111111]">Central Time (CST)</option>
                          <option value="PST" className="dark:bg-[#111111]">Pacific Time (PST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ACCOUNT PROFILE TAB */}
            {activeTab === 'account' && (
              <motion.div 
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Personal Profile</h2>
                  <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Manage your personal information and avatar.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#EBE6E0] dark:border-white/20 shadow-sm relative group cursor-pointer transition-colors">
                    <img src="https://i.pravatar.cc/100?img=32" alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <button className="px-6 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm mb-2">
                      Change Avatar
                    </button>
                    <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">First Name</label>
                    <input type="text" defaultValue="Kamisato" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Last Name</label>
                    <input type="text" defaultValue="Aya" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Email Address</label>
                    <input type="email" defaultValue="aya@lustre.com" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Alerts & Notifications</h2>
                  <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Choose what updates you want to receive.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">New Order Alerts</h4>
                      <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 mt-1 font-medium transition-colors">Receive an email whenever a customer places a new order.</p>
                    </div>
                    <button 
                      onClick={() => setNotifOrder(!notifOrder)}
                      className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${notifOrder ? 'bg-[#0F0E0D] dark:bg-white' : 'bg-[#EBE6E0] dark:bg-white/20'}`}
                    >
                      <motion.div 
                        layout 
                        className="w-5 h-5 bg-white dark:bg-[#111111] rounded-full shadow-sm"
                        animate={{ x: notifOrder ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">Low Stock Warnings</h4>
                      <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 mt-1 font-medium transition-colors">Get notified when product inventory drops below 10 items.</p>
                    </div>
                    <button 
                      onClick={() => setNotifStock(!notifStock)}
                      className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${notifStock ? 'bg-[#0F0E0D] dark:bg-white' : 'bg-[#EBE6E0] dark:bg-white/20'}`}
                    >
                      <motion.div 
                        layout 
                        className="w-5 h-5 bg-white dark:bg-[#111111] rounded-full shadow-sm"
                        animate={{ x: notifStock ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">Daily Sales Reports</h4>
                      <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 mt-1 font-medium transition-colors">Receive a summarized PDF report of sales every evening.</p>
                    </div>
                    <button 
                      onClick={() => setNotifReport(!notifReport)}
                      className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${notifReport ? 'bg-[#0F0E0D] dark:bg-white' : 'bg-[#EBE6E0] dark:bg-white/20'}`}
                    >
                      <motion.div 
                        layout 
                        className="w-5 h-5 bg-white dark:bg-[#111111] rounded-full shadow-sm"
                        animate={{ x: notifReport ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Security Settings</h2>
                  <p className="text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Update your password and secure your account.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">New Password</label>
                    <input type="password" placeholder="Leave blank to keep current" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Confirm New Password</label>
                    <input type="password" placeholder="" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}