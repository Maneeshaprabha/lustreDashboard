import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Check, ArrowLeft, User, MapPin, Truck, Calendar, Hash, ShoppingCart, DollarSign, Loader2, AlertCircle, X, Printer
} from 'lucide-react';
import { orderService } from '../services/orderService'; 

export default function EditOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'error' });

  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  
  const [orderItems, setOrderItems] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(15.00);
  const [courier, setCourier] = useState('DHL Express');
  const [tracking, setTracking] = useState('');
  const [orderStatus, setOrderStatus] = useState('PENDING');

  const [customer, setCustomer] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
  });

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setLoading(true);
        const orders = await orderService.getAll();
        const currentOrder = orders.find(o => o.id === id);

        if (!currentOrder) {
          showNotification("Order not found.", "error");
          setTimeout(() => navigate('/orders'), 1500);
          return;
        }

        setOrderId(currentOrder.custom_id || currentOrder.order_number || '#ORD-0000');
        setOrderDate(currentOrder.created_at ? new Date(currentOrder.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '');
        
        setOrderStatus(currentOrder.status || 'PENDING');
        setCourier(currentOrder.courier || 'DHL Express');
        setTracking(currentOrder.tracking_number || '');
        setDeliveryFee(currentOrder.delivery_fee !== undefined ? currentOrder.delivery_fee : 15.00);

        const nameParts = (currentOrder.customer_name || '').split(' ');
        setCustomer({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: currentOrder.customer_email || '',
          phone: currentOrder.customer_phone || '',
          address: currentOrder.shipping_address || '',
          city: '', state: '', zip: ''
        });

        if (currentOrder.items) {
          setOrderItems(Array.isArray(currentOrder.items) ? currentOrder.items : []);
        }

      } catch (err) {
        console.error("Failed to load order details", err);
        showNotification("Failed to load order details.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOrderData();
  }, [id, navigate]);

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3500);
  };

  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

