import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, Upload, X, ArrowLeft } from 'lucide-react';

// A refined default palette of colors you can assign to your products
const defaultColorPalette = [
  '#1A1A1A', '#ffffff', '#E9E3DB', '#C4BEB6', '#3d352e', '#A7F3D0', '#FCA5A5', '#93C5FD',
];

// All available sizes
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [activeGender, setActiveGender] = useState('Woman');
  
  // State for dynamic color palette and selected colors
  const [availableColors, setAvailableColors] = useState(defaultColorPalette);
  const [selectedColors, setSelectedColors] = useState([defaultColorPalette[0], defaultColorPalette[2]]);

  // State to track inventory for each specific size
  const [sizeStock, setSizeStock] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0
  });

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleAddNewColor = (e) => {
    const newColor = e.target.value;
    if (!availableColors.includes(newColor)) {
      setAvailableColors([...availableColors, newColor]);
      setSelectedColors([...selectedColors, newColor]); 
    }
  };

  // Update specific size stock
  const handleSizeStockChange = (size, value) => {
    const qty = parseInt(value) || 0;
    setSizeStock(prev => ({ ...prev, [size]: qty }));
  };

  // Automatically calculate total stock by adding all size quantities together
  const totalStock = Object.values(sizeStock).reduce((sum, qty) => sum + qty, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1200px] w-full mx-auto space-y-6 pb-24 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      
      {/* Top Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Add New Product</h1>
            <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Expand your inventory</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
          <motion.button 
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="flex-1 md:flex-none justify-center px-6 py-3.5 sm:py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm flex items-center"
          >
            Cancel
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="flex-1 md:flex-none justify-center px-6 py-3.5 sm:py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors"
          >
            <Check size={16} strokeWidth={3} /> Save
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Data Entry */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">General Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Product Name</label>
                <input type="text" defaultValue="Puffer Jacket With Pocket Detail" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Product Description</label>
                <textarea rows={4} defaultValue="Cropped puffer jacket made of technical fabric. High neck and long sleeves. Flap pocket at the chest and in-seam side pockets at the hip. Inside pocket detail. Hem with elastic interior. Zip-up front." className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white resize-none leading-relaxed placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
              
              {/* SIZES INVENTORY GRID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">Inventory per Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {availableSizes.map(size => (
                    <div key={size} className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#0F0E0D]/50 dark:text-white/50 text-center uppercase tracking-widest transition-colors">{size}</label>
                      <input 
                        type="number" 
                        min="0"
                        value={sizeStock[size]}
                        onChange={(e) => handleSizeStockChange(size, e.target.value)}
                        className="w-full bg-[#FBF9F6] dark:bg-white/5 px-3 py-3 rounded-xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-center text-[#0F0E0D] dark:text-white transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">Gender</label>
                <div className="flex flex-wrap gap-4 sm:gap-6 min-h-[3rem] items-center">
                  {['Men', 'Woman', 'Unisex'].map(gender => (
                    <label key={gender} className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#0F0E0D]/80 dark:text-white/80 transition-colors">
                      <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${activeGender === gender ? 'border-[#0F0E0D] dark:border-white' : 'border-[#EBE6E0] dark:border-white/20'}`}>
                        {activeGender === gender && <div className="w-2.5 h-2.5 bg-[#0F0E0D] dark:bg-white rounded-full" />}
                      </div>
                      <input type="radio" name="gender" checked={activeGender === gender} onChange={() => setActiveGender(gender)} className="hidden" />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* DYNAMIC COLORS SECTION */}
            <div className="mt-8 pt-8 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">Available Colors</label>
              <div className="flex flex-wrap gap-4 items-center">
                {availableColors.map((color, index) => {
                  const isSelected = selectedColors.includes(color);
                  const isLightColor = color === '#ffffff' || color === '#E9E3DB' || color === '#C4BEB6' || color.toUpperCase() === '#FFF' || color.toUpperCase() === '#FFFFFF';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleColor(color)}
                      className={`relative w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center group shrink-0 ${isSelected ? 'scale-110 shadow-md' : 'hover:scale-105 shadow-sm border border-black/10 dark:border-white/10'}`}
                      style={{ 
                        backgroundColor: color, 
                        boxShadow: isSelected ? `0 0 0 2px ${isLightColor ? '#EBE6E0' : 'white'}, 0 0 0 4px #0F0E0D` : 'none' 
                      }}
                    >
                      {isSelected && (
                        <Check size={18} color={isLightColor ? '#0F0E0D' : 'white'} strokeWidth={3} />
                      )}
                    </button>
                  );
                })}

                <label className="relative w-10 h-10 shrink-0 rounded-full border-2 border-dashed border-[#EBE6E0] dark:border-white/20 flex items-center justify-center cursor-pointer hover:border-[#0F0E0D]/40 dark:hover:border-white/40 transition-colors group bg-[#FBF9F6] dark:bg-white/5" title="Add Custom Color">
                  <Plus size={18} className="text-[#0F0E0D]/50 dark:text-white/50 group-hover:text-[#0F0E0D] dark:group-hover:text-white transition-colors" />
                  <input 
                    type="color" 
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    onChange={handleAddNewColor}
                  />
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Pricing And Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Base Pricing</label>
                <input type="text" defaultValue="$47.55" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors" />
              </div>
              
              {/* AUTO-CALCULATING STOCK FIELD */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Total Stock</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={totalStock} 
                    readOnly 
                    className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed transition-colors" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 px-2.5 py-1 rounded-full shadow-sm pointer-events-none transition-colors">
                    Auto
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Discount</label>
                <input type="text" defaultValue="10%" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Discount Type</label>
                <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                  <option className="dark:bg-[#111111]">Winter Sale Discount</option>
                  <option className="dark:bg-[#111111]">Clearance</option>
                  <option className="dark:bg-[#111111]">None</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Media & Categories */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Upload Image</h2>
            <div className="bg-[#FBF9F6] dark:bg-white/5 rounded-[2rem] p-4 flex flex-col items-center justify-center border-2 border-dashed border-[#EBE6E0] dark:border-white/20 min-h-[200px] sm:min-h-[280px] mb-6 relative overflow-hidden group cursor-pointer hover:border-[#0F0E0D]/40 dark:hover:border-white/40 transition-colors">
              <div className="absolute inset-0 bg-[#0F0E0D]/10 dark:bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="text-[#0F0E0D] dark:text-white w-8 h-8" />
              </div>
              <img src="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=500&auto=format&fit=crop" alt="Uploaded Puffer" className="absolute inset-0 w-full h-full object-cover rounded-[1.7rem] group-hover:blur-sm transition-all duration-300" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="w-16 h-16 rounded-2xl border-2 border-[#0F0E0D] dark:border-white overflow-hidden p-0.5 cursor-pointer transition-colors">
                  <img src="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover rounded-xl" alt="thumbnail" />
                </div>
              ))}
              <div className="w-16 h-16 rounded-2xl border border-[#EBE6E0] dark:border-white/10 overflow-hidden p-0.5 opacity-50">
                <div className="w-full h-full bg-[#FBF9F6] dark:bg-white/5 rounded-xl"></div>
              </div>
              <button className="w-16 h-16 bg-[#FBF9F6] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#EBE6E0] dark:border-white/20 flex items-center justify-center text-[#0F0E0D]/60 dark:text-white/60 hover:bg-[#EBE6E0] dark:hover:bg-white/10 transition-colors hover:text-[#0F0E0D] dark:hover:text-white shrink-0">
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Category</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Product Category</label>
                <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                  <option className="dark:bg-[#111111]">Jacket</option>
                  <option className="dark:bg-[#111111]">Outerwear</option>
                  <option className="dark:bg-[#111111]">Tops</option>
                </select>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="w-full py-4 bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D] dark:text-white font-extrabold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#EBE6E0]/50 dark:hover:bg-white/10 transition-colors"
              >
                Add Category
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM SAVE BAR */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-8 border-t border-[#EBE6E0] dark:border-white/10 mt-8 transition-colors">
        <motion.button 
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="w-full sm:w-auto justify-center px-8 py-4 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2"
        >
          <X size={16} strokeWidth={2.5} /> Cancel
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="w-full sm:w-auto justify-center px-10 py-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors"
        >
          <Check size={18} strokeWidth={3} /> Save Product
        </motion.button>
      </motion.div>

    </motion.div>
  );
}