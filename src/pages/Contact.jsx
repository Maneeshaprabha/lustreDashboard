import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import Footer from './Footer';


export default function Contact() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#E9E3DB] text-[#1A1A1A] font-sans antialiased py-20 px-6 md:px-12 flex items-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col justify-center">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Let's Start a <br />
              <span className="font-extrabold text-[#3d352e]">Conversation.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-[#1A1A1A]/70 text-lg mb-12 max-w-md leading-relaxed">
              Have a question about our latest collection or need help with an order? The Netxium support team is here to help you shine.
            </motion.p>
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#C4BEB6]/40 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#E9E3DB] transition-colors duration-300"><Mail size={20} /></div>
                <div><p className="text-sm font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">Email</p><p className="font-bold text-lg">hello@lustre.com</p></div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-[#C4BEB6]/40 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-[#E9E3DB] transition-colors duration-300"><MapPin size={20} /></div>
                <div><p className="text-sm font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-1">Studio</p><p className="font-bold text-lg">124 Fashion Ave, NY 10001</p></div>
              </div>
            </motion.div>
          </div>
          <motion.div variants={fadeInUp} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-[#1A1A1A]/5 border border-[#C4BEB6]/20">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-bold text-[#1A1A1A]/80">First Name</label><input type="text" className="w-full bg-[#C4BEB6]/10 px-5 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 outline-none transition-all font-medium" placeholder="Jane" /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-[#1A1A1A]/80">Last Name</label><input type="text" className="w-full bg-[#C4BEB6]/10 px-5 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 outline-none transition-all font-medium" placeholder="Doe" /></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-[#1A1A1A]/80">Email Address</label><input type="email" className="w-full bg-[#C4BEB6]/10 px-5 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 outline-none transition-all font-medium" placeholder="jane@example.com" /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-[#1A1A1A]/80">Message</label><textarea rows={4} className="w-full bg-[#C4BEB6]/10 px-5 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 outline-none transition-all font-medium resize-none" placeholder="How can we help you today?" /></div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-[#1A1A1A] text-[#E9E3DB] font-bold rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-[#1A1A1A]/80 transition-colors shadow-lg mt-4">
                Send Message <Send size={20} strokeWidth={2.5} />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}