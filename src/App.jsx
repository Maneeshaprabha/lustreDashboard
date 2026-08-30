import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/DashboardLayout';
import Auth from './pages/Auth'; // <--- Import the new Auth page
import Overview from './pages/Overview';
import AddProduct from './pages/AddProduct';
import ProductsList from './pages/ProductsList';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Contact from './pages/Contact';
import OrdersList from './pages/OrdersList';
import AddOrder from './pages/AddOrder';
import Settings from './pages/Settings';
import EditProduct from './pages/EditProduct';
import EditOrder from './pages/EditOrder';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Default route pushes to the Auth/Login page */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Standalone Authentication Route */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Dashboard wrapper handles all layout logic (Sidebar/Navbar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/add-order" element={<AddOrder />} />
            <Route path="/edit-order/:id" element={<EditOrder />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Safety catch-all */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}