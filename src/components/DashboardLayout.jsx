import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/add-product": return { active: "Product", title: "Add New Product" };
      case "/products":    return { active: "Product", title: "Product Inventory" };
      case "/categories":  return { active: "Categories", title: "Product Categories" };
      case "/analytics":   return { active: "Analytics", title: "Performance Analytics" };
      case "/sales":       return { active: "Sales", title: "Sales & Transactions" };
      case "/expenses":    return { active: "Expenses", title: "Extra Bills & Expenses" };
      case "/orders":      return { active: "Orders", title: "Order Management" };
      case "/add-order":   return { active: "Orders", title: "Add New Order" };
      case "/settings":    return { active: "Setting", title: "Global Settings" };
      case "/overview":
      default:             return { active: "Overview", title: "Dashboard Overview" };
    }
  };

  const { active, title } = getPageInfo();

  return (
    <div className="flex h-screen w-screen bg-[#FBF9F6] dark:bg-[#0A0A0A] text-[#0F0E0D] dark:text-white font-sans antialiased overflow-hidden transition-colors duration-300">
      
      {/* Dark Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar now receives the mobile toggle state */}
      <Sidebar 
        activePage={active} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main column */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Navbar now has a hamburger menu button */}
        <Navbar 
          title={title} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto w-full relative scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
        
      </main>
    </div>
  );
}