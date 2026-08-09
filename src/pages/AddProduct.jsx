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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1200px] w-full mx-auto space-y-6 pb-20">
      
      {/* Top Action Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white border border-[#C4BEB6]/40 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#C4BEB6]/20 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">Add New Product</h1>
        </div>
        
        <div className="flex gap-3">
          <motion.button 
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="px-6 py-2.5 bg-white border-2 border-[#C4BEB6]/40 rounded-full text-sm font-bold text-[#1A1A1A] hover:border-[#1A1A1A]/20 transition-colors shadow-sm"
          >
            Cancel
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="px-6 py-2.5 bg-[#1A1A1A] text-[#E9E3DB] rounded-full text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-[#1A1A1A]/80 transition-colors"
          >
            <Check size={18} strokeWidth={3} /> Save Product
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              
              {/* NEW SIZES INVENTORY GRID */}
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">Inventory per Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSizes.map(size => (
                    <div key={size} className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#1A1A1A]/60 text-center">{size}</label>
                      <input 
                        type="number" 
                        min="0"
                        value={sizeStock[size]}
                        onChange={(e) => handleSizeStockChange(size, e.target.value)}
                        className="w-full bg-[#C4BEB6]/10 px-3 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-2 focus:ring-[#1A1A1A]/5 outline-none text-sm font-bold text-center transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">Gender</label>
                <div className="flex flex-wrap gap-5 h-11 items-center">
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

            {/* DYNAMIC COLORS SECTION */}
            <div className="mt-8 pt-8 border-t border-[#C4BEB6]/20">
              <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-4">Available Colors</label>
              <div className="flex flex-wrap gap-4">
                {availableColors.map((color, index) => {
                  const isSelected = selectedColors.includes(color);
                  const isLightColor = color === '#ffffff' || color === '#E9E3DB' || color === '#C4BEB6' || color.toUpperCase() === '#FFF' || color.toUpperCase() === '#FFFFFF';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleColor(color)}
                      className={`relative w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center group ${isSelected ? 'scale-110 shadow-md' : 'hover:scale-105 shadow-sm border border-black/10'}`}
                      style={{ 
                        backgroundColor: color, 
                        boxShadow: isSelected ? `0 0 0 2px white, 0 0 0 4px #1A1A1A` : 'none' 
                      }}
                    >
                      {isSelected && (
                        <Check size={18} color={isLightColor ? '#1A1A1A' : 'white'} strokeWidth={3} />
                      )}
                    </button>
                  );
                })}

                <label className="relative w-10 h-10 rounded-full border-2 border-dashed border-[#C4BEB6]/60 flex items-center justify-center cursor-pointer hover:border-[#1A1A1A]/40 transition-colors group bg-[#C4BEB6]/10 hover:bg-[#C4BEB6]/20" title="Add Custom Color">
                  <Plus size={20} className="text-[#1A1A1A]/50 group-hover:text-[#1A1A1A] transition-colors" />
                  <input 
                    type="color" 
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    onChange={handleAddNewColor}
                  />
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5">Pricing And Stock</h2>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Base Pricing</label><input type="text" defaultValue="$47.55" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none text-sm font-medium" /></div>
              
              {/* AUTO-CALCULATING STOCK FIELD */}
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Total Stock</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={totalStock} 
                    readOnly 
                    className="w-full bg-[#C4BEB6]/20 text-[#1A1A1A]/60 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1A1A1A]/40 bg-white px-2 py-0.5 rounded-md shadow-sm pointer-events-none">
                    Auto
                  </div>
                </div>
              </div>
              
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

      {/* BOTTOM SAVE BAR */}
      <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-8 border-t border-[#C4BEB6]/30 mt-8">
        <motion.button 
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="px-8 py-4 bg-white border-2 border-[#C4BEB6]/40 rounded-2xl text-sm font-bold text-[#1A1A1A] hover:bg-[#C4BEB6]/10 transition-colors shadow-sm flex items-center gap-2"
        >
          <X size={20} /> Cancel
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="px-10 py-4 bg-[#1A1A1A] text-[#E9E3DB] rounded-2xl text-base font-bold flex items-center gap-3 shadow-xl hover:bg-[#1A1A1A]/80 transition-colors"
        >
          <Check size={22} strokeWidth={3} /> Save Product
        </motion.button>
      </motion.div>

    </motion.div>
  );
}