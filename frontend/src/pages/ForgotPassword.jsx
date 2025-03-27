import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email!", { position: "top-center" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Forgot Password?</h2>
        <p className="text-center text-gray-400">Enter your email to receive a reset link.</p>

        <form onSubmit={handleForgotPassword} className="mt-6">
          <input   
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:border-white"
          />

          <button type="submit" className="w-full mt-4 bg-blue-500 p-3 rounded text-white font-semibold hover:bg-blue-600 transition">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
