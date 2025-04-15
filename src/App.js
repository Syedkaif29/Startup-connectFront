import React, { Suspense, lazy } from "react";
import { Provider } from 'react-redux';
import store from './store'; // Import the store
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar"; 
import Footer from "./components/common/Footer"; 
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './utils/ThemeContext';
import { CircularProgress, Box } from '@mui/material';
import authService from './services/authService';

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const RegisterAdmin = lazy(() => import("./pages/RegisterAdmin"));
const StartupDashboard = lazy(() => import("./pages/StartupDashboard"));
const InvestorDashboard = lazy(() => import("./pages/InvestorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Startups = lazy(() => import("./pages/Startups"));
const Investors = lazy(() => import("./pages/Investors"));

// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.user.role)) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} /> {/*src\pages\Home.js */}
              <Route path="/login" element={<Login />} /> {/*src\pages\Login.js */}
              <Route path="/register" element={<Register />} /> {/*src\pages\Register.js */}
              <Route path="/register-admin" element={<RegisterAdmin />} />
              <Route path="/startups" element={<Startups />} />
              <Route
                path="/investors"
                element={
                  <ProtectedRoute>
                    <Investors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/startup-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STARTUP']}>
                    <StartupDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['INVESTOR']}>
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
          <Footer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
