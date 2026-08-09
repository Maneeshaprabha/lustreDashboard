import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const location = useLocation();
  
  // This checks the URL to update the Navbar title and Sidebar active button
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/add-product':
        return { active: 'Product', title: 'Add New Product' };
      case '/products':
        return { active: 'Products', title: 'Product List' };
      case '/analytics':
        return { active: 'Analytics', title: 'Analytics' };
      case '/overview':
        return { active: 'Overview', title: 'Dashboard Overview' };
      case '/sales':
        return { active: 'Sales', title: 'Sales Overview' };
      case '/store':
        return { active: 'Store', title: 'Storefront' };
      case '/contact':
        return { active: 'Contact', title: 'Contact' };
      default:
        return { active: 'Overview', title: 'Dashboard Overview' };
    }
  };

  const { active, title } = getPageInfo();

  return (
    <div className="flex h-screen bg-[#E9E3DB]/20 text-[#1A1A1A] font-sans antialiased overflow-hidden">
      <Sidebar activePage={active} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <Navbar title={title} />
        
        {/* The <Outlet /> is where your specific page content (Overview, AddProduct) will render */}
        <Outlet />
      </main>
    </div>
  );
}