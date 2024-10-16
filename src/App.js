import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SignIn from './components/SignIn';
import Deliveries from './components/Deliveries';
import StoreDetail from './components/StoreDetail';
import MyStore from './components/MyStore';
import Home from './components/Home';
import Stores from './components/Stores';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Payment from './components/Payment';
import OrderHistory from './components/OrderHistory';
import Reports from './components/Report';
import { getCartFromLocalStorage } from './utils/localStorage';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [count, setCount] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Function to handle sidebar toggle
    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Function to update cart count from local storage
    const handleCartCount = () => {
        const cart = getCartFromLocalStorage();
        setCount(cart?.length || 0);
    };

    // Function to toggle the theme and store preference
    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light'); // Save theme in local storage
            return newTheme;
        });
    };

    // Effect to load the theme from local storage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
    }, []);

    // Effect to change body background color based on theme
    useEffect(() => {
        document.body.style.backgroundColor = isDarkMode ? '#181818' : 'inherit'; // Dark mode: #181818, Light mode: #ffffff
    }, [isDarkMode]); // Run this effect when isDarkMode changes

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <AuthProvider>
                <Router>
                    <Header onMenuClick={handleMenuClick} cart={cart} setCart={setCart} cartCount={count} isDarkMode={isDarkMode}/>
                    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/stores" element={<Stores />} />
                        <Route path="/" element={<Stores />} />
                        <Route path="/stores/:storeId" element={<StoreDetail setCount={setCount} cart={cart} handleCartCount={handleCartCount} />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        {/* Protected Routes based on scope */}
                        <Route path="/mystore" element={<MyStore />} />
                        <Route path="/mystore/:storeId" element={<MyStore />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route
                            path="/deliveries"
                            element={
                                <ProtectedRoute allowedScopes={['delivery_partner']}>
                                    <Deliveries />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/payment" element={<Payment />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;

