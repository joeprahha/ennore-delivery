import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OrderSuccess from './components/CustomerPage/OrderSuccess';
import About from './components/About';
import ProfilePage from './components/Profile';
import BottomNav from './components/BottomNav';
import SignIn from './components/SignIn';
import Deliveries from './components/Deliveries';
import StoreDetail from './components/CustomerPage/StoreDetail';
import MyStore from './components/OwnerPage/MyStore';
import Stores from './components/CustomerPage/Stores';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/CustomerPage/Cart';
import Payment from './components/Payment';
import OrderHistory from './components/CustomerPage/OrderHistory';
import Reports from './components/OwnerPage/Report';
import { getCartFromLocalStorage } from './utils/localStorage';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar'; // Import the new BottomNav component


import Account from './components/Account'; // Import the new BottomNav component

const AppContent = ({ handleMenuClick, sidebarOpen, setSidebarOpen, toggleTheme, isDarkMode, cart, setCart, count, setCount, handleCartCount }) => {
    const location = useLocation();
    const showBottomNav = ['/', '/stores'].includes(location.pathname);
    const showHeader = !location.pathname.startsWith('/stores/');

    return (
        <>
            {showHeader && <Header onMenuClick={handleMenuClick} cart={cart} setCart={setCart} cartCount={count} isDarkMode={isDarkMode} />}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            <Routes>
                {/* Public Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/" element={<Navigate to="/stores" />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<About />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/stores/:storeId" element={<StoreDetail setCount={setCount} cart={cart} handleCartCount={handleCartCount} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orderSuccess/:orderid" element={<OrderSuccess/>} />
                
                {/* Protected Routes based on scope */}
                <Route path="/mystore" element={<MyStore />} />
                <Route path="/mystore/:storeId" element={<MyStore />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/deliveries" element={
                    <ProtectedRoute allowedScopes={['delivery_partner']}>
                        <Deliveries />
                    </ProtectedRoute>
                } />
                <Route path="/payment" element={<Payment />} />
                                <Route path="/account" element={<Account toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
            </Routes>
		
            {showBottomNav && <BottomNav />}
            <NavBar />
        </>
    );
};

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [count, setCount] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // Function to handle sidebar toggle
    const handleMenuClick = () => {
        setSidebarOpen(prev => !prev);
    };

    // Function to update cart count from local storage
    const handleCartCount = () => {
        const cart = getCartFromLocalStorage();
        setCount(cart?.length || 0);
    };

    // Function to toggle the theme and store preference
    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    // Effect to change body background color based on theme
    useEffect(() => {
        document.body.style.backgroundColor = isDarkMode ? '#181818' : '#ffffff';
    }, [isDarkMode]);

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <AuthProvider>
                <Router>
                    <AppContent 
                        handleMenuClick={handleMenuClick} 
                        sidebarOpen={sidebarOpen} 
                        setSidebarOpen={setSidebarOpen} 
                        toggleTheme={toggleTheme} 
                        isDarkMode={isDarkMode} 
                        cart={cart} 
                        setCart={setCart} 
                        count={count} 
                        setCount={setCount} 
                        handleCartCount={handleCartCount} 
                    />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;

