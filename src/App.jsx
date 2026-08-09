import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import AddProduct from './pages/AddProduct';
import Hero from './pages/Hero';
import Contact from './pages/Contact';
import ProductsList from './pages/ProductsList';
import Analytics from './pages/Analytics';
import Sales from './pages/Sales';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        
        {/* Dashboard Routes wrapped in the Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sales" element={<Sales />} />
        </Route>
        
        {/* Storefront Routes (These don't use the admin dashboard layout) */}
        {/* <Route path="/store" element={<Hero />} /> */}
        <Route path="/contact" element={<Contact />} />
        
        <Route path="*" element={<Navigate to="/store" replace />} />
      </Routes>
    </Router>
  );
}