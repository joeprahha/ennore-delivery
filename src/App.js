import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OrderSuccess from './components/CustomerPage/OrderSuccess';
import About from './components/About';
import ProfilePage from './components/Profile';
import TC from './components/TC';
import BottomNav from './components/BottomNav';
import SignIn from './components/SignIn';
import Deliveries from './components/DriverPage/Deliveries';
import StoreDetail from './components/CustomerPage/StoreDetail';
import MyStore from './components/OwnerPage/MyStore';
import Stores from './components/CustomerPage/Stores';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/CustomerPage/Cart';
import Payment from './components/Payment';
import OrderHistory from './components/CustomerPage/OrderHistory';
import Reports from './components/OwnerPage/Report';
import { getCartFromLocalStorage } from './utils/localStorage';
import { decodeToken } from './utils/auth';
import { api } from './utils/api';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import MS from './components/MS/managementSystem'; 
import Account from './components/Account'; 

import CircularLoader from './loader/loader';  // Import the new CircularLoader

const AppContent = ({ handleMenuClick, sidebarOpen, setSidebarOpen, toggleTheme, isDarkMode, cart, setCart, count, setCount, handleCartCount, loading }) => {
    const location = useLocation();
    const showBottomNav = ['/', '/stores'].includes(location.pathname);
    const navBar = ['/signin', '/ms', '/tc', '/deliveries', '/mystore']
  .some(item => location.pathname.includes(item));


    const showHeader = !location.pathname.startsWith('/stores/');
    const userScope = decodeToken().scope || 'customer'; 

    const customerRoutes = [
        "/signin", "/stores", "/about", "/profile", "/stores/:storeId",
        "/cart", "/orders", "/orderSuccess/:orderid", "/tc", '/account',"/orderSuccess/:orderid"
    ];

    const ownerRoutes = [
        "/signin", "/mystore", "/mystore/:storeId", "/reports", '/stores', '/ms', "/tc"
    ];

    const deliveryPartnerRoutes = [
        "/signin", "/deliveries", "/orders", "/tc"
    ];
    const god = [
        "/ms", "/tc", ...customerRoutes, ...ownerRoutes, ...deliveryPartnerRoutes
    ];

    const isRouteAllowed = (routeList) => {
        return routeList.some(route => location.pathname.startsWith(route));
    };

    if (userScope === 'customer' && !isRouteAllowed(customerRoutes)) {
        return <Navigate to="/signin" />;
    }
    if (userScope === 'owner' && !isRouteAllowed(ownerRoutes)) {
        return <Navigate to="/signin" />;
    }
    if (userScope === 'deliveryPartner' && !isRouteAllowed(deliveryPartnerRoutes)) {
        return <Navigate to="/signin" />;
    }
    if (userScope === 'god' && !isRouteAllowed(god)) {
        return <Navigate to="/signin" />;
    }

    return (
        <>
            {showHeader && <Header onMenuClick={handleMenuClick} cart={cart} setCart={setCart} cartCount={count} isDarkMode={isDarkMode} />}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            
            {/* Show the CircularLoader when the `loading` state is true */}
            {loading && <CircularLoader />}

            <Routes>
                {/* Public Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/" element={<Navigate to="/stores" />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/about" element={<About />} />
                <Route path="/tc" element={<TC />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/stores/:storeId" element={<StoreDetail setCount={setCount} cart={cart} handleCartCount={handleCartCount} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orderSuccess/:orderid" element={<OrderSuccess />} />
                
                {/* Protected Routes based on scope */}
                <Route path="/mystore" element={<MyStore />} />
                <Route path="/mystore/:storeId" element={<MyStore />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/deliveries" element={<Deliveries />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/account" element={<Account toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
                <Route path="/ms" element={<MS />} />
            </Routes>
            {showBottomNav && <BottomNav />}
            {!navBar && <NavBar />}
            <Box sx={{ height: '70px' }} />
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
    const [loading, setLoading] = useState(false); // Add loading state

    const handleMenuClick = () => {
        setSidebarOpen(prev => !prev);
    };

    const handleCartCount = () => {
        const cart = getCartFromLocalStorage();
        setCount(cart?.length || 0);
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    useEffect(() => {
        document.body.style.backgroundColor = isDarkMode ? '#181818' : '#ffffff';
    }, [isDarkMode]);
  useEffect(() => {

    const fetchHealthData = async () => {
      try {
        const response = await api.get('/health');
        console.log(response.data);  // Handle response data here
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchHealthData();  // Call the async function
  }, []); // Empty dependency array ensures this effect runs only once (on mount)


    // Axios Interceptor to show loading
    useEffect(() => {
        const handleRequestStart = () => {
            setLoading(true);  // Start loading
        };

        const handleRequestEnd = () => {
            setLoading(false);  // Stop loading
        };

        const handleRequestError = () => {
            setLoading(false);  // Stop loading if request fails
        };

        // Attach interceptors to the Axios instance (assuming `api` is set up already)
        api.interceptors.request.use(
            (config) => {
                handleRequestStart();
                return config;
            },
            (error) => {
                handleRequestError();
                return Promise.reject(error);
            }
        );

        api.interceptors.response.use(
            (response) => {
                handleRequestEnd();
                return response;
            },
            (error) => {
                handleRequestError();
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(handleRequestStart);
            api.interceptors.response.eject(handleRequestEnd);
        };
    }, []);

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
                        loading={loading} // Pass loading state to AppContent
                    />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;

