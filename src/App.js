import React from "react";
import { Provider } from 'react-redux';
import store from './store'; // Import the store
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar"; 
import Footer from "./components/common/Footer"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartupDashboard from "./pages/StartupDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Startups from "./pages/Startups";
import Investors from "./pages/Investors";
import authService from './services/authService';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './utils/ThemeContext';

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
          <Routes>
            <Route path="/" element={<Home />} /> {/*src\pages\Home.js */}
            <Route path="/login" element={<Login />} /> {/*src\pages\Login.js */}
            <Route path="/register" element={<Register />} /> {/*src\pages\Register.js */}
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
          <Footer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
