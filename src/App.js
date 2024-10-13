import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route,Switch } from 'react-router-dom';
import theme from './theme';
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
import { getCartFromLocalStorage } from './utils/localStorage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cart, setCart] = useState([]);
	    const [count, setCount] = useState(0);
    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
     const handleCartCount = () => {
        const cart = getCartFromLocalStorage();
      setCount(cart?.length || 0)
    };
    

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <Header onMenuClick={handleMenuClick} cart={cart} setCart={setCart} cartCount={count}/>
                    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/stores" element={<Stores />} />
                        <Route path="/stores/:storeId" element={<StoreDetail setCount={setCount}/>} />
 			<Route path="/cart" element={<Cart />} />
                        {/* Protected Routes based on scope */}
                      <Route path="/stores/:storeId" element={<StoreDetail cart={cart} handleCartCount={handleCartCount} />} />

                        <Route path="/mystore" element={<MyStore /> }/>
                        <Route path="/mystore/:storeId" element={<MyStore /> }/>
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
