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
      case "/overview":
      default:             return { active: "Overview", title: "Dashboard Overview" };
    }
  };

  const { active, title } = getPageInfo();

  return (
    // Locked viewport wrapper
    <div className="flex h-screen w-screen bg-[#E9E3DB]/20 text-[#1A1A1A] font-sans antialiased overflow-hidden">
      
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