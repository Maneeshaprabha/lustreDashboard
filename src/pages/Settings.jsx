import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Store, User, Bell, Lock, Save, Upload, Check, Globe, Mail, Phone, Palette, Image as ImageIcon, CheckCircle2, AlertCircle,
  Loader2
} from 'lucide-react';

export default function Settings() {
  const location = useLocation();

  // Read target tab from router state or default to 'branding'
  const [activeTab, setActiveTab] = useState(location.state?.targetTab || 'branding'); 
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Custom Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  // --- ALUTH: Dynamic User State ---
  const [userData, setUserData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@lustre.com",
    avatar: ""
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  useEffect(() => {
    if (location.state?.targetTab) {
      setActiveTab(location.state.targetTab);
    }

    // Load Real User Data from localStorage
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        let fName = "Admin";
        let lName = "User";

        // Handle full names or separate names
        if (storedUser.name || storedUser.full_name) {
          const parts = (storedUser.name || storedUser.full_name).split(' ');
          fName = parts[0] || '';
          lName = parts.slice(1).join(' ') || '';
        } else if (storedUser.firstName) {
          fName = storedUser.firstName;
          lName = storedUser.lastName || '';
        }

        const email = storedUser.email || "admin@lustre.com";
        const avatar = storedUser.avatar || storedUser.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(fName + ' ' + lName)}&background=0F0E0D&color=fff&size=200`;

        setUserData({ firstName: fName, lastName: lName, email, avatar });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    } else {
      // Default fallback avatar
      setUserData(prev => ({ ...prev, avatar: `https://ui-avatars.com/api/?name=Admin+User&background=0F0E0D&color=fff&size=200` }));
    }
  }, [location.state]);

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3500);
  };

  // Toggle states for Notifications tab
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifStock, setNotifStock] = useState(false);
  const [notifReport, setNotifReport] = useState(true);

  // State for Theme Colors
  const [primaryColor, setPrimaryColor] = useState('#1A1A1A');
  const [accentColor, setAccentColor] = useState('#C4BEB6');
  const [bgColor, setBgColor] = useState('#E9E3DB');

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Basic Validations
    if (activeTab === 'account' && (!userData.firstName || !userData.email)) {
      return showNotification("First name and Email are required.", "error");
    }

    if (activeTab === 'security') {
      if (passwords.newPass && passwords.newPass !== passwords.confirm) {
        return showNotification("New passwords do not match.", "error");
      }
      if (passwords.newPass && !passwords.current) {
        return showNotification("Please enter current password to verify.", "error");
      }
    }

    setIsSaving(true);

    // Simulate API Save
    setTimeout(() => {
      // If on account tab, update LocalStorage so Navbar updates on next load/reload
      if (activeTab === 'account') {
        const storedUserStr = localStorage.getItem('user');
        let updatedUser = { 
          name: `${userData.firstName} ${userData.lastName}`.trim(),
          email: userData.email,
          role: 'Manager' // Defaulting for visual
        };
        
        if (storedUserStr) {
          try {
            updatedUser = { ...JSON.parse(storedUserStr), ...updatedUser };
          } catch(e) {}
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update avatar instantly for preview
        setUserData(prev => ({ 
          ...prev, 
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedUser.name)}&background=0F0E0D&color=fff&size=200` 
        }));
      }

      if (activeTab === 'security' && passwords.newPass) {
        setPasswords({ current: '', newPass: '', confirm: '' }); // Clear passwords after save
      }

      setIsSaving(false);
      setIsSaved(true);
      showNotification("Settings saved successfully!", "success");
      setTimeout(() => setIsSaved(false), 2500);
    }, 1000);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  const tabs = [
    { id: 'branding', label: 'Branding & Theme', icon: <Palette size={18} /> },
    { id: 'store', label: 'Store Details', icon: <Store size={18} /> },
    { id: 'account', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
  ];

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="p-4 sm:p-6 md:p-10 max-w-[1200px] w-full mx-auto space-y-6 sm:space-y-8 pb-32 sm:pb-24 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300 font-sans relative"
    >
      
      {/* CUSTOM NOTIFICATION TOAST */}
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

      {/* Top Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">
            Settings
          </h1>
          <p className="text-[10px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.25em] mt-1 transition-colors">
            Manage your store preferences and account
          </p>
        </div>
        
        {/* Save Button (Desktop / Tablet) */}
        <motion.button 
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="hidden sm:flex px-6 py-3.5 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-full text-xs font-extrabold uppercase tracking-widest items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-all disabled:opacity-70"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isSaved ? <CheckCircle2 size={16} className="text-green-400 dark:text-green-600" /> : <Save size={16} strokeWidth={2.5} />)}
          <span>{isSaving ? "Saving..." : (isSaved ? "Saved!" : "Save Changes")}</span>
        </motion.button>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        
        {/* NAVIGATION TABS */}
        <motion.div variants={itemVariants} className="lg:col-span-1 w-full">
          {/* Mobile Horizontal Segmented Control */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] shadow-md' 
                      : 'bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D]/60 dark:text-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-white dark:text-[#0F0E0D]' : 'text-[#0F0E0D]/60 dark:text-white/60'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Vertical Tab Menu */}
          <div className="hidden lg:flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-[1.5rem] transition-all duration-300 text-sm font-bold tracking-wide ${
                    isActive 
                      ? 'bg-white dark:bg-[#111111] shadow-sm border border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D] dark:text-white' 
                      : 'text-[#0F0E0D]/50 dark:text-white/50 hover:bg-[#EBE6E0]/40 dark:hover:bg-white/5 hover:text-[#0F0E0D] dark:hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#0F0E0D] dark:text-white' : 'text-[#0F0E0D]/40 dark:text-white/40'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CONTENT AREA */}
        <motion.div variants={itemVariants} className="lg:col-span-3 w-full">
          <AnimatePresence mode="wait">

            {/* BRANDING & THEME TAB */}
            {activeTab === 'branding' && (
              <motion.div 
                key="branding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-6 sm:space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">
                    Branding & Theme
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">
                    Customize the global look and feel of your storefront and dashboard.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {/* System Logo Upload */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/80 dark:text-white/80 mb-4 flex items-center gap-2 transition-colors">
                      <ImageIcon size={16}/> System Logo
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left bg-[#FBF9F6] dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-[#EBE6E0] dark:border-white/10">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-white dark:bg-[#111111] rounded-2xl border-2 border-dashed border-[#EBE6E0] dark:border-white/20 flex flex-col items-center justify-center text-[#0F0E0D]/40 dark:text-white/40 relative group cursor-pointer hover:border-[#0F0E0D]/40 dark:hover:border-white/40 transition-colors">
                        <Upload size={22} className="mb-1.5" />
                        <span className="text-[11px] font-bold">Upload Logo</span>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-[#0F0E0D] dark:text-white mb-1 transition-colors">
                          Upload Brand Assets
                        </p>
                        <p className="text-xs text-[#0F0E0D]/50 dark:text-white/50 font-medium leading-relaxed mb-4 transition-colors">
                          Appears on customer receipts, invoices, and your header navbar. Recommended: Transparent SVG or high-res PNG.
                        </p>
                        <button className="px-4 py-2 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm">
                          Browse File
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Brand Color Tokens */}
                  <div className="pt-6 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/80 dark:text-white/80 mb-4 flex items-center gap-2 transition-colors">
                      <Palette size={16}/> Global Palette Tokens
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      
                      {/* Primary Color Picker */}
                      <div className="bg-[#FBF9F6] dark:bg-white/5 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10">
                        <label className="block text-[10px] font-extrabold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Primary Color</label>
                        <div className="flex items-center gap-3">
                          <label className="relative w-11 h-11 rounded-xl shadow-sm border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0" style={{ backgroundColor: primaryColor }}>
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
                            className="w-full bg-white dark:bg-[#111111] px-3 py-2.5 rounded-xl border border-[#EBE6E0] dark:border-white/10 outline-none text-xs font-bold text-[#0F0E0D] dark:text-white uppercase transition-colors"
                          />
                        </div>
                      </div>

                      {/* Accent Color Picker */}
                      <div className="bg-[#FBF9F6] dark:bg-white/5 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10">
                        <label className="block text-[10px] font-extrabold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Accent Color</label>
                        <div className="flex items-center gap-3">
                          <label className="relative w-11 h-11 rounded-xl shadow-sm border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0" style={{ backgroundColor: accentColor }}>
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
                            className="w-full bg-white dark:bg-[#111111] px-3 py-2.5 rounded-xl border border-[#EBE6E0] dark:border-white/10 outline-none text-xs font-bold text-[#0F0E0D] dark:text-white uppercase transition-colors"
                          />
                        </div>
                      </div>

                      {/* Background Color Picker */}
                      <div className="bg-[#FBF9F6] dark:bg-white/5 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 sm:col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-extrabold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Background</label>
                        <div className="flex items-center gap-3">
                          <label className="relative w-11 h-11 rounded-xl shadow-sm border border-black/10 dark:border-white/20 flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0" style={{ backgroundColor: bgColor }}>
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
                            className="w-full bg-white dark:bg-[#111111] px-3 py-2.5 rounded-xl border border-[#EBE6E0] dark:border-white/10 outline-none text-xs font-bold text-[#0F0E0D] dark:text-white uppercase transition-colors"
                          />
                        </div>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-6 sm:space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Store Information</h2>
                  <p className="text-xs sm:text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Update your brand name and contact details.</p>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Store Name</label>
                    <input type="text" defaultValue="LUSTRE Fashion" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors"><Mail size={15}/> Support Email</label>
                      <input type="email" defaultValue="hello@lustre.com" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors"><Phone size={15}/> Support Phone</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/80 dark:text-white/80 mb-4 flex items-center gap-2 transition-colors"><Globe size={16}/> Regional Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Currency</label>
                        <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                          <option value="USD" className="dark:bg-[#111111]">USD ($) - US Dollar</option>
                          <option value="EUR" className="dark:bg-[#111111]">EUR (€) - Euro</option>
                          <option value="GBP" className="dark:bg-[#111111]">GBP (£) - British Pound</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F0E0D]/60 dark:text-white/60 mb-2 uppercase tracking-wider transition-colors">Timezone</label>
                        <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
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

            {/* ACCOUNT PROFILE TAB (FULLY INTEGRATED) */}
            {activeTab === 'account' && (
              <motion.div 
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-6 sm:space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Personal Profile</h2>
                  <p className="text-xs sm:text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Manage your personal information and avatar.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 bg-[#FBF9F6] dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-[#EBE6E0] dark:border-white/10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden border-4 border-white dark:border-[#111111] shadow-md relative group cursor-pointer transition-colors">
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white" size={20} />
                    </div>
                  </div>
                  <div>
                    <button className="px-5 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm mb-2">
                      Change Avatar
                    </button>
                    <p className="text-[11px] text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Avatar auto-generated if none provided.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">First Name</label>
                    <input type="text" name="firstName" value={userData.firstName} onChange={handleUserChange} className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Last Name</label>
                    <input type="text" name="lastName" value={userData.lastName} onChange={handleUserChange} className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Email Address</label>
                    <input type="email" name="email" value={userData.email} onChange={handleUserChange} className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-6 sm:space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Alerts & Notifications</h2>
                  <p className="text-xs sm:text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Choose what updates you want to receive.</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 gap-4">
                    <div className="flex-1 pr-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">New Order Alerts</h4>
                      <p className="text-[11px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 mt-0.5 font-medium transition-colors">Receive instant email notifications for incoming purchases.</p>
                    </div>
                    <button 
                      onClick={() => setNotifOrder(!notifOrder)}
                      className={`shrink-0 w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${notifOrder ? 'bg-[#0F0E0D] dark:bg-white' : 'bg-[#EBE6E0] dark:bg-white/20'}`}
                    >
                      <motion.div 
                        layout 
                        className="w-5 h-5 bg-white dark:bg-[#111111] rounded-full shadow-sm"
                        animate={{ x: notifOrder ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 gap-4">
                    <div className="flex-1 pr-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">Low Stock Warnings</h4>
                      <p className="text-[11px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 mt-0.5 font-medium transition-colors">Get notified when product stock drops under 10 units.</p>
                    </div>
                    <button 
                      onClick={() => setNotifStock(!notifStock)}
                      className={`shrink-0 w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${notifStock ? 'bg-[#0F0E0D] dark:bg-white' : 'bg-[#EBE6E0] dark:bg-white/20'}`}
                    >
                      <motion.div 
                        layout 
                        className="w-5 h-5 bg-white dark:bg-[#111111] rounded-full shadow-sm"
                        animate={{ x: notifStock ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 gap-4">
                    <div className="flex-1 pr-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">Daily Sales Summaries</h4>
                      <p className="text-[11px] sm:text-xs text-[#0F0E0D]/50 dark:text-white/50 mt-0.5 font-medium transition-colors">Receive a summarized performance PDF every evening.</p>
                    </div>
                    <button 
                      onClick={() => setNotifReport(!notifReport)}
                      className={`shrink-0 w-12 h-7 rounded-full transition-colors relative flex items-center px-1 ${notifReport ? 'bg-[#0F0E0D] dark:bg-white' : 'bg-[#EBE6E0] dark:bg-white/20'}`}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#111111] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 space-y-6 sm:space-y-8 transition-colors"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-1 transition-colors">Security Settings</h2>
                  <p className="text-xs sm:text-sm text-[#0F0E0D]/50 dark:text-white/50 font-medium transition-colors">Update your password and secure your account.</p>
                </div>
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Current Password</label>
                    <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">New Password</label>
                    <input type="password" name="newPass" value={passwords.newPass} onChange={handlePasswordChange} placeholder="Leave blank to keep current" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Confirm New Password</label>
                    <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} placeholder="" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FLOATING MOBILE SAVE BAR */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-t border-[#EBE6E0] dark:border-white/10 z-40">
        <motion.button 
          onClick={handleSave}
          disabled={isSaving}
          whileTap={{ scale: 0.97 }} 
          className="w-full py-3.5 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isSaved ? <CheckCircle2 size={16} className="text-green-400 dark:text-green-600" /> : <Save size={16} strokeWidth={2.5} />)}
          <span>{isSaving ? "Saving..." : (isSaved ? "Saved!" : "Save Changes")}</span>
        </motion.button>
      </div>

    </motion.div>
  );
}