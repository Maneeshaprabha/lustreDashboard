import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react'; // <-- AlertCircle add kala
import { authService } from '../services/authService'; 
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const { setAuth } = useAuth();

  // Form State Variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Backend Integration
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanEmail = email.trim();

    try {
      let data;
      if (isLogin) {
        data = await authService.login(cleanEmail, password); 
      } else {
        data = await authService.register(cleanEmail, password, fullName); 
      }
      
      if (setAuth) setAuth(data);
      navigate('/overview');
      
    } catch (err) {
      // --- FIX: Backend eken ena exact error message eka catch kirima ---
      const backendError = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      setErrorMsg(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FBF9F6] dark:bg-[#0A0A0A] transition-colors duration-300 font-sans">
      
      {/* LEFT PANEL - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0F0E0D] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0D] via-transparent to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#0F0E0D] flex items-center justify-center rounded-xl font-extrabold text-xl">
              L
            </div>
            <span className="text-2xl font-extrabold tracking-widest text-white">LUSTRE</span>
          </div>

          <div>
            <motion.h2 
              key={isLogin ? 'login-text' : 'signup-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-lg"
            >
              {isLogin ? "Welcome back to your workspace." : "Start scaling your brand today."}
            </motion.h2>
            <p className="text-white/60 font-medium text-lg max-w-md">
              Manage your inventory, track your revenue, and elevate your storefront with our luxury commerce engine.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16 relative">
        <div className="w-full max-w-md">
          
          <div className="flex items-center gap-3 lg:hidden mb-10">
            <div className="w-10 h-10 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] flex items-center justify-center rounded-xl font-extrabold text-xl transition-colors">
              L
            </div>
            <span className="text-xl font-extrabold tracking-widest text-[#0F0E0D] dark:text-white transition-colors">LUSTRE</span>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-[#EBE6E0]/50 dark:bg-white/5 rounded-2xl mb-8 sm:mb-12 transition-colors">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${isLogin ? 'bg-white dark:bg-[#111111] text-[#0F0E0D] dark:text-white shadow-sm' : 'text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${!isLogin ? 'bg-white dark:bg-[#111111] text-[#0F0E0D] dark:text-white shadow-sm' : 'text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight mb-2 transition-colors">
              {isLogin ? "Sign in to Lustre" : "Create your account"}
            </h1>
            <p className="text-sm text-[#0F0E0D]/60 dark:text-white/60 font-medium transition-colors">
              {isLogin ? "Enter your details to access your dashboard." : "Set up your credentials to get started."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3, type: "spring", bounce: 0 }}
                >
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={18} strokeWidth={2.5} />
                    <input 
                      type="text" 
                      placeholder="Kamisato Aya" 
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white dark:bg-[#111111] pl-12 pr-5 py-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2 transition-colors">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={18} strokeWidth={2.5} />
                <input 
                  type="email" 
                  placeholder="hello@lustre.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-[#111111] pl-12 pr-5 py-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30 shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 transition-colors">Password</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:opacity-70 transition-opacity">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40 transition-colors" size={18} strokeWidth={2.5} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-[#111111] pl-12 pr-5 py-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30 shadow-sm"
                />
              </div>
            </div>

            {/* --- FIX: Improved Error Message UI --- */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }} 
                  animate={{ opacity: 1, y: 0, height: 'auto' }} 
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-3 p-4 mt-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                >
                  <AlertCircle className="text-red-500 dark:text-red-400 shrink-0" size={18} strokeWidth={2.5} />
                  <span className="text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold">{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="w-full py-4 mt-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] font-extrabold uppercase tracking-widest text-xs rounded-2xl hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"} 
                  <ArrowRight size={16} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </form>
          
        </div>
      </div>
    </div>
  );
}