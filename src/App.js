import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ResetPasswordPage from "./components/Auth/ResetPasswordPage";
import DashboardPage from "./components/DashboardPage";
import BookingPage from "./components/BookingPage";
import { jwtDecode } from "jwt-decode"; 

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Check expiration
    } catch {
      return false;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path="/booking"
          element={isAuthenticated() ? <BookingPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect any unknown paths to login */}
      </Routes>
    </Router>
  );
}

export default App;