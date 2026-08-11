import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, ArrowLeft, User, MapPin, Truck, Package, Calendar, Hash, Plus, Trash2, ShoppingCart, DollarSign, Printer, X
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

  // Order Cart & Fee State
  const [orderItems, setOrderItems] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(15.00);
  
  // Status & Invoice State
  const [orderStatus, setOrderStatus] = useState('pending');
  const [showInvoice, setShowInvoice] = useState(false);
  
  // Customer Details State (Needed for Invoice)
  const [customer, setCustomer] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
  });

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
    setQuantity(1);
  };

  const handleRemoveItem = (cartId) => {
    setOrderItems(orderItems.filter(item => item.cartId !== cartId));
  };

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSaveOrder = () => {
    if (orderStatus === 'shipped') {
      setShowInvoice(true);
    } else {
      navigate('/orders');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Financial Calculations
  const subTotal = orderItems.reduce((total, item) => total + (item.product.price * item.qty), 0);
  const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
  const finalTotal = subTotal + parsedDeliveryFee;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 pb-24 print:hidden transition-colors duration-300">
        
        {/* Top Action Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2 transition-colors">Create Manual Order</h1>
              <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-2 transition-colors">Draft a new transaction</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button 
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="px-6 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm"
            >
              Cancel
            </motion.button>
            <motion.button 
              onClick={handleSaveOrder}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors"
            >
              <Check size={16} strokeWidth={3} /> Save Order
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Customer & Shipping */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* System Details */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-8 transition-colors">System Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">
                    <Hash size={16} /> Order ID
                  </label>
                  <input type="text" value={autoId} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed transition-colors" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">
                    <Calendar size={16} /> Date Created
                  </label>
                  <input type="text" value={autoDate} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl border border-transparent outline-none text-sm font-bold cursor-not-allowed transition-colors" />
                </div>
              </div>
            </motion.div>

            {/* Customer Details */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 mb-8 transition-colors">
                <User size={24} /> Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">First Name</label>
                  <input type="text" name="firstName" value={customer.firstName} onChange={handleCustomerChange} placeholder="e.g. Emma" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Last Name</label>
                  <input type="text" name="lastName" value={customer.lastName} onChange={handleCustomerChange} placeholder="e.g. Thompson" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Email Address</label>
                  <input type="email" name="email" value={customer.email} onChange={handleCustomerChange} placeholder="emma@example.com" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Phone Number</label>
                  <input type="tel" name="phone" value={customer.phone} onChange={handleCustomerChange} placeholder="+1 (555) 000-0000" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
              </div>
            </motion.div>

            {/* Shipping Configuration */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 mb-8 transition-colors"><MapPin size={24} /> Shipping Configuration</h2>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Street Address</label>
                  <input type="text" name="address" value={customer.address} onChange={handleCustomerChange} placeholder="123 Fashion Avenue, Apt 4B" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">City</label>
                    <input type="text" name="city" value={customer.city} onChange={handleCustomerChange} placeholder="New York" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">State / Province</label>
                    <input type="text" name="state" value={customer.state} onChange={handleCustomerChange} placeholder="NY" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">ZIP Code</label>
                    <input type="text" name="zip" value={customer.zip} onChange={handleCustomerChange} placeholder="10001" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#EBE6E0] dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">
                    <Truck size={16} /> Courier Service
                  </label>
                  <select className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors">
                    <option className="dark:bg-[#111111]">DHL Express</option>
                    <option className="dark:bg-[#111111]">FedEx Priority</option>
                    <option className="dark:bg-[#111111]">UPS Standard</option>
                    <option className="dark:bg-[#111111]">Local Courier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Tracking Number</label>
                  <input type="text" placeholder="e.g. TRK-9988" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white placeholder:text-[#0F0E0D]/30 dark:placeholder:text-white/30" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">
                    <DollarSign size={16} /> Delivery Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-[#0F0E0D]/50 dark:text-white/50">$</span>
                    <input 
                      type="number" 
                      min="0" step="0.01"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      className="w-full bg-[#FBF9F6] dark:bg-white/5 pl-9 pr-5 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none transition-all text-sm font-bold text-[#0F0E0D] dark:text-white" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Status */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-8 transition-colors">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3 transition-colors">Current Status</label>
                  <select 
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold appearance-none cursor-pointer transition-colors"
                  >
                    <option value="pending" className="dark:bg-[#111111]">Pending</option>
                    <option value="processing" className="dark:bg-[#111111]">Processing</option>
                    <option value="shipped" className="dark:bg-[#111111]">Shipped (Generates Invoice)</option>
                    <option value="delivered" className="dark:bg-[#111111]">Delivered</option>
                  </select>
                </div>
                {orderStatus === 'shipped' && (
                  <div className="p-5 bg-[#F4F8F4] dark:bg-green-500/10 border border-[#E2EBE2] dark:border-green-500/20 rounded-2xl mt-4 transition-colors">
                    <p className="text-xs font-bold text-[#2E4A35] dark:text-green-400">
                      ✓ Saving this order will automatically generate a final invoice.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Order Items & Product Picker */}
          <div className="space-y-6">
            
            {/* Order Items Cart */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 transition-colors"><ShoppingCart size={24} /> Order Items</h2>
                <span className="bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] text-xs font-bold px-3 py-1.5 rounded-full transition-colors">{orderItems.length}</span>
              </div>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                <AnimatePresence>
                  {orderItems.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10 text-[#0F0E0D]/40 dark:text-white/40 font-bold text-sm border-2 border-dashed border-[#EBE6E0] dark:border-white/10 rounded-2xl transition-colors">
                      No products added yet.
                    </motion.div>
                  )}
                  
                  {orderItems.map((item) => (
                    <motion.div 
                      key={item.cartId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 bg-[#FBF9F6] dark:bg-white/5 shadow-sm relative group transition-colors"
                    >
                      <img src={item.product.img} className="w-16 h-16 rounded-xl object-cover border border-[#EBE6E0] dark:border-transparent" alt={item.product.name} />
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-extrabold text-[#0F0E0D] dark:text-white leading-tight pr-6 transition-colors">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D]/60 dark:text-white/60 transition-colors">Size: {item.size}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D]/60 dark:text-white/60 flex items-center gap-1 transition-colors">
                            Color: <div className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: item.color }}></div>
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-[#0F0E0D] dark:text-white mt-1.5 transition-colors">
                          {item.qty} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.cartId)}
                        className="absolute top-4 right-4 text-[#0F0E0D]/30 dark:text-white/30 hover:text-[#6A3131] dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-[#EBE6E0] dark:border-white/10 space-y-4 transition-colors">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 text-[10px] transition-colors">Subtotal</span>
                  <span className="font-bold text-[#0F0E0D] dark:text-white transition-colors">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 text-[10px] transition-colors">Delivery Fee</span>
                  <span className="font-bold text-[#0F0E0D] dark:text-white transition-colors">${parsedDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-[#EBE6E0] dark:border-white/10 transition-colors">
                  <span className="font-extrabold uppercase tracking-widest text-[#0F0E0D] dark:text-white text-xs transition-colors">Total Amount</span>
                  <span className="text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight transition-colors">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Product Picker */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 mb-8 transition-colors"><Package size={24} /> Add Product</h2>
              <div className="space-y-8">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">1. Select Item</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {availableProducts.map(prod => (
                      <div 
                        key={prod.id} 
                        onClick={() => { setSelectedProduct(prod); setActiveColor(prod.colors[0]); }}
                        className={`min-w-[80px] cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedProduct.id === prod.id ? 'border-[#0F0E0D] dark:border-white shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={prod.img} className="w-full h-24 object-cover" alt={prod.name} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center bg-[#FBF9F6] dark:bg-white/5 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 transition-colors">
                    <span className="text-sm font-extrabold text-[#0F0E0D] dark:text-white truncate pr-4 transition-colors">{selectedProduct.name}</span>
                    <span className="text-sm font-bold text-[#0F0E0D] dark:text-white transition-colors">${selectedProduct.price.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">2. Select Color</label>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.colors.map((color, idx) => (
                      <button 
                        key={idx} onClick={() => setActiveColor(color)}
                        className={`w-10 h-10 rounded-full transition-all duration-300 ${activeColor === color ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#111111] ring-[#0F0E0D] dark:ring-white scale-110 shadow-md' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">3. Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button 
                        key={size} onClick={() => setActiveSize(size)} 
                        className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all duration-300 ${activeSize === size ? 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] shadow-md scale-105' : 'bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 items-end pt-2">
                  <div className="w-24 shrink-0">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-4 transition-colors">Quantity</label>
                    <input 
                      type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" 
                      className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 py-4 rounded-2xl border border-transparent focus:bg-white dark:focus:bg-[#1A1A1A] focus:border-[#0F0E0D]/30 dark:focus:border-white/30 outline-none text-sm font-bold text-center text-[#0F0E0D] dark:text-white transition-colors" 
                    />
                  </div>
                  <button 
                    onClick={handleAddItem}
                    className="flex-1 py-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] font-extrabold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} strokeWidth={3} /> Add to Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* --- INVOICE MODAL & PRINT VIEW --- */}
      <AnimatePresence>
        {showInvoice && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F0E0D]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto print:absolute print:inset-0 print:bg-white print:p-0"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111111] w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden relative print:shadow-none print:rounded-none transition-colors"
            >
              {/* Modal Controls (Hidden in Print) */}
              <div className="flex justify-between items-center p-6 md:px-10 border-b border-[#EBE6E0] dark:border-white/10 bg-[#FBF9F6] dark:bg-white/5 print:hidden transition-colors">
                <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white transition-colors">Order Invoice Generated</h2>
                <div className="flex gap-3">
                  <button onClick={handlePrintInvoice} className="px-6 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                    <Printer size={16} strokeWidth={2.5} /> Print / PDF
                  </button>
                  <button onClick={() => navigate('/orders')} className="w-10 h-10 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white hover:bg-[#FFF4F4] dark:hover:bg-red-500/20 hover:text-[#6A3131] dark:hover:text-red-400 transition-colors">
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Document */}
              <div className="p-10 md:p-14 bg-white dark:bg-[#111111] print:bg-white text-[#0F0E0D] dark:text-white print:text-black transition-colors">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <div className="w-12 h-12 bg-[#0F0E0D] dark:bg-white print:bg-black text-[#FBF9F6] dark:text-[#0F0E0D] print:text-white flex items-center justify-center rounded-xl font-extrabold text-2xl mb-4 transition-colors">L</div>
                    <h1 className="text-3xl font-extrabold tracking-widest text-[#0F0E0D] dark:text-white print:text-black transition-colors">LUSTRE</h1>
                    <p className="text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-sm mt-2 transition-colors">124 Fashion Ave, NY 10001</p>
                    <p className="text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-sm transition-colors">hello@lustre.com</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-5xl font-extrabold text-[#EBE6E0] dark:text-white/10 print:text-gray-300 uppercase tracking-wider mb-6 transition-colors">Invoice</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 transition-colors">Invoice Number</p>
                    <p className="text-lg font-bold text-[#0F0E0D] dark:text-white print:text-black mb-3 transition-colors">{autoId}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 transition-colors">Date</p>
                    <p className="text-sm font-bold text-[#0F0E0D] dark:text-white print:text-black transition-colors">{autoDate}</p>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="grid grid-cols-2 gap-8 mb-12 border-t border-b border-[#EBE6E0] dark:border-white/10 print:border-gray-200 py-8 transition-colors">
                  <div>
                    <p className="text-[10px] font-bold text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 uppercase tracking-[0.2em] mb-4 transition-colors">Billed To</p>
                    <p className="font-extrabold text-xl text-[#0F0E0D] dark:text-white print:text-black transition-colors">{customer.firstName || 'Customer Name'} {customer.lastName}</p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 mt-2 transition-colors">{customer.address || '123 Empty St'}</p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 transition-colors">{customer.city || 'City'}, {customer.state || 'ST'} {customer.zip || '00000'}</p>
                    <p className="text-sm font-bold text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 mt-3 transition-colors">{customer.email || 'email@example.com'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 uppercase tracking-[0.2em] mb-4 transition-colors">Payment Info</p>
                    <p className="text-sm font-bold text-[#0F0E0D] dark:text-white print:text-black transition-colors">Status: <span className="text-[#2E4A35] dark:text-green-400 print:text-green-700 ml-1">Paid (Shipped)</span></p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 mt-2 transition-colors">Via Credit Card</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse mb-10">
                  <thead>
                    <tr className="border-b-2 border-[#0F0E0D] dark:border-white print:border-black transition-colors">
                      <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 transition-colors">Description</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-center transition-colors">Qty</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-right transition-colors">Unit Price</th>
                      <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-right transition-colors">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.length > 0 ? orderItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#EBE6E0] dark:border-white/10 print:border-gray-200 transition-colors">
                        <td className="py-6">
                          <p className="font-extrabold text-sm text-[#0F0E0D] dark:text-white print:text-black transition-colors">{item.product.name}</p>
                          <p className="text-xs font-bold text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 mt-1 transition-colors">Size: {item.size} | Color: {item.color}</p>
                        </td>
                        <td className="py-6 text-sm font-bold text-center text-[#0F0E0D]/80 dark:text-white/80 print:text-black/80 transition-colors">{item.qty}</td>
                        <td className="py-6 text-sm font-bold text-right text-[#0F0E0D]/80 dark:text-white/80 print:text-black/80 transition-colors">${item.product.price.toFixed(2)}</td>
                        <td className="py-6 text-sm font-extrabold text-right text-[#0F0E0D] dark:text-white print:text-black transition-colors">${(item.product.price * item.qty).toFixed(2)}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="py-8 text-center text-sm font-bold text-[#0F0E0D]/40 dark:text-white/40 print:text-black/40 transition-colors">No items in this order.</td></tr>
                    )}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 transition-colors">Subtotal</span>
                      <span className="font-bold text-[#0F0E0D] dark:text-white print:text-black transition-colors">${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pb-5 border-b border-[#EBE6E0] dark:border-white/10 print:border-gray-200 transition-colors">
                      <span className="font-bold text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 transition-colors">Delivery Fee</span>
                      <span className="font-bold text-[#0F0E0D] dark:text-white print:text-black transition-colors">${parsedDeliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-extrabold text-lg uppercase tracking-widest text-[#0F0E0D] dark:text-white print:text-black transition-colors">Total</span>
                      <span className="font-extrabold text-3xl text-[#0F0E0D] dark:text-white print:text-black transition-colors">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Footer Message */}
                <div className="mt-20 text-center text-[10px] font-bold text-[#0F0E0D]/40 dark:text-white/40 print:text-black/40 uppercase tracking-[0.3em] transition-colors">
                  Thank you for shopping with Lustre.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}