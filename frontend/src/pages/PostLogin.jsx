import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogOut, Mail, UserCog } from "lucide-react"; // ✅ Corrected Mail Icon Import

const PostLogin = () => {
  const [user, setUser] = useState(null);
  const [cctvLocations, setCctvLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchCCTVLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cctv/locations");
        setCctvLocations(response.data);
      } catch (error) {
        console.error("Error fetching CCTV locations:", error);
      }
    };

    fetchUserProfile();
    fetchCCTVLocations();
  }, []);

  const handleCameraSelect = (source) => {
    navigate(`/dashboard?source=${encodeURIComponent(source)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!", { position: "top-center" });
    setTimeout(() => {
      window.location.href = "/login"; 
    }, 700);
  };

  const dummyLocations = ["City Square", "Central Park", "Mall Entrance", "Train Station", "Airport Terminal",
                          "Shopping Plaza", "Tech Hub", "Highway Intersection", "Metro Exit", "Police Checkpost",
                          "University Campus", "City Hall", "Stadium Entry", "Hospital Entrance"];

  const allLocations = ["Webcam", ...dummyLocations]; 

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* ✅ Sidebar */}
      <aside className="w-72 bg-gray-800 p-6 h-screen flex flex-col justify-between fixed left-0 top-0">
        {user && (
          <div className="text-center">
            <i className="fa-solid fa-user-circle text-gray-400 text-6xl mb-5"></i>
            <p className="text-lg text-gray-300 flex items-center justify-center font-medium">
              <Mail size={24} className="text-green-400 mr-2" /> {user.email} {/* ✅ Fixed Mail Icon */}
            </p>
            <p className="text-md text-gray-300 flex items-center justify-center mt-2 font-medium">
              <UserCog size={18} className="text-green-400 mr-2" /> Role: {user.role || "User"}
            </p>
          </div>
        )}
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 w-full flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* ✅ Main Content */}
      <main className="ml-72 flex-1 p-6">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Welcome to CrowdIntel</h2>
        <h3 className="text-xl font-semibold text-white mb-6">CCTV Locations</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 max-w-7xl mx-auto text-center mt-6">
          {allLocations.map((location, index) => (
            <div 
              key={index} 
              className="p-5 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition w-44 h-28 flex flex-col justify-center"
              onClick={() => handleCameraSelect(location)}
            >
              <h3 className="text-md font-semibold">{location}</h3> {/* ✅ Removed all icons */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PostLogin;
