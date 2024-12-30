import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import OrderSuccess from "./components/CustomerPage/OrderSuccess";
import About from "./components/About";
import ProfilePage from "./components/Profile";
import TC from "./components/TC";
import BottomNav from "./components/BottomNav";
import SignIn from "./components/SignIn";
import Deliveries from "./components/DriverPage/Deliveries";
import StoreDetail from "./components/CustomerPage/StoreDetail";
import MyStore from "./components/OwnerPage/MyStore";
import Stores from "./components/CustomerPage/Stores";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./components/CustomerPage/Cart";
import Payment from "./components/CustomerPage/Payment";
import OrderHistory from "./components/CustomerPage/OrderHistory";
import Reports from "./components/OwnerPage/Report";
import {
  getCartFromLocalStorage,
  isValidCustomerDetails
} from "./utils/localStorage";
import { decodeToken } from "./utils/auth";
import { api } from "./utils/api";
import { lightTheme, darkTheme } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import MS from "./components/MS/managementSystem";
import BulkMenu from "./components/MS/Components/BulkMenu";
import Account from "./components/Account";
import CircularLoader from "./loader/loader"; // Import the new CircularLoader

// Import ToastContainer and toast from react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignDriver from "./components/assignDriver";
import PorterAssignments from "./components/DriverPage/PorterAssignments";
import { requestFCMToken } from "./utils/firebaseUtils.js";

const AppContent = ({
  handleMenuClick,
  sidebarOpen,
  setSidebarOpen,
  toggleTheme,
  isDarkMode,
  cart,
  setCart,
  count,
  setCount,
  handleCartCount,
  loading
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBottomNav = ["/", "/stores"].includes(location.pathname);
  const navBar = [
    "/signin",
    "/ms",
    "/tc",
    "/deliveries",
    "/mystore",
    "/about",
    "/profile"
  ].some((item) => location.pathname.includes(item));

  // Ensure valid customer details on first render
  const userScope = decodeToken().scope;
  useEffect(() => {
    if (!userScope) {
      navigate("/signin");
    } else if (!isValidCustomerDetails()) {
      navigate("/profile");
    }
  }, [navigate]);

  const showHeader =
    !location.pathname.startsWith("/stores/") &&
    !location.pathname.startsWith("/mystore");

  const customerRoutes = [
    "/assign-driver",
    "/signin",
    "/stores",
    "/about",
    "/profile",
    "/stores/:storeId",
    "/cart",
    "/orders",
    "/ordersuccess/:orderid",
    "/tc",
    "/account",
    "/ordersuccess/:orderid",
    "/payment"
  ];

  const ownerRoutes = [
    "/assign-driver",
    "/bulkmenu",
    "/signin",
    "/mystore",
    "/mystore/:storeId",
    "/reports",
    "/stores",
    "/tc",
    "/profile",
    "/stores/:storeId",
    "/stores"
  ];

  const deliveryPartnerRoutes = [
    "/signin",
    "/deliveries",
    "/orders",
    "/tc",
    "/profile",
    "/porter-assignments"
  ];

  const godRoutes = [
    "/assign-driver",
    "/ms",
    "/tc",
    ...customerRoutes,
    ...ownerRoutes,
    ...deliveryPartnerRoutes,
    "/reports"
  ];

  const isRouteAllowed = (routeList) => {
    return routeList.some((route) => location.pathname.startsWith(route));
  };

  if (userScope === "customer" && !isRouteAllowed(customerRoutes)) {
    return <Navigate to="/signin" />;
  }
  if (userScope === "owner" && !isRouteAllowed(ownerRoutes)) {
    return <Navigate to="/signin" />;
  }
  if (
    userScope === "deliveryPartner" &&
    !isRouteAllowed(deliveryPartnerRoutes)
  ) {
    return <Navigate to="/signin" />;
  }
  if (userScope === "god" && !isRouteAllowed(godRoutes)) {
    return <Navigate to="/signin" />;
  }

  return (
    <>
      {showHeader && (
        <Header
          onMenuClick={handleMenuClick}
          cart={cart}
          setCart={setCart}
          cartCount={count}
          isDarkMode={isDarkMode}
        />
      )}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />

      {/* Show the CircularLoader when the `loading` state is true */}
      {loading && <CircularLoader />}

      <Routes>
        {/* Public Routes */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Navigate to="/stores" />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/about" element={<About />} />
        <Route path="/tc" element={<TC />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/stores/:storeId"
          element={
            <StoreDetail
              setCount={setCount}
              cart={cart}
              handleCartCount={handleCartCount}
            />
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/ordersuccess/:orderid" element={<OrderSuccess />} />

        {/* Protected Routes based on scope */}
        <Route
          path="/mystore"
          element={<MyStore onMenuClick={handleMenuClick} />}
        />
        <Route
          path="/mystore/:storeId"
          element={<MyStore onMenuClick={handleMenuClick} />}
        />
        <Route path="/reports" element={<Reports />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/account"
          element={
            <Account toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          }
        />
        <Route path="/ms" element={<MS />} />
        <Route path="/bulkmenu" element={<BulkMenu />} />
        <Route path="/assign-driver" element={<AssignDriver />} />
        <Route path="/porter-assignments" element={<PorterAssignments />} />
      </Routes>

      {showBottomNav && <BottomNav />}
      {!navBar && <NavBar />}
      <Box sx={{ height: "70px" }} />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
      />
    </>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const [loading, setLoading] = useState(false);

  const [isHealthReady, SetIsHealthReady] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await requestFCMToken();
        setFcmToken(token);
        localStorage.setItem("fcmToken", token);
     //   alert("token", token); //TODO
      } catch (err) {}
    };
    !localStorage.getItem("fcmToken") && fetchToken();
  }, []);
  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCartCount = () => {
    const cart = getCartFromLocalStorage();
    setCount(cart?.length || 0);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#181818" : "#ffffff";
  }, [isDarkMode]);

  useEffect(() => {
    const handleRequestStart = () => setLoading(true);
    const handleRequestEnd = () => setLoading(false);
    const handleRequestError = (response) => {
      console.log("res", response);
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    };

    const handleResponseSuccess = (response) => {
      if (response.data?.message) {
        toast.success(response.data.message);
      }
      setLoading(false);
      return response;
    };

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

    api.interceptors.response.use(handleResponseSuccess, (error) => {
      handleRequestError();
      return Promise.reject(error);
    });

    return () => {
      api.interceptors.request.eject(handleRequestStart);
      api.interceptors.response.eject(handleResponseSuccess);
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
            loading={loading}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
