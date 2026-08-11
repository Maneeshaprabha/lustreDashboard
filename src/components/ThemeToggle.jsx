import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: 'light', icon: <Sun size={14} /> },
    { id: 'system', icon: <Monitor size={14} /> },
    { id: 'dark', icon: <Moon size={14} /> },
  ];

  return (
    <div className="flex items-center bg-[#EBE6E0]/50 dark:bg-black/40 p-1 rounded-full border border-[#EBE6E0] dark:border-white/5 transition-colors">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setTheme(option.id)}
          className={`relative w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium z-10 transition-colors cursor-pointer ${
            theme === option.id 
              ? 'text-[#0F0E0D] dark:text-white' 
              : 'text-[#0F0E0D]/50 dark:text-white/40 hover:text-[#0F0E0D] dark:hover:text-white/80'
          }`}
          title={`Switch to ${option.id} mode`}
        >
          {theme === option.id && (
            <motion.div
              layoutId="theme-bubble"
              className="absolute inset-0 bg-white dark:bg-[#2A2A2A] rounded-full shadow-sm pointer-events-none"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-20">{option.icon}</span>
        </button>
      ))}
    </div>
  );
}