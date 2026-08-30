import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, ArrowLeft, User, MapPin, Truck, Package, Calendar, Hash, Plus, Trash2, ShoppingCart, DollarSign, Printer, X, Loader2, Search, AlertCircle
} from 'lucide-react';
import { productService } from '../services/productService'; 
import { orderService } from '../services/orderService';   

export default function AddOrder() {
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [availableProducts, setAvailableProducts] = useState([]);

  // Custom Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  // Product Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // System locked details
  const [autoId, setAutoId] = useState('');
  const [autoDate, setAutoDate] = useState('');

  // Order Cart & Fee State
  const [orderItems, setOrderItems] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(15.00);
  const [courier, setCourier] = useState('DHL Express');
  const [tracking, setTracking] = useState('');
  
  // Status & Invoice State
  const [orderStatus, setOrderStatus] = useState('PENDING');
  const [showInvoice, setShowInvoice] = useState(false);
  
  // Customer Details State
  const [customer, setCustomer] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
  });

  // Current Item Configuration State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSize, setActiveSize] = useState('M');
  const [activeColor, setActiveColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setAutoId(`#ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    const today = new Date();
    setAutoDate(today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));

    const fetchProducts = async () => {
      try {
        const products = await productService.getAll();
        setAvailableProducts(products);
        if (products.length > 0) {
          handleSelectProduct(products[0]);
        }
      } catch (error) {
        console.error("Failed to load products", error);
        showNotification("Failed to load products. Check your connection.", "error");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3500); 
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    const colors = product.variants ? [...new Set(product.variants.map(v => v.color_hex || v.color).filter(Boolean))] : [];
    const sizes = product.variants ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] : ['M'];
    
    setActiveColor(colors.length > 0 ? colors[0] : '#1A1A1A');
    setActiveSize(sizes.length > 0 ? sizes[0] : 'M');
    setIsSearchOpen(false);
  };

  const handleAddItem = () => {
    if (!selectedProduct) return showNotification("Please select a product first.");
    if (quantity < 1) return showNotification("Quantity must be at least 1.");
    
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

  const handleSaveOrder = async () => {
    if (orderItems.length === 0) return showNotification("Please add at least one item to the order.");
    if (!customer.firstName || !customer.lastName) return showNotification("Please provide customer's full name.");
    if (!customer.address) return showNotification("Shipping address is required.");

    try {
      setIsSaving(true);
      
      const orderPayload = {
        custom_id: autoId,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_email: customer.email || 'N/A',
        shipping_address: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zip || ''}`,
        
        total_amount: finalTotal,
        sub_total: subTotal,
        delivery_fee: parsedDeliveryFee,
        
        status: orderStatus,
        courier: courier,
        tracking_number: tracking || 'Pending',
        items: orderItems.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.base_price,
          qty: item.qty,
          size: item.size,
          color: item.color
        }))
      };

      await orderService.create(orderPayload);
      
      if (orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED') {
        setShowInvoice(true);
      } else {
        showNotification("Order saved successfully!", "success");
        setTimeout(() => navigate('/orders'), 1500);
      }
    } catch (error) {
      console.error("Failed to save order", error);
      showNotification("Error saving order. Please check the console.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintInvoice = () => window.print();

  // --- ALUTH: Close Invoice and Reset Form ---
  const handleCloseInvoice = () => {
    setShowInvoice(false);
    // Form eka clear karala aluth order ekakata laasthi karanawa
    setOrderItems([]);
    setCustomer({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '' });
    setTracking('');
    setOrderStatus('PENDING');
    setAutoId(`#ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    // Page eke udata scroll karanawa
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification("Ready for the next order", "success");
  };

  // Financial Calculations
  const subTotal = orderItems.reduce((total, item) => total + ((item.product.base_price || 0) * item.qty), 0);
  const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
  const finalTotal = subTotal + parsedDeliveryFee;

  // Search Filter
  const filteredProducts = availableProducts.filter(prod => 
    prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    prod.custom_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  const productColors = selectedProduct?.variants ? [...new Set(selectedProduct.variants.map(v => v.color_hex || v.color).filter(Boolean))] : ['#1A1A1A', '#ffffff'];
  const productSizes = selectedProduct?.variants ? [...new Set(selectedProduct.variants.map(v => v.size).filter(Boolean))] : ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <>
      {/* CUSTOM FLOATING NOTIFICATION */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} 
            exit={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md border ${
              notification.type === 'error' 
                ? 'bg-white/90 dark:bg-[#111111]/90 border-red-200 dark:border-red-500/20' 
                : 'bg-white/90 dark:bg-[#111111]/90 border-green-200 dark:border-green-500/20'
            }`}
          >
            {notification.type === 'error' ? (
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <AlertCircle size={16} strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                <Check size={16} strokeWidth={2.5} />
              </div>
            )}
            <span className={`text-sm font-bold tracking-wide ${notification.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 pb-24 print:hidden transition-colors duration-300">
        
        {/* Top Action Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white shadow-sm hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2">Create Manual Order</h1>
              <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2">Draft a new transaction</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none justify-center px-6 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 shadow-sm transition-colors">Cancel</button>
            <button onClick={handleSaveOrder} disabled={isSaving} className="flex-1 md:flex-none justify-center px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] disabled:opacity-70 transition-colors">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} strokeWidth={3} /> Save Order</>}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Customer & Shipping */}
          <div className="xl:col-span-2 space-y-6">
            
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">System Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3"><Hash size={16} /> Order ID</label>
                  <input type="text" value={autoId} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl outline-none text-sm font-bold cursor-not-allowed" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3"><Calendar size={16} /> Date Created</label>
                  <input type="text" value={autoDate} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl outline-none text-sm font-bold cursor-not-allowed" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 mb-6 sm:mb-8 transition-colors"><User size={24} /> Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">First Name</label>
                  <input type="text" name="firstName" value={customer.firstName} onChange={handleCustomerChange} placeholder="e.g. Emma" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Last Name</label>
                  <input type="text" name="lastName" value={customer.lastName} onChange={handleCustomerChange} placeholder="e.g. Thompson" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Email Address</label>
                  <input type="email" name="email" value={customer.email} onChange={handleCustomerChange} placeholder="emma@example.com" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Phone Number</label>
                  <input type="tel" name="phone" value={customer.phone} onChange={handleCustomerChange} placeholder="+1 (555) 000-0000" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 mb-6 sm:mb-8 transition-colors"><MapPin size={24} /> Shipping Configuration</h2>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Street Address</label>
                  <input type="text" name="address" value={customer.address} onChange={handleCustomerChange} placeholder="123 Fashion Avenue, Apt 4B" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">City</label>
                    <input type="text" name="city" value={customer.city} onChange={handleCustomerChange} placeholder="New York" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">State / Province</label>
                    <input type="text" name="state" value={customer.state} onChange={handleCustomerChange} placeholder="NY" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">ZIP Code</label>
                    <input type="text" name="zip" value={customer.zip} onChange={handleCustomerChange} placeholder="10001" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#EBE6E0] dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3"><Truck size={16} /> Courier Service</label>
                  <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer">
                    <option className="dark:bg-[#111111]">DHL Express</option>
                    <option className="dark:bg-[#111111]">FedEx Priority</option>
                    <option className="dark:bg-[#111111]">UPS Standard</option>
                    <option className="dark:bg-[#111111]">Local Courier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Tracking Number</label>
                  <input type="text" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. TRK-9988" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3"><DollarSign size={16} /> Delivery Fee</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-[#0F0E0D]/50 dark:text-white/50">$</span>
                    <input type="number" min="0" step="0.01" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-full bg-[#FBF9F6] dark:bg-white/5 pl-9 pr-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight mb-6 sm:mb-8 transition-colors">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Current Status</label>
                  <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white px-5 py-4 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer">
                    <option value="PENDING" className="dark:bg-[#111111]">Pending</option>
                    <option value="PROCESSING" className="dark:bg-[#111111]">Processing</option>
                    <option value="SHIPPED" className="dark:bg-[#111111]">Shipped (Generates Invoice)</option>
                    <option value="DELIVERED" className="dark:bg-[#111111]">Delivered</option>
                  </select>
                </div>
                {(orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED') && (
                  <div className="p-4 sm:p-5 bg-[#F4F8F4] dark:bg-green-500/10 border border-[#E2EBE2] dark:border-green-500/20 rounded-2xl mt-4">
                    <p className="text-[10px] sm:text-xs font-bold text-[#2E4A35] dark:text-green-400">✓ Saving this order will automatically generate a final invoice.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Order Items & Product Picker */}
          <div className="space-y-6">
            
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3"><ShoppingCart size={24} /> Order Items</h2>
                <span className="bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] text-xs font-bold px-3 py-1.5 rounded-full">{orderItems.length}</span>
              </div>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                <AnimatePresence>
                  {orderItems.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10 text-[#0F0E0D]/40 dark:text-white/40 font-bold text-sm border-2 border-dashed border-[#EBE6E0] dark:border-white/10 rounded-2xl">
                      No products added yet.
                    </motion.div>
                  )}
                  
                  {orderItems.map((item) => (
                    <motion.div key={item.cartId} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-4 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 bg-[#FBF9F6] dark:bg-white/5 relative group transition-colors">
                      <img src={item.product.img_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-xl object-cover" alt={item.product.name} />
                      <div className="flex-1 flex flex-col justify-center pr-6">
                        <h4 className="text-sm font-extrabold text-[#0F0E0D] dark:text-white leading-tight">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D]/60 dark:text-white/60">Size: {item.size}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D]/60 dark:text-white/60 flex items-center gap-1">
                            Color: <div className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20" style={{ backgroundColor: item.color }}></div>
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-[#0F0E0D] dark:text-white mt-1.5">
                          {item.qty} x ${(item.product.base_price || 0).toFixed(2)}
                        </p>
                      </div>
                      <button type="button" onClick={() => handleRemoveItem(item.cartId)} className="absolute top-4 right-4 text-[#0F0E0D]/30 dark:text-white/30 hover:text-red-500 transition-colors">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-[#EBE6E0] dark:border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 text-[10px]">Subtotal</span>
                  <span className="font-bold text-[#0F0E0D] dark:text-white">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 text-[10px]">Delivery Fee</span>
                  <span className="font-bold text-[#0F0E0D] dark:text-white">${parsedDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-[#EBE6E0] dark:border-white/10">
                  <span className="font-extrabold uppercase tracking-widest text-[#0F0E0D] dark:text-white text-xs">Total Amount</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Product Picker with LIVE SEARCH */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3 mb-6 sm:mb-8"><Package size={24} /> Add Product</h2>
              
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center p-10"><Loader2 className="animate-spin text-[#0F0E0D] dark:text-white" /></div>
              ) : availableProducts.length === 0 ? (
                <div className="text-center text-sm text-[#0F0E0D]/50 dark:text-white/50 font-bold">No products found in database.</div>
              ) : (
                <div className="space-y-6">
                  
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2">1. Search & Select Item</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F0E0D]/40 dark:text-white/40" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search by product name or SKU..." 
                        value={searchQuery}
                        onFocus={() => setIsSearchOpen(true)}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsSearchOpen(true);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#FBF9F6] dark:bg-white/5 border border-transparent focus:border-[#0F0E0D]/30 dark:focus:border-white/30 rounded-2xl text-sm font-bold text-[#0F0E0D] dark:text-white outline-none transition-all"
                      />
                    </div>

                    <AnimatePresence>
                      {isSearchOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-[105%] bg-white dark:bg-[#181818] border border-[#EBE6E0] dark:border-white/10 rounded-2xl shadow-xl z-20 max-h-56 overflow-y-auto p-2 scrollbar-hide"
                        >
                          {filteredProducts.length === 0 ? (
                            <div className="p-4 text-xs font-bold text-center text-[#0F0E0D]/40 dark:text-white/40">No matching products found</div>
                          ) : (
                            filteredProducts.map(prod => (
                              <div 
                                key={prod.id} 
                                onClick={() => handleSelectProduct(prod)}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FBF9F6] dark:hover:bg-white/5 cursor-pointer transition-colors"
                              >
                                <img src={prod.img_url || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-cover" alt={prod.name} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-extrabold text-[#0F0E0D] dark:text-white truncate">{prod.name}</p>
                                  <p className="text-[10px] font-mono text-[#0F0E0D]/50 dark:text-white/50">{prod.custom_id || 'No SKU'}</p>
                                </div>
                                <span className="text-xs font-bold text-[#0F0E0D] dark:text-white">${(prod.base_price || 0).toFixed(2)}</span>
                              </div>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {selectedProduct && (
                    <div className="flex items-center justify-between gap-3 bg-[#FBF9F6] dark:bg-white/5 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <img src={selectedProduct.img_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-xs font-extrabold text-[#0F0E0D] dark:text-white">{selectedProduct.name}</p>
                          <p className="text-[10px] font-mono font-bold text-[#0F0E0D]/50 dark:text-white/50">{selectedProduct.custom_id}</p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#0F0E0D] dark:text-white">${(selectedProduct.base_price || 0).toFixed(2)}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">2. Select Color</label>
                    <div className="flex flex-wrap gap-2.5">
                      {productColors.map((color, idx) => (
                        <button 
                          key={idx} type="button" onClick={() => setActiveColor(color)}
                          className={`w-9 h-9 rounded-full transition-all duration-200 border border-black/10 ${activeColor === color ? 'ring-2 ring-offset-2 ring-[#0F0E0D] dark:ring-white scale-110 shadow-sm' : 'hover:scale-105'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">3. Select Size</label>
                    <div className="flex flex-wrap gap-2">
                      {productSizes.map(size => (
                        <button 
                          key={size} type="button" onClick={() => setActiveSize(size)} 
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${activeSize === size ? 'bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] shadow-sm scale-105' : 'bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D] dark:text-white hover:bg-[#EBE6E0] dark:hover:bg-white/10'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end pt-2">
                    <div className="w-full sm:w-24 shrink-0">
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-2">Qty</label>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        min="1" 
                        className="w-full bg-[#FBF9F6] dark:bg-white/5 px-4 py-3.5 rounded-xl outline-none text-sm font-bold text-center text-[#0F0E0D] dark:text-white" 
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={handleAddItem} 
                      className="w-full sm:flex-1 py-3.5 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] font-extrabold uppercase tracking-widest text-[10px] rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Plus size={16} strokeWidth={3} /> Add to Order
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* --- BOTTOM SAVE BAR --- */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-8 border-t border-[#EBE6E0] dark:border-white/10 mt-8 transition-colors">
          <motion.button 
            type="button" 
            onClick={() => navigate(-1)} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="w-full sm:w-auto justify-center px-8 py-4 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2"
          >
            <X size={16} strokeWidth={2.5} /> Cancel
          </motion.button>
          
          <motion.button 
            onClick={handleSaveOrder} 
            disabled={isSaving} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="w-full sm:w-auto justify-center px-10 py-4 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] hover:bg-[#0F0E0D]/90 dark:hover:bg-white/90 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} strokeWidth={3} /> Save Order</>}
          </motion.button>
        </motion.div>

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
              className="bg-white dark:bg-[#111111] w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden relative my-auto print:my-0 print:shadow-none print:rounded-none"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 md:px-10 border-b border-[#EBE6E0] dark:border-white/10 bg-[#FBF9F6] dark:bg-white/5 print:hidden">
                <h2 className="text-xl font-bold text-[#0F0E0D] dark:text-white">Order Invoice Generated</h2>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button onClick={handlePrintInvoice} className="flex-1 sm:flex-none justify-center px-6 py-2.5 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 flex items-center gap-2">
                    <Printer size={16} strokeWidth={2.5} /> Print / PDF
                  </button>
                  {/* ALUTH: CLOSE BUTTON BEHAVIOR CHANGED */}
                  <button onClick={handleCloseInvoice} className="w-10 h-10 shrink-0 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/20 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white hover:bg-red-50 hover:text-red-500">
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-10 md:p-14 bg-white dark:bg-[#111111] print:bg-white text-[#0F0E0D] dark:text-white print:text-black">
                <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start gap-8 sm:gap-0 mb-10 sm:mb-16">
                  <div>
                    <div className="w-12 h-12 bg-[#0F0E0D] dark:bg-white print:bg-black text-[#FBF9F6] dark:text-[#0F0E0D] print:text-white flex items-center justify-center rounded-xl font-extrabold text-2xl mb-4">L</div>
                    <h1 className="text-3xl font-extrabold tracking-widest text-[#0F0E0D] dark:text-white print:text-black">LUSTRE</h1>
                    <p className="text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-sm mt-2">124 Fashion Ave, NY 10001</p>
                    <p className="text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-sm">hello@lustre.com</p>
                  </div>
                  <div className="text-left sm:text-right print:text-right">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-[#EBE6E0] dark:text-white/10 print:text-gray-300 uppercase tracking-wider mb-6">Invoice</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50">Invoice Number</p>
                    <p className="text-lg font-bold text-[#0F0E0D] dark:text-white print:text-black mb-3">{autoId}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50">Date</p>
                    <p className="text-sm font-bold text-[#0F0E0D] dark:text-white print:text-black">{autoDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-8 mb-10 sm:mb-12 border-y border-[#EBE6E0] dark:border-white/10 print:border-gray-200 py-8">
                  <div>
                    <p className="text-[10px] font-bold text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 uppercase tracking-[0.2em] mb-4">Billed To</p>
                    <p className="font-extrabold text-xl text-[#0F0E0D] dark:text-white print:text-black">{customer.firstName || 'Customer Name'} {customer.lastName}</p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 mt-2">{customer.address || 'Address Not Provided'}</p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70">{customer.city} {customer.state} {customer.zip}</p>
                    <p className="text-sm font-bold text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 mt-3">{customer.email || 'No Email'}</p>
                  </div>
                  <div className="text-left sm:text-right print:text-right">
                    <p className="text-[10px] font-bold text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 uppercase tracking-[0.2em] mb-4">Order Info</p>
                    <p className="text-sm font-bold text-[#0F0E0D] dark:text-white print:text-black">Status: <span className="text-[#2E4A35] dark:text-green-400 print:text-green-700 ml-1">{orderStatus}</span></p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70 mt-2">Courier: {courier}</p>
                    <p className="text-sm font-medium text-[#0F0E0D]/70 dark:text-white/70 print:text-black/70">Tracking: {tracking || 'Pending'}</p>
                  </div>
                </div>

                <div className="overflow-x-auto w-full mb-10 pb-4">
                  <table className="w-full min-w-[500px] text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#0F0E0D] dark:border-white print:border-black">
                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60">Description</th>
                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-center">Qty</th>
                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-right">Unit Price</th>
                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-[#EBE6E0] dark:border-white/10 print:border-gray-200">
                          <td className="py-6">
                            <p className="font-extrabold text-sm text-[#0F0E0D] dark:text-white print:text-black">{item.product.name}</p>
                            <p className="text-xs font-bold text-[#0F0E0D]/50 dark:text-white/50 print:text-black/50 mt-1">Size: {item.size} | Color Hex: {item.color}</p>
                          </td>
                          <td className="py-6 text-sm font-bold text-center text-[#0F0E0D]/80 dark:text-white/80 print:text-black/80">{item.qty}</td>
                          <td className="py-6 text-sm font-bold text-right text-[#0F0E0D]/80 dark:text-white/80 print:text-black/80">${(item.product.base_price || 0).toFixed(2)}</td>
                          <td className="py-6 text-sm font-extrabold text-right text-[#0F0E0D] dark:text-white print:text-black">${((item.product.base_price || 0) * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-full sm:max-w-xs space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60">Subtotal</span>
                      <span className="font-bold text-[#0F0E0D] dark:text-white print:text-black">${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pb-5 border-b border-[#EBE6E0] dark:border-white/10 print:border-gray-200">
                      <span className="font-bold text-[#0F0E0D]/60 dark:text-white/60 print:text-black/60">Delivery Fee</span>
                      <span className="font-bold text-[#0F0E0D] dark:text-white print:text-black">${parsedDeliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-extrabold text-lg uppercase tracking-widest text-[#0F0E0D] dark:text-white print:text-black">Total</span>
                      <span className="font-extrabold text-3xl text-[#0F0E0D] dark:text-white print:text-black">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-16 sm:mt-20 text-center text-[10px] font-bold text-[#0F0E0D]/40 dark:text-white/40 print:text-black/40 uppercase tracking-[0.3em]">
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