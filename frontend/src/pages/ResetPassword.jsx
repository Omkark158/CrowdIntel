import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const extractedToken ="pkrokfoefoeofkdof";
  
    console.log("🔍 Extracted Token from URL:", extractedToken); 
  
    if (!extractedToken) {
      toast.error("Invalid or missing token!");
      navigate("/login");
    } else {
      setToken(extractedToken.trim()); 
    }
  }, [location, navigate]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      console.log("✅ Sending Token to Backend:", token);
      console.log("✅ Sending New Password:", newPassword);

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { token, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("❌ Error from Backend:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white">Reset Password</h2>

        <div className="mt-6">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded mt-1 bg-gray-700 text-white focus:border-white"
            autoComplete="new-password"
          />
        </div>

        <div className="mt-4">
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded mt-1 bg-gray-700 text-white focus:border-white"
            autoComplete="new-password"
          />
        </div>

        <button 
          onClick={handleResetPassword} 
          className="w-full mt-6 bg-green-500 p-3 rounded text-white font-semibold hover:bg-green-600 transition">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