const handleSaveOrder = async () => {
    if (!customer.firstName) return showNotification("Customer first name is required.");

    try {
      setIsSaving(true);

      const updatedPayload = {
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_email: customer.email || 'N/A',
        shipping_address: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zip || ''}`,
        total_amount: finalTotal,
        sub_total: subTotal,
        delivery_fee: parsedDeliveryFee,
        status: orderStatus,
        courier: courier,
        tracking_number: tracking || 'Pending'
      };

      await orderService.update(id, updatedPayload);
      showNotification("Order updated successfully!", "success");
      
      setTimeout(() => {
        window.location.href = '/orders'; 
      }, 1200);

    } catch (error) {
      console.error("Failed to update order", error);
      showNotification("Error updating order.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const subTotal = orderItems.reduce((total, item) => total + ((item.price || item.unit_price || 0) * (item.qty || item.quantity || 1)), 0);
  const parsedDeliveryFee = parseFloat(deliveryFee) || 0;
  const finalTotal = subTotal + parsedDeliveryFee;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBF9F6] dark:bg-[#0A0A0A] text-[#0F0E0D]/40 dark:text-white/40">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Order Details...</p>
      </div>
    );
  }

  return (
    <>
      {/* CUSTOM NOTIFICATION */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} 
            exit={{ opacity: 0, y: -40, scale: 0.95, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md border ${
              notification.type === 'error' ? 'bg-white/90 dark:bg-[#111111]/90 border-red-200 text-red-500' : 'bg-white/90 dark:bg-[#111111]/90 border-green-200 text-green-500'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            <span className="text-sm font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-6 pb-24 bg-[#FBF9F6] dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
        
        {/* Top Action Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-full flex items-center justify-center text-[#0F0E0D] dark:text-white shadow-sm hover:bg-[#FBF9F6] dark:hover:bg-white/5 transition-colors">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-2">Edit Order</h1>
              <p className="text-[10px] text-[#0F0E0D]/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2">Modify order & shipping status</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button onClick={() => navigate(-1)} className="flex-1 md:flex-none justify-center px-6 py-3 bg-white dark:bg-[#111111] border border-[#EBE6E0] dark:border-white/10 rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D] dark:text-white hover:bg-[#FBF9F6] dark:hover:bg-white/5 shadow-sm transition-colors">Cancel</button>
            <button onClick={handleSaveOrder} disabled={isSaving} className="flex-1 md:flex-none justify-center px-6 py-3 bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] rounded-[1.5rem] text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_10px_20px_-10px_rgba(15,14,13,0.4)] dark:shadow-[0_10px_20px_-10px_rgba(255,255,255,0.4)] disabled:opacity-70 transition-colors">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} strokeWidth={3} /> Save Changes</>}
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
                  <input type="text" value={orderId} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl outline-none text-sm font-bold cursor-not-allowed" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3"><Calendar size={16} /> Date Created</label>
                  <input type="text" value={orderDate} readOnly className="w-full bg-[#FBF9F6] dark:bg-white/5 text-[#0F0E0D]/60 dark:text-white/60 px-5 py-4 rounded-2xl outline-none text-sm font-bold cursor-not-allowed" />
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
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 mb-3">Street Address / Full Shipping Info</label>
                  <input type="text" name="address" value={customer.address} onChange={handleCustomerChange} placeholder="123 Fashion Avenue, Apt 4B" className="w-full bg-[#FBF9F6] dark:bg-white/5 px-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
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
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#0F0E0D]/40 dark:text-white/40">LKR</span>
                    <input type="number" min="0" step="0.01" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-full bg-[#FBF9F6] dark:bg-white/5 pl-14 pr-5 py-4 rounded-2xl outline-none text-sm font-bold text-[#0F0E0D] dark:text-white focus:bg-white dark:focus:bg-[#1A1A1A]" />
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
                    <option value="SHIPPED" className="dark:bg-[#111111]">Shipped</option>
                    <option value="DELIVERED" className="dark:bg-[#111111]">Delivered</option>
                    <option value="CANCELLED" className="dark:bg-[#111111]">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Ordered Items Summary */}
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#111111] p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-[#EBE6E0] dark:border-white/10 transition-colors">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F0E0D] dark:text-white tracking-tight flex items-center gap-3"><ShoppingCart size={24} /> Ordered Items</h2>
                <span className="bg-[#0F0E0D] dark:bg-white text-[#FBF9F6] dark:text-[#0F0E0D] text-xs font-bold px-3 py-1.5 rounded-full">{orderItems.length}</span>
              </div>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                {orderItems.length === 0 ? (
                  <div className="text-center py-10 text-[#0F0E0D]/40 dark:text-white/40 font-bold text-sm border-2 border-dashed border-[#EBE6E0] dark:border-white/10 rounded-2xl">
                    No items listed for this order.
                  </div>
                ) : (
                  orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-2xl border border-[#EBE6E0] dark:border-white/10 bg-[#FBF9F6] dark:bg-white/5 transition-colors">
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-extrabold text-[#0F0E0D] dark:text-white leading-tight">{item.name || 'Product Item'}</h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D]/60 dark:text-white/60">Size: {item.size || 'N/A'}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F0E0D]/60 dark:text-white/60">Qty: {item.qty || item.quantity || 1}</span>
                        </div>
                        <p className="text-sm font-extrabold text-[#0F0E0D] dark:text-white mt-1.5">
                          LKR {((item.price || item.unit_price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-[#EBE6E0] dark:border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 text-[10px]">Subtotal</span>
                  <span className="font-bold text-[#0F0E0D] dark:text-white">LKR {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold uppercase tracking-widest text-[#0F0E0D]/60 dark:text-white/60 text-[10px]">Delivery Fee</span>
                  <span className="font-bold text-[#0F0E0D] dark:text-white">LKR {parsedDeliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-[#EBE6E0] dark:border-white/10">
                  <span className="font-extrabold uppercase tracking-widest text-[#0F0E0D] dark:text-white text-xs">Total Amount</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0F0E0D] dark:text-white tracking-tight">LKR {finalTotal.toFixed(2)}</span>
                </div>
              </div>
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
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} strokeWidth={3} /> Save Changes</>}
          </motion.button>
        </motion.div>

      </motion.div>
    </>
  );
}