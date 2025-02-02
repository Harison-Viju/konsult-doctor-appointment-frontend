import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/send-otp", { email });
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reset-password", {
        email,
        otp,
        newPassword: "" // Temporary empty password for OTP verification only
      });
      setStep(3);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/reset-password", {
        email,
        otp,
        newPassword
      });
      setSuccess("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={
        step === 1 ? handleSendOTP :
        step === 2 ? handleVerifyOTP :
        handlePasswordUpdate
      } className="auth-form">
        <h2>Reset Password</h2>
        
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Update Password</button>
          </>
        )}

        <p onClick={() => navigate("/login")} className="link">
          Back to Login
        </p>
      </form>
    </div>
  );
}

export default ResetPasswordPage;