import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import AddProduct from './pages/AddProduct';
import ProductsList from './pages/ProductsList';
import Analytics from './pages/Analytics';
import Sales from './pages/Sales';
import Contact from './pages/Contact';
import OrdersList from './pages/OrdersList';
import AddOrder from './pages/AddOrder';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route pushes straight into the dashboard */}
        <Route path="/" element={<Navigate to="/overview" replace />} />
        
        {/* Dashboard wrapper handles all layout logic */}
        <Route element={<DashboardLayout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/add-order" element={<AddOrder />} />
        </Route>
        
        {/* Storefront pages */}
        <Route path="/contact" element={<Contact />} />
        
        {/* Safety catch-all */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </Router>
  );
}