import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/add-product": return { active: "Product", title: "Add New Product" };
      case "/products":    return { active: "Product", title: "Product Inventory" };
      case "/analytics":   return { active: "Analytics", title: "Performance Analytics" };
      case "/sales":       return { active: "Sales", title: "Sales & Transactions" };
      case "/orders":      return { active: "Orders", title: "Order Management" };
      case "/add-order":   return { active: "Orders", title: "Add New Order" };
      case "/expenses":    return { active: "Expenses", title: "Extra Bills & Expenses" };
      case "/categories":  return { active: "Categories", title: "Product Categories" };
      case "/settings":    return { active: "Setting", title: "Global Settings" };
      case "/overview":
      default:             return { active: "Overview", title: "Dashboard Overview" };
    }
  };

  const { active, title } = getPageInfo();

  return (
    // Updated with dark mode classes for the root layout container
    <div className="flex h-screen w-screen bg-[#FBF9F6] dark:bg-[#0A0A0A] text-[#0F0E0D] dark:text-white font-sans antialiased overflow-hidden transition-colors duration-300">
      
      <Sidebar activePage={active} />

      {/* Main column */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        <Navbar title={title} />

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