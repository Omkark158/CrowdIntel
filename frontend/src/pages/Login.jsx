import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      console.log("API Response:", response.data); // Debugging API response
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify({ 
        email: response.data.user.email,  // Fix here!
        role: response.data.user.role || "User" // Ensure role exists
      }));
  
      console.log("Stored user:", JSON.parse(localStorage.getItem("user"))); // Debugging localStorage
  
      toast.success("Login successful!", { position: "top-center" });
      navigate("/post-login");
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Login failed.", { position: "top-center" });
    }
  };
  
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white">Log in</h2>

        <form onSubmit={handleLogin} className="mt-6">
          <div>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
              className="w-full p-3 rounded mt-1 bg-gray-700 text-white focus:border-white"
              autoComplete="off"
            />
          </div>

          <div className="mt-4">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              className="w-full p-3 rounded mt-1 bg-gray-700 text-white focus:border-white"
            />
          </div>

          <button type="submit" className="w-full mt-6 bg-green-500 p-3 rounded text-white font-semibold hover:bg-green-600 transition">
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <p className="mt-4 text-center text-lg font-semibold">
        <a href="/forgot-password" className="text-blue-400 hover:underline">Forgot Password?</a>
        </p>

        <p className="mt-2 text-center text-lg font-semibold"> Don't have an account? 
        <a href="/signup" className="text-blue-400 hover:underline"> Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
