import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Upload } from 'lucide-react';

export default function AddProduct() {
  const [activeSize, setActiveSize] = useState('S');
  const [activeGender, setActiveGender] = useState('Woman');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1200px] w-full mx-auto space-y-6">
      
      {/* Action Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">Add New Product</h1>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 bg-white border-2 border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] hover:border-[#1A1A1A]/20 transition-colors shadow-sm">
            Save Draft
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 bg-[#1A1A1A] text-[#E9E3DB] rounded-full text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-[#1A1A1A]/80 transition-colors">
            <Check size={18} strokeWidth={3} /> Add Product
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Data Entry */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5">General Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Name Product</label>
                <input type="text" defaultValue="Puffer Jacket With Pocket Detail" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Description Product</label>
                <textarea rows={4} defaultValue="Cropped puffer jacket made of technical fabric. High neck and long sleeves. Flap pocket at the chest and in-seam side pockets at the hip. Inside pocket detail. Hem with elastic interior. Zip-up front." className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium resize-none leading-relaxed" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">Size</label>
                <div className="flex gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} onClick={() => setActiveSize(size)} className={`w-11 h-11 rounded-xl text-sm font-bold transition-all duration-300 ${activeSize === size ? 'bg-[#1A1A1A] text-[#E9E3DB] shadow-md scale-105' : 'bg-[#C4BEB6]/20 text-[#1A1A1A] hover:bg-[#C4BEB6]/40'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">Gender</label>
                <div className="flex gap-5 h-11 items-center">
                  {['Men', 'Woman', 'Unisex'].map(gender => (
                    <label key={gender} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#1A1A1A]/80">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${activeGender === gender ? 'border-[#1A1A1A]' : 'border-[#C4BEB6]'}`}>
                        {activeGender === gender && <div className="w-2.5 h-2.5 bg-[#1A1A1A] rounded-full" />}
                      </div>
                      <input type="radio" name="gender" checked={activeGender === gender} onChange={() => setActiveGender(gender)} className="hidden" />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5">Pricing And Stock</h2>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Base Pricing</label><input type="text" defaultValue="$47.55" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none text-sm font-medium" /></div>
              <div><label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Stock</label><input type="number" defaultValue="77" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none text-sm font-medium" /></div>
              <div><label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Discount</label><input type="text" defaultValue="10%" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none text-sm font-medium" /></div>
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Discount Type</label>
                <select className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-medium appearance-none cursor-pointer">
                  <option>Winter Sale Discount</option>
                  <option>Clearance</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Media & Categories */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5 flex justify-between items-center">Upload Img</h2>
            <div className="bg-[#C4BEB6]/10 rounded-[1.5rem] p-4 flex flex-col items-center justify-center border-2 border-dashed border-[#C4BEB6]/60 min-h-[280px] mb-5 relative overflow-hidden group cursor-pointer hover:border-[#1A1A1A]/40 transition-colors">
              <div className="absolute inset-0 bg-[#1A1A1A]/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="text-[#1A1A1A] w-8 h-8" /></div>
              <img src="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=500&auto=format&fit=crop" alt="Uploaded Puffer" className="absolute inset-0 w-full h-full object-cover rounded-[1.2rem] group-hover:blur-sm transition-all duration-300" />
            </div>
            <div className="flex gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="w-16 h-16 rounded-xl border-2 border-[#1A1A1A] overflow-hidden p-0.5 cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg" alt="thumbnail" />
                </div>
              ))}
              <div className="w-16 h-16 rounded-xl border border-[#C4BEB6]/40 overflow-hidden p-0.5 opacity-50"><div className="w-full h-full bg-[#C4BEB6]/20 rounded-lg"></div></div>
              <button className="w-16 h-16 bg-[#C4BEB6]/10 rounded-xl border-2 border-dashed border-[#C4BEB6]/60 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-[#C4BEB6]/30 transition-colors hover:text-[#1A1A1A]"><Plus size={24} /></button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5">Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Product Category</label>
                <select className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-medium appearance-none cursor-pointer">
                  <option>Jacket</option>
                  <option>Outerwear</option>
                  <option>Tops</option>
                </select>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 bg-[#1A1A1A]/5 text-[#1A1A1A] font-bold rounded-2xl text-sm hover:bg-[#1A1A1A]/10 transition-colors">
                Add Category
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}