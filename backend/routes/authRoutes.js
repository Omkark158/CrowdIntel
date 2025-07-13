const express = require("express");
const {
  register,
  verifyOTP,
  login,
  resetPassword,
  forgotPassword, 
  User
} = require("../controllers/authController");

const router = express.Router();

// Register Route (Signup + OTP Sent)
router.post("/register", register);

// Verify OTP Route
router.post("/verify-otp", verifyOTP);

// Login Route
router.post("/login", login);

// Reset Password Route
router.post("/reset-password", resetPassword);

// Forgot Password Route 
router.post("/forgot-password", forgotPassword);

router.get("/profile", User);

module.exports = router;
