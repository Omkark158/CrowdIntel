import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, User } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostLogin = () => {
  const [user, setUser] = useState({ email: "Loading...", role: "User" });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("Fetched from localStorage:", userData); // Debugging localStorage
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  

  const handleCameraSelect = (source) => {
    navigate(`/dashboard?source=${encodeURIComponent(source)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { position: "top-center" });
    setTimeout(() => navigate("/login"), 700);
  };

  const locations = [
    "Webcam", "City Square", "Central Park", "Mall Entrance", "Train Station",
    "Airport Terminal", "Shopping Plaza", "Tech Hub", "Highway Intersection",
    "Metro Exit", "Police Checkpost", "University Campus", "City Hall",
    "Stadium Entry", "Hospital Entrance"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}

      <aside className="w-72 bg-gray-800 p-6 h-screen flex flex-col justify-between fixed left-0 top-0">
        {/* User Profile */}

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
            <User size={40} className="text-gray-300" />
          </div>
          <p className="text-md text-gray-300 flex items-center font-semibold">
            <Mail size={18} className="text-green-400 mr-2" /> {user.email}
          </p>
          <p className="text-md text-gray-300 flex items-center mt-2 font-semibold">
            <User size={18} className="text-green-400 mr-2" /> Role: {user.role}
          </p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 w-full flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-6">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Welcome to CrowdIntel</h2>
        <h3 className="text-xl font-semibold text-white mb-6">CCTV Locations</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 max-w-7xl mx-auto text-center mt-6">
          {locations.map((location, index) => (
            <div 
              key={index} 
              className="p-5 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition w-44 h-28 flex flex-col justify-center"
              onClick={() => handleCameraSelect(location)}
            >
              <h3 className="text-md font-semibold">{location}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PostLogin;
