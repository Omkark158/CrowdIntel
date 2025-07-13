import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success("OTP Sent! Check your email.", { position: "top-center" });
      setOtp(""); // Reset OTP before switching to OTP mode
      setOtpMode(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.", { position: "top-center" });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email: formData.email, otp });
      toast.success("OTP Verified! Redirecting...", { position: "top-center" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Invalid or expired OTP.", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">{otpMode ? "Verify OTP" : "Sign Up"}</h2>
        
        <form onSubmit={otpMode ? handleVerifyOTP : handleSignup}>
          {!otpMode ? (
            <>
              <input name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} autoComplete="off" className="w-full bg-gray-700 text-white p-3 rounded mb-4" required />
              <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} autoComplete="off" className="w-full bg-gray-700 text-white p-3 rounded mb-4" required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} autoComplete="off" className="w-full bg-gray-700 text-white p-3 rounded mb-4" required />
              <button type="submit" className="w-full bg-green-500 py-3 rounded-lg text-lg hover:bg-green-600 transition">Get OTP</button>
            </>
          ) : (
            <>
              <input name="otp" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} autoComplete="off" className="w-full bg-gray-700 text-white p-3 rounded mb-4" required />
              <button type="submit" className="w-full bg-blue-500 py-3 rounded-lg text-lg hover:bg-blue-600 transition">Verify OTP</button>
            </>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="text-lg font-semibold">
            Already have an account?  
            <span 
              onClick={() => navigate("/login")} 
              className="text-blue-400 hover:text-blue-500 cursor-pointer transition duration-300">
              {" "}Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
