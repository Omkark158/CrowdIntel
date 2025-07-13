const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
let token34=undefined;

dotenv.config();

// Load Email Templates
const loadEmailTemplate = (filename, fallback) => {
  const filePath = path.join(__dirname, `../templates/${filename}`);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : fallback;
};

const otpEmailTemplate = loadEmailTemplate("otpEmailTemplate.html", "{{OTP}}");
const resetEmailTemplate = loadEmailTemplate("resetPasswordTemplate.html", "{{RESET_LINK}}");

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Function to send emails
const sendEmail = async (email, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Register User & Send OTP
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    user = new User({ name, email, password: hashedPassword, otp });

    await user.save();

    console.log(`OTP for ${email}: ${otp}`);

    // Send OTP email
    const emailContent = otpEmailTemplate.replace("{{OTP}}", otp);
    await sendEmail(email, "Your OTP for Verification", emailContent);

    res.status(201).json({ message: "User registered. OTP sent to email.", email });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// OTP Verification
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = null;
    await user.save();

    res.json({ message: "OTP verified successfully", email });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password - Send Reset Link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate Reset Token
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    console.log("✅ Generated Reset Token:", resetToken);
    token34=resetToken;
    

    // Generate Reset Link with the Actual Token
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log("✅ Reset Link:", resetLink);  // Debug

    // Ensure the email template correctly includes the link
    const emailContent = resetEmailTemplate.replace("{{RESET_LINK}}", resetLink);
    await sendEmail(email, "Password Reset Link", emailContent);

    res.json({ message: "Password reset link sent to email", email });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Reset Password using Token
const resetPassword = async (req, res) => {
  try {
    console.log("✅ Received Token in Backend:", JSON.stringify(req.body.token)); // Debug

    const { token, newPassword } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: "Token not received" });
    }

    // Decode Token First (Without Verification)
    const decoded = token34;
    console.log("🔍 Decoded Token Before Verification:", token34);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid token format" });
    }

  
    const verified = jwt.verify(token34, process.env.JWT_SECRET);
    console.log("✅ Verified Token Payload:", verified);

    const issuedAt = new Date(verified.iat * 1000).toLocaleString();
    console.log("Token Issued At:", issuedAt);
    
    const user = await User.findOne({ email: verified.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash and Save New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("❌ Error resetting password:", error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
 


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Export controllers
module.exports = { register, verifyOTP, login, forgotPassword, resetPassword, User};
