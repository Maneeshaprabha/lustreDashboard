import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, Upload, X, ArrowLeft, Loader2, ImageIcon, Search, ChevronDown } from 'lucide-react';
import { productService } from '../services/productService'; 
import { categoryService } from '../services/categoryService';

const defaultColorPalette = [
  '#1A1A1A', '#ffffff', '#E9E3DB', '#C4BEB6', '#3d352e', '#A7F3D0', '#FCA5A5', '#93C5FD',
];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export default function AddProduct() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [categories, setCategories] = useState([]);

  // Multiple Images Handling States
  const [imageFiles, setImageFiles] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]); 

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    discount: '',
    discountType: 'None'
  });

  // --- ALUTH: Custom Dropdown States ---
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].rawId }));
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();

    // Close dropdown on outside click
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const [activeGender, setActiveGender] = useState('Woman');
  const [availableColors, setAvailableColors] = useState(defaultColorPalette);
  const [selectedColors, setSelectedColors] = useState([defaultColorPalette[0]]);

  const [sizeStock, setSizeStock] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0
  });

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter(c => c !== color));
      }
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

  const handleSizeStockChange = (size, value) => {
    const qty = parseInt(value) || 0;
    setSizeStock(prev => ({ ...prev, [size]: qty }));
  };

  const totalStock = Object.values(sizeStock).reduce((sum, qty) => sum + qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      setErrorMsg("Please fill in the product name and price.");
      return;
    }
    if (totalStock === 0) {
      setErrorMsg("Please add stock to at least one size.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const cleanPrice = parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0;
      const categoryId = formData.category;

      const productVariants = [];
      Object.keys(sizeStock).forEach(size => {
        if (sizeStock[size] > 0) {
          selectedColors.forEach(color => {
             productVariants.push({
               size: size,
               stock: Math.floor(sizeStock[size] / selectedColors.length),
               color: color
             });
          });
        }
      });

      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            return await productService.uploadImage(file);
          })
        );
      }

      await productService.create({
        name: formData.name,
        base_price: cleanPrice,
        category_id: categoryId,
        description: formData.description,
        discount: formData.discount,
        discount_type: formData.discountType,
        img_url: uploadedImageUrls[0] || null, 
        images: uploadedImageUrls,
        variants: productVariants 
      });
      
      navigate('/products');
    } catch (error) {
      setErrorMsg(error.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  // Filter categories based on search input
  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()));
  const selectedCategoryName = categories.find(c => c.rawId === formData.category)?.name || "Select Category";

  return (
    <form onSubmit={handleSubmit}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1200px] w-full mx-auto space-y-6 pb-24 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
        
        {/* Top Action Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Add New Product</h1>
              <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2 transition-colors">Expand your inventory</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <motion.button type="button" onClick={() => navigate(-1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 md:flex-none justify-center px-6 py-3.5 sm:py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm flex items-center">
              Cancel
            </motion.button>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 md:flex-none justify-center px-6 py-3.5 sm:py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors disabled:opacity-70">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} strokeWidth={3} /> Save</>}
            </motion.button>
          </div>
        </motion.div>

        {errorMsg && (
          <motion.div variants={itemVariants} className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl text-center">
            {errorMsg}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Data Entry */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">General Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Puffer Jacket With Pocket Detail" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Product Description</label>
                  <textarea rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Cropped puffer jacket made of technical fabric..." className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white resize-none leading-relaxed placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">Inventory per Size</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {availableSizes.map(size => (
                      <div key={size} className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#0F0E0D]/50 dark:text-white/50 text-center uppercase tracking-widest transition-colors">{size}</label>
                        <input type="number" min="0" value={sizeStock[size]} onChange={(e) => handleSizeStockChange(size, e.target.value)} className="w-full bg-[#FBF9F6] dark:bg-white/5 px-3 py-3 rounded-xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-center text-[#0F0E0D] dark:text-white transition-all" />
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

              <div className="mt-8 pt-8 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">Available Colors</label>
                <div className="flex flex-wrap gap-4 items-center">
                  {availableColors.map((color, index) => {
                    const isSelected = selectedColors.includes(color);
                    const isLightColor = color === '#ffffff' || color === '#E9E3DB' || color === '#C4BEB6' || color.toUpperCase() === '#FFF' || color.toUpperCase() === '#FFFFFF';
                    return (
                      <button type="button" key={index} onClick={() => toggleColor(color)} className={`relative w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center group shrink-0 ${isSelected ? 'scale-110 shadow-md' : 'hover:scale-105 shadow-sm border border-black/10 dark:border-white/10'}`} style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 0 2px ${isLightColor ? '#EBE6E0' : 'white'}, 0 0 0 4px #0F0E0D` : 'none' }}>
                        {isSelected && <Check size={18} color={isLightColor ? '#0F0E0D' : 'white'} strokeWidth={3} />}
                      </button>
                    );
                  })}
                  <label className="relative w-10 h-10 shrink-0 rounded-full border-2 border-dashed border-[#EBE6E0] dark:border-white/20 flex items-center justify-center cursor-pointer hover:border-[#0F0E0D]/40 dark:hover:border-white/40 transition-colors group bg-[#FBF9F6] dark:bg-white/5" title="Add Custom Color">
                    <Plus size={18} className="text-[#0F0E0D]/50 dark:text-white/50 group-hover:text-[#0F0E0D] dark:group-hover:text-white transition-colors" />
                    <input type="color" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={handleAddNewColor} />
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Pricing And Stock</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* --- LKR ADDED HERE --- */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Base Pricing</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#0F0E0D]/40 dark:text-white/40">LKR</span>
                    <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full bg-[#FBF9F6] dark:bg-white/5 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Total Stock</label>
                  <div className="relative">
                    <input type="text" value={totalStock} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed transition-colors" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 px-2.5 py-1 rounded-full shadow-sm pointer-events-none transition-colors">Auto</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Discount</label>
                  <input type="text" name="discount" value={formData.discount} onChange={handleChange} placeholder="e.g. 10%" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Discount Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                    <option value="Winter Sale Discount" className="dark:bg-[#111111]">Winter Sale Discount</option>
                    <option value="Clearance" className="dark:bg-[#111111]">Clearance</option>
                    <option value="None" className="dark:bg-[#111111]">None</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Media & Categories */}
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Upload Images</h2>
              
              {/* --- MAIN IMAGE PREVIEW / DROPZONE --- */}
              <label className="bg-[#FBF9F6] dark:bg-white/5 rounded-[2rem] p-4 flex flex-col items-center justify-center border-2 border-dashed border-[#EBE6E0] dark:border-white/20 min-h-[200px] sm:min-h-[280px] mb-6 relative overflow-hidden group cursor-pointer hover:border-[#0F0E0D]/40 dark:hover:border-white/40 transition-colors">
                <input 
                  type="file" 
                  multiple
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
                
                <div className={`absolute inset-0 bg-[#0F0E0D]/10 dark:bg-white/10 flex flex-col items-center justify-center transition-opacity z-10 ${imagePreviews.length > 0 ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  <Upload className="text-[#0F0E0D] dark:text-white w-8 h-8 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/70 dark:text-white/70">
                    {imagePreviews.length > 0 ? 'Add More Images' : 'Select Images'}
                  </span>
                </div>

                {imagePreviews.length > 0 ? (
                  <img src={imagePreviews[0]} alt="Main Preview" className="absolute inset-0 w-full h-full object-cover rounded-[1.7rem] group-hover:blur-sm transition-all duration-300" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-[#0F0E0D]/10 dark:text-white/10" />
                  </div>
                )}
              </label>
              
              {/* --- MULTIPLE THUMBNAILS GRID --- */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-2xl border-2 border-[#0F0E0D] dark:border-white overflow-hidden p-0.5 group">
                      <img src={src} className="w-full h-full object-cover rounded-xl" alt={`thumbnail-${index}`} />
                      
                      {/* Delete Overlay */}
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="absolute inset-0.5 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <X className="text-white w-6 h-6" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Small add more button at the end */}
                  <label className="w-16 h-16 bg-[#FBF9F6] dark:bg-white/5 rounded-2xl border-2 border-dashed border-[#EBE6E0] dark:border-white/20 flex items-center justify-center text-[#0F0E0D]/60 dark:text-white/60 hover:bg-[#EBE6E0] dark:hover:bg-white/10 transition-colors hover:text-[#0F0E0D] dark:hover:text-white shrink-0 cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                    <Plus size={20} strokeWidth={2.5} />
                  </label>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors relative">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Category</h2>
              <div className="space-y-6">
                
                {/* --- ALUTH: CUSTOM SEARCHABLE DROPDOWN --- */}
                <div className="relative" ref={categoryDropdownRef}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Product Category</label>
                  
                  <div 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent hover:border-[#0F0E0D]/20 dark:hover:border-white/20 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span className="text-sm font-bold text-[#0F0E0D] dark:text-white">{selectedCategoryName}</span>
                    <ChevronDown size={18} className={`text-[#0F0E0D]/50 dark:text-white/50 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 top-[100%] left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1A] border border-[#EBE6E0] dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                      >
                        {/* Search Input Inside Dropdown */}
                        <div className="p-3 border-b border-[#EBE6E0] dark:border-white/10 relative">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40" size={14} strokeWidth={2.5} />
                          <input 
                            type="text" 
                            placeholder="Search category..." 
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="w-full bg-[#FBF9F6] dark:bg-white/5 pl-10 pr-4 py-2.5 rounded-xl border border-transparent outline-none text-xs font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/40 dark:placeholder:text-white/40 transition-colors"
                          />
                        </div>

                        {/* Dropdown Options */}
                        <div className="max-h-60 overflow-y-auto p-2 scrollbar-hide">
                          {filteredCategories.length === 0 ? (
                            <p className="p-4 text-xs font-bold text-center text-[#0F0E0D]/40 dark:text-white/40">No categories found</p>
                          ) : (
                            filteredCategories.map(cat => (
                              <button
                                key={cat.rawId}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, category: cat.rawId });
                                  setIsCategoryOpen(false);
                                  setCategorySearch(''); // Reset search after select
                                }}
                                className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-colors ${formData.category === cat.rawId ? 'bg-[#0F0E0D] text-white dark:bg-white dark:text-[#0F0E0D]' : 'text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/10'}`}
                              >
                                {cat.name}
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button type="button" onClick={() => navigate('/categories')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-[#FBF9F6] dark:bg-white/5 border border-[#EBE6E0] dark:border-white/10 text-[#0F0E0D] dark:text-white font-extrabold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#EBE6E0]/50 dark:hover:bg-white/10 transition-colors">
                  Manage Categories
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM SAVE BAR */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-8 border-t border-[#EBE6E0] dark:border-white/10 mt-8 transition-colors">
          <motion.button type="button" onClick={() => navigate(-1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto justify-center px-8 py-4 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <X size={16} strokeWidth={2.5} /> Cancel
          </motion.button>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto justify-center px-10 py-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors disabled:opacity-70">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} strokeWidth={3} /> Save Product</>}
          </motion.button>
        </motion.div>

      </motion.div>
    </form>
  );
}