import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight} from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    // In a real app, you'd handle auth logic here.
    // For now, we just redirect to the dashboard.
    navigate('/overview');
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
          
          {/* Mobile Logo (Only visible on small screens) */}
          <div className="flex items-center gap-3 lg:hidden mb-10">
            <div className="w-10 h-10 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] flex items-center justify-center rounded-xl font-extrabold text-xl transition-colors">
              L
            </div>
            <span className="text-xl font-extrabold tracking-widest text-[#0F0E0D] dark:text-white transition-colors">LUSTRE</span>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-[#EBE6E0]/50 dark:bg-white/5 rounded-2xl mb-8 sm:mb-12 transition-colors">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${isLogin ? 'bg-white dark:bg-[#111111] text-[#0F0E0D] dark:text-white shadow-sm' : 'text-[#0F0E0D]/50 dark:text-white/50 hover:text-[#0F0E0D] dark:hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
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
                  className="w-full bg-white dark:bg-[#111111] pl-12 pr-5 py-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30 shadow-sm"
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="w-full py-4 mt-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] font-extrabold uppercase tracking-widest text-xs rounded-2xl hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)]"
            >
              {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16} strokeWidth={3} />
            </motion.button>
          </form>

          {/* Social Logins */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-6 sm:mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EBE6E0] dark:border-white/10 transition-colors"></div></div>
              <div className="relative bg-[#FBF9F6] dark:bg-[#0A0A0A] px-4 text-[10px] font-bold uppercase tracking-widest text-[#0F0E0D]/40 dark:text-white/40 transition-colors">
                Or continue with
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button className="flex items-center justify-center gap-2 py-3.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-2xl text-[10px] sm:text-xs font-bold text-[#0F0E0D] dark:text-white hover:bg-[#EBE6E0]/50 dark:hover:bg-white/5 transition-colors shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
             
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}