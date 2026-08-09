import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, ArrowLeft, User, MapPin, Truck, Package, Calendar, Hash, Plus, Trash2, ShoppingCart
} from 'lucide-react';

// Mock catalog of available products
const availableProducts = [
  { id: 'p1', name: 'Puffer Jacket With Pocket', price: 89.00, img: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop', colors: ['#A7F3D0', '#1A1A1A', '#E9E3DB'] },
  { id: 'p2', name: 'Minimalist Knit Sweater', price: 65.00, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=150&auto=format&fit=crop', colors: ['#E9E3DB', '#3d352e'] },
  { id: 'p3', name: 'Wide Leg Tailored Pants', price: 110.00, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop', colors: ['#1A1A1A', '#C4BEB6', '#3d352e'] },
  { id: 'p4', name: 'Oversized Cotton Tee', price: 35.00, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150&auto=format&fit=crop', colors: ['#ffffff', '#1A1A1A'] },
];

export default function AddOrder() {
  const navigate = useNavigate();
  
  // System locked details
  const [autoId, setAutoId] = useState('');
  const [autoDate, setAutoDate] = useState('');

  // Order Cart State
  const [orderItems, setOrderItems] = useState([]);
  
  // Current Item Configuration State
  const [selectedProduct, setSelectedProduct] = useState(availableProducts[0]);
  const [activeSize, setActiveSize] = useState('M');
  const [activeColor, setActiveColor] = useState(availableProducts[0].colors[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setAutoId(`#ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    const today = new Date();
    setAutoDate(today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
  }, []);

  const handleAddItem = () => {
    if (quantity < 1) return;
    const newItem = {
      cartId: Math.random().toString(36).substring(2, 9),
      product: selectedProduct,
      size: activeSize,
      color: activeColor,
      qty: parseInt(quantity),
    };
    setOrderItems([...orderItems, newItem]);
    setQuantity(1); // Reset quantity after adding
  };

  const handleRemoveItem = (cartId) => {
    setOrderItems(orderItems.filter(item => item.cartId !== cartId));
  };

  const orderTotal = orderItems.reduce((total, item) => total + (item.product.price * item.qty), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 max-w-[1400px] w-full mx-auto space-y-6 pb-24">
      
      {/* Top Action Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white border border-[#C4BEB6]/40 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#C4BEB6]/20 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">Create Manual Order</h1>
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
            <Check size={18} strokeWidth={3} /> Save Order
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Customer & Shipping (Spans 2 columns on extra large screens) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Locked System Details */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5">System Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]/80 mb-2">
                  <Hash size={16} /> Order ID
                </label>
                <input 
                  type="text" 
                  value={autoId} 
                  readOnly
                  className="w-full bg-[#C4BEB6]/20 text-[#1A1A1A]/60 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]/80 mb-2">
                  <Calendar size={16} /> Date Created
                </label>
                <input 
                  type="text" 
                  value={autoDate} 
                  readOnly
                  className="w-full bg-[#C4BEB6]/20 text-[#1A1A1A]/60 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed" 
                />
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><User size={20} /> Customer Details</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">First Name</label>
                <input type="text" placeholder="e.g. Emma" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Last Name</label>
                <input type="text" placeholder="e.g. Thompson" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Email Address</label>
                <input type="email" placeholder="emma@example.com" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
            </div>
          </motion.div>

          {/* Shipping & Courier */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><MapPin size={20} /> Shipping Configuration</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Street Address</label>
                <input type="text" placeholder="123 Fashion Avenue, Apt 4B" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">City</label>
                  <input type="text" placeholder="New York" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">State / Province</label>
                  <input type="text" placeholder="NY" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">ZIP Code</label>
                  <input type="text" placeholder="10001" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#C4BEB6]/30 grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]/80 mb-2">
                  <Truck size={16} /> Courier Service
                </label>
                <select className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-medium appearance-none cursor-pointer">
                  <option>DHL Express</option>
                  <option>FedEx Priority</option>
                  <option>UPS Standard</option>
                  <option>Local Courier</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Tracking Number</label>
                <input type="text" placeholder="e.g. TRK-99882211" className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none transition-all text-sm font-medium" />
              </div>
            </div>
          </motion.div>

          {/* Order Status */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <h2 className="text-lg font-bold mb-5">Order Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Current Status</label>
                <select className="w-full bg-[#C4BEB6]/10 px-5 py-3.5 rounded-2xl border border-transparent outline-none text-sm font-bold appearance-none cursor-pointer">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mt-4">
                <p className="text-xs font-bold text-orange-800">
                  Note: Setting status to "Shipped" will automatically trigger an email to the customer with their tracking details.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Order Items & Product Picker */}
        <div className="space-y-8">
          
          {/* Cart Summary */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20} /> Order Items</h2>
              <span className="bg-[#1A1A1A] text-[#E9E3DB] text-xs font-bold px-3 py-1 rounded-full">{orderItems.length}</span>
            </div>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              <AnimatePresence>
                {orderItems.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8 text-[#1A1A1A]/40 font-bold text-sm border-2 border-dashed border-[#C4BEB6]/40 rounded-2xl">
                    No products added yet.
                  </motion.div>
                )}
                
                {orderItems.map((item) => (
                  <motion.div 
                    key={item.cartId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3 rounded-2xl border border-[#C4BEB6]/30 bg-white shadow-sm relative group"
                  >
                    <img src={item.product.img} className="w-16 h-16 rounded-xl object-cover bg-[#C4BEB6]/10" alt={item.product.name} />
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-[#1A1A1A] leading-tight pr-6">{item.product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#1A1A1A]/50 bg-[#C4BEB6]/20 px-2 py-0.5 rounded-md">Size: {item.size}</span>
                        <span className="text-xs font-bold text-[#1A1A1A]/50 bg-[#C4BEB6]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          Color: <div className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.color }}></div>
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] mt-1">
                        {item.qty} x ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.cartId)}
                      className="absolute top-3 right-3 text-[#1A1A1A]/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-[#C4BEB6]/30 flex justify-between items-center">
              <span className="font-bold text-[#1A1A1A]/60">Total Amount</span>
              <span className="text-2xl font-extrabold text-[#1A1A1A]">${orderTotal.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Product Picker */}
          <motion.div variants={itemVariants} className="bg-white p-7 rounded-[2rem] shadow-sm border border-[#C4BEB6]/20 border-t-4 border-t-[#1A1A1A]">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><Package size={20} /> Add Product</h2>
            
            <div className="space-y-6">
              
              {/* Visual Product List */}
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">1. Select Item</label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {availableProducts.map(prod => (
                    <div 
                      key={prod.id} 
                      onClick={() => {
                        setSelectedProduct(prod);
                        setActiveColor(prod.colors[0]); // Reset color when product changes
                      }}
                      className={`min-w-[80px] cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedProduct.id === prod.id ? 'border-[#1A1A1A] shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={prod.img} className="w-full h-20 object-cover bg-[#C4BEB6]/10" alt={prod.name} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between items-center bg-[#C4BEB6]/10 p-3 rounded-xl border border-[#C4BEB6]/20">
                  <span className="text-sm font-bold text-[#1A1A1A] truncate pr-4">{selectedProduct.name}</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">${selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">2. Select Color</label>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${activeColor === color ? 'border-[#1A1A1A] scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color, boxShadow: activeColor === color ? `0 0 0 2px white, 0 0 0 4px #1A1A1A` : 'none' }}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-3">3. Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size} 
                      onClick={() => setActiveSize(size)} 
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${activeSize === size ? 'bg-[#1A1A1A] text-[#E9E3DB] shadow-md scale-105' : 'bg-[#C4BEB6]/20 text-[#1A1A1A] hover:bg-[#C4BEB6]/40'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add Button */}
              <div className="flex gap-4 items-end pt-2">
                <div className="w-24 shrink-0">
                  <label className="block text-sm font-bold text-[#1A1A1A]/80 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1" 
                    className="w-full bg-[#C4BEB6]/10 px-4 py-3.5 rounded-2xl border border-transparent focus:bg-white focus:border-[#1A1A1A]/30 focus:ring-4 focus:ring-[#1A1A1A]/5 outline-none text-sm font-bold text-center" 
                  />
                </div>
                <button 
                  onClick={handleAddItem}
                  className="flex-1 py-3.5 bg-[#C4BEB6]/20 text-[#1A1A1A] font-bold rounded-2xl text-sm hover:bg-[#C4BEB6]/40 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add to Order
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}