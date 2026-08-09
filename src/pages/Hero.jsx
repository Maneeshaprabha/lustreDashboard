import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [activeCategory, setActiveCategory] = useState('WOMEN');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#1A1A1A] font-sans antialiased overflow-hidden flex items-center">
      <main className="max-w-[1400px] w-full mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-4 flex flex-col justify-center z-10">
          <motion.h1 variants={fadeInUp} className="text-[3.5rem] md:text-[4rem] font-bold leading-[1.1] mb-6 text-[#1A1A1A]">
            Shine in Style <br />
            Discover <br />
            <span className="font-normal">the</span> <span className="font-extrabold text-[#3d352e] tracking-wide">LUSTRE</span> <span className="font-normal">Look!</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-[#1A1A1A]/70 leading-relaxed mb-10 text-sm md:text-base font-medium max-w-[90%]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col items-start gap-12">
            <button className="group flex items-center gap-2 bg-[#1A1A1A] text-[#E9E3DB] px-8 py-3.5 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#1A1A1A]/80 shadow-lg">
              Shop Now! 
              <ChevronRight size={24} className="transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </button>
            <div className="w-6 h-10 border-2 border-[#1A1A1A]/40 rounded-full flex justify-center p-1 mt-4">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-2 bg-[#1A1A1A]/60 rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-4 flex justify-center relative h-[600px] lg:h-[800px] z-0 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" alt="Lustre Model" className="absolute bottom-0 w-auto h-[90%] object-cover object-top mask-image-bottom drop-shadow-2xl grayscale-[20%] contrast-[110%]" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)' }} />
        </div>

        <div className="lg:col-span-4 flex flex-col justify-center gap-8 z-10 pl-0 lg:pl-8">
          <div className="flex gap-3 justify-start lg:justify-end">
            {['WOMEN', 'MENS', 'KIDS'].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-1.5 text-xs tracking-wider font-bold rounded-full transition-all duration-300 ${activeCategory === cat ? 'bg-[#1A1A1A] text-[#E9E3DB]' : 'bg-[#C4BEB6]/40 text-[#1A1A1A] hover:bg-[#C4BEB6]/70'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="bg-[#C4BEB6]/30 p-4 rounded-[2rem] flex gap-5 relative group w-full max-w-[420px] ml-auto shadow-sm backdrop-blur-sm">
            <div className="w-[140px] h-[180px] bg-white rounded-[1.5rem] overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1000&auto=format&fit=crop" alt="Product Preview" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center pr-4">
              <h4 className="text-lg font-bold text-[#1A1A1A] leading-tight mb-1">Lorem ipsum</h4>
              <p className="text-sm text-[#1A1A1A]/70 font-medium mb-2">dolor sit amet,</p>
              <span className="text-base font-bold text-[#1A1A1A] mb-3">$20.00</span>
              <p className="text-[9px] text-[#1A1A1A]/50 font-medium leading-tight">Lorem ipsum dolor sit amet,consectetur, ipsum dolor sit amet,dolor sit amet.</p>
            </div>
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1A1A1A] text-[#E9E3DB] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-md">
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}