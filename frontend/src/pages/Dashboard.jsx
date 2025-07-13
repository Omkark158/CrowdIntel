// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";  // ✅ Fixed missing import
// import { toast } from "react-toastify";
// import { Users, BarChart, Activity, TrafficCone, Clock, UserCheck, LogOut, RefreshCw, VideoIcon } from "lucide-react";  
// import "react-toastify/dist/ReactToastify.css";

// const Dashboard = () => {
//   const [crowdData, setCrowdData] = useState({ 
//     peopleCount: 0, 
//     density: 0, 
//     unusual: "No", 
//     peakTime: "N/A", 
//     congestionLevel: "Low" 
//   });
//   const [videoSource, setVideoSource] = useState(""); 
//   const [socket, setSocket] = useState(null); 
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const selectedSource = params.get("source");

//     if (selectedSource) {
//       if (selectedSource === "Webcam") {
//         setVideoSource("http://localhost:5001/video_feed");

//         // ✅ Start Python model when "Webcam" is selected
//         axios.post("http://localhost:5001/start")
//           .then(() => console.log("✅ Python model started"))
//           .catch((error) => console.error("❌ Error starting Python model:", error));
//       } else {
//         setVideoSource(`/cctv_feed/${selectedSource}`);
//       }

//       if (!socket) {
//         const newSocket = io("http://localhost:5000", { transports: ["websocket"] });

//         newSocket.on("connect", () => console.log("✅ WebSocket Connected"));
//         newSocket.on("update_dashboard", (data) => setCrowdData(data));
//         newSocket.on("connect_error", (err) => console.error("❌ WebSocket Connection Error:", err));
//         newSocket.on("disconnect", () => console.log("❌ WebSocket Disconnected"));

//         setSocket(newSocket);
//       }
//     }

//     return () => {
//       if (socket) {
//         socket.disconnect();
//         console.log("❌ WebSocket Connection Closed");
//         setSocket(null);
//       }
//     };
//   }, [location.search]);

//   // ✅ Stop Python model when leaving the page
//   const handleStopPythonModel = async () => {
//     try {
//       await axios.post("http://localhost:5001/stop");
//       console.log("✅ Python model and camera stopped.");
//     } catch (error) {
//       console.error("❌ Error stopping Python model:", error);
//     }
//   };
  
//   const handleNavigateToCCTV = async () => {
//     if (socket) {
//       socket.disconnect();
//       console.log("❌ WebSocket Disconnected on Navigation to CCTV Locations");
//       setSocket(null);
//     }
//     await handleStopPythonModel();
//     navigate("/post-login");
//   };
  
//   const handleLogout = async () => {
//     if (socket) {
//       socket.disconnect();
//       console.log("❌ WebSocket Disconnected on Logout");
//       setSocket(null);
//     }
//     await handleStopPythonModel();
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully!", { position: "top-center" });
//     setTimeout(() => {
//       window.location.href = "/login"; 
//     }, 700);
//   };
  
//   return (
//     <div className="min-h-screen flex bg-gray-900 text-white">
//       {/* ✅ Sidebar */}
//       <aside className="w-72 bg-gray-800 p-6 h-screen flex flex-col justify-between fixed left-0 top-0">
//         <div>
//           <h2 className="text-2xl font-bold text-green-400 mb-6">Crowd Analytics</h2> 

//           <div className="space-y-4">
//             <p className="flex items-center gap-2"><UserCheck size={18} /> <span className="font-semibold">Total People Detected:</span> {crowdData.peopleCount}</p>
//             <p className="flex items-center gap-2"><Clock size={18} /> <span className="font-semibold">Peak Crowd Time:</span> {crowdData.peakTime}</p>
//             <p className="flex items-center gap-2"><TrafficCone size={18} /> <span className="font-semibold">Congestion Level:</span> {crowdData.congestionLevel}</p>
//           </div>

//           <button 
//             className="mt-4 w-full bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
//             <RefreshCw size={18} /> Refresh Data
//           </button>
//         </div>

//         <div className="space-y-4">
//           {/* ✅ Stop Python model when navigating to CCTV Locations */}
//           <button 
//             onClick={handleNavigateToCCTV} 
//             className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 w-full flex items-center justify-center gap-2 transition-all duration-300"
//           >
//             <VideoIcon size={18} /> CCTV Locations
//           </button>

//           {/* ✅ Stop Python model when logging out */}
//           <button 
//             onClick={handleLogout} 
//             className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 w-full flex items-center justify-center gap-2">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* ✅ Main Content */}
//       <main className="ml-72 flex-1 p-6">
//         <h1 className="text-4xl font-bold text-green-400 mb-6">Live Surveillance Feed</h1> 
//         <div className="flex justify-center">
//           {videoSource ? (
//             <img src={videoSource} alt="Live Feed" className="border-4 border-green-500 rounded-lg w-[550px] h-[350px]" />
//           ) : (
//             <p className="text-gray-400">Select a camera from PostLogin.</p>
//           )}
//         </div>

//         {/* ✅ Restored Three Data Boxes */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
//             <Users size={28} className="text-green-400 mb-2" />
//             <p className="text-md font-semibold">People Count</p>
//             <p className="text-2xl font-bold">{crowdData.peopleCount}</p>
//           </div>
//           <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
//             <BarChart size={28} className="text-blue-400 mb-2" />
//             <p className="text-md font-semibold">Crowd Density</p>
//             <p className="text-2xl font-bold">{crowdData.density}%</p>
//           </div>
//           <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
//             <Activity size={28} className="text-red-400 mb-2" />
//             <p className="text-md font-semibold">Unusual Activity</p>
//             <p className="text-2xl font-bold">{crowdData.unusual}</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;








// import { useEffect, useState ,useRef } from "react";
// import { io } from "socket.io-client";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Users, BarChart, Activity, TrafficCone, Clock, UserCheck, LogOut, VideoIcon } from "lucide-react";  
// import "react-toastify/dist/ReactToastify.css";

// const Dashboard = () => {
//   const [crowdData, setCrowdData] = useState({ 
//     peopleCount: 0, 
//     density: 0, 
//     unusual: "No", 
//     peakTime: "N/A", 
//     congestionLevel: "Low" 
//   });
//   const [videoSource, setVideoSource] = useState(""); 
//   const [socket, setSocket] = useState(null); 
//   const navigate = useNavigate();
//   const location = useLocation();

//   const socketRef = useRef(null);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const selectedSource = params.get("source");
  
//     if (selectedSource) {
//       if (selectedSource === "Webcam") {
//         setVideoSource("http://localhost:5001/video_feed");
  
//         axios.post("http://localhost:5001/start")
//           .then(() => console.log("✅ Python model started"))
//           .catch((error) => console.error("❌ Error starting Python model:", error));
//       } else {
//         setVideoSource(`/cctv_feed/${selectedSource}`);
//       }
  
//       // ✅ Initialize WebSocket only once
//       if (!socketRef.current) {
//         socketRef.current = io("http://localhost:5000", { transports: ["websocket"] });
  
//         socketRef.current.on("connect", () => console.log("✅ WebSocket Connected"));
  
//         socketRef.current.on("update_dashboard", (data) => {
//           console.log("📡 Received WebSocket Data:", data);
//           setCrowdData((prev) => ({
//             peopleCount: data.people_count ?? prev.peopleCount,
//             density: data.density ?? prev.density,
//             unusual: data.unusual_movement ? "Yes" : "No",
//             peakTime: data.peak_time ?? prev.peakTime,  
//             congestionLevel: data.congestion_level ?? prev.congestionLevel,
//           }));
//         });
  
//         socketRef.current.on("connect_error", (err) => console.error("❌ WebSocket Connection Error:", err));
//         socketRef.current.on("disconnect", () => console.log("❌ WebSocket Disconnected"));
//       }
//     }
  
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         console.log("❌ WebSocket Connection Closed");
//       }
//     };
//   }, [location.search]);

//   const handleStopPythonModel = async () => {
//     try {
//       await axios.post("http://localhost:5001/stop");
//       console.log("✅ Python model and camera stopped.");
//     } catch (error) {
//       console.error("❌ Error stopping Python model:", error);
//     }
//   };
  
//   const handleNavigateToCCTV = async () => {
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//     }
//     await handleStopPythonModel();
//     navigate("/post-login");
//   };
  
//   const handleLogout = async () => {
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//     }
//     await handleStopPythonModel();
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully!", { position: "top-center" });
//     setTimeout(() => {
//       window.location.href = "/login"; 
//     }, 700);
//   };
  
//   return (
//     <div className="min-h-screen flex bg-gray-900 text-white">
//       {/* ✅ Sidebar (Crowd Analytics Updated) */}
//       <aside className="w-72 bg-gray-800 p-6 h-screen flex flex-col justify-between fixed left-0 top-0">
//         <div>
//           <h2 className="text-2xl font-bold text-green-400 mb-6">Crowd Analytics</h2> 
//           <div className="space-y-4">
//             <p className="flex items-center gap-2"><UserCheck size={18} /> <span className="font-semibold">Total People Detected:</span> {crowdData.peopleCount}</p>
//             <p className="flex items-center gap-2"><Clock size={18} /> <span className="font-semibold">Peak Crowd Time:</span> {crowdData.peakTime}</p>
//             <p className="flex items-center gap-2"><TrafficCone size={18} /> <span className="font-semibold">Congestion Level:</span> {crowdData.congestionLevel}</p>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <button onClick={handleNavigateToCCTV} className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 w-full flex items-center justify-center gap-2 transition-all duration-300">
//             <VideoIcon size={18} /> CCTV Locations
//           </button>

//           <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 w-full flex items-center justify-center gap-2">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-72 flex-1 p-6">
//         <h1 className="text-4xl font-bold text-green-400 mb-6">Live Surveillance Feed</h1> 
//         <div className="flex justify-center">
//           {videoSource ? (
//             <img src={videoSource} alt="Live Feed" className="border-4 border-green-500 rounded-lg w-[550px] h-[350px]" />
//           ) : (
//             <p className="text-gray-400">Select a camera from PostLogin.</p>
//           )}
//         </div>

//         {/* ✅ Updated Data Boxes */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
//             <Users size={28} className="text-green-400 mb-2" />
//             <p className="text-md font-semibold">People Count</p>
//             <p className="text-2xl font-bold">{crowdData.peopleCount}</p>
//           </div>
//           <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
//             <BarChart size={28} className="text-blue-400 mb-2" />
//             <p className="text-md font-semibold">Crowd Density</p>
//             <p className="text-2xl font-bold">{crowdData.density}%</p>
//           </div>
//           <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
//             <Activity size={28} className="text-red-400 mb-2" />
//             <p className="text-md font-semibold">Unusual Activity</p>
//             <p className="text-2xl font-bold">{crowdData.unusual}</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;








import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Users,
  BarChart,
  Activity,
  TrafficCone,
  Clock,
  UserCheck,
  LogOut,
  VideoIcon,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [crowdData, setCrowdData] = useState({
    peopleCount: 0,
    density: 0,
    unusual: "No",
    peakTime: "N/A",
    congestionLevel: "Low",
  });

  const [videoSource, setVideoSource] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);

 useEffect(() => {
  const params = new URLSearchParams(location.search);
  const selectedSource = params.get("source");

  if (selectedSource) {
    setVideoSource(
      selectedSource === "Webcam"
        ? "http://127.0.0.1:5000/video_feed"
        : `/cctv_feed/${selectedSource}`
    );

    if (!socketRef.current) {
      socketRef.current = io("ws://localhost:5000", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socketRef.current.on("connect", () => console.log("✅ WebSocket Connected"));

      socketRef.current.on("update_dashboard", (data) => {
        console.log("📡 Received WebSocket Data:", data);
        setCrowdData((prev) => ({
          peopleCount: data.people_count ?? prev.peopleCount,
          density: data.density ?? prev.density,
          unusual: data.unusual_movement ? "Yes" : "No",
          peakTime: data.peak_time ?? prev.peakTime,
          congestionLevel: data.congestion_level ?? prev.congestionLevel,
        }));
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ WebSocket Connection Error:", err);
        toast.error("WebSocket Connection Failed!");
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ WebSocket Disconnected");
        toast.warn("WebSocket Disconnected. Retrying...");
      });
    }
  }

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log("❌ WebSocket Connection Closed");
    }
  };
}, [location.search]);

  
  const handleStopPythonModel = async () => {
    try {
      await axios.post("http://localhost:5000/stop");
      console.log("✅ Python model and camera stopped.");
    } catch (error) {
      console.error("❌ Error stopping Python model:", error.response?.data || error.message);
      toast.error(`Failed to stop Python model! ${error.response?.data || error.message}`);
    }
  };

  const handleNavigateToCCTV = async () => {
    await handleStopPythonModel();
    navigate("/post-login");
  };

  const handleLogout = async () => {
    await handleStopPythonModel();
    localStorage.removeItem("token");
    toast.success("Logged out successfully!", { position: "top-center" });
    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className="w-72 bg-gray-800 p-6 h-screen flex flex-col justify-between fixed left-0 top-0">
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-6">Crowd Analytics</h2>
          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <UserCheck size={18} /> <span className="font-semibold">Total People Detected:</span>{" "}
              {crowdData.peopleCount}
            </p>
            <p className="flex items-center gap-2">
              <Clock size={18} /> <span className="font-semibold">Peak Crowd Time:</span>{" "}
              {crowdData.peakTime}
            </p>
            <p className="flex items-center gap-2">
              <TrafficCone size={18} /> <span className="font-semibold">Congestion Level:</span>{" "}
              {crowdData.congestionLevel}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleNavigateToCCTV}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 w-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            <VideoIcon size={18} /> CCTV Locations
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 w-full flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 p-6">
        <h1 className="text-4xl font-bold text-green-400 mb-6">Live Surveillance Feed</h1>
        <div className="flex justify-center">
          {videoSource ? (
            <img
              src={videoSource}
              alt="Live Feed"
              className="border-4 border-green-500 rounded-lg w-[550px] h-[350px]"
            />
          ) : (
            <p className="text-gray-400">Select a camera from PostLogin.</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
            <Users size={28} className="text-green-400 mb-2" />
            <p className="text-md font-semibold">People Count</p>
            <p className="text-2xl font-bold">{crowdData.peopleCount}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
            <BarChart size={28} className="text-blue-400 mb-2" />
            <p className="text-md font-semibold">Crowd Density</p>
            <p className="text-2xl font-bold">{crowdData.density}%</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md text-center flex flex-col items-center">
            <Activity size={28} className="text-red-400 mb-2" />
            <p className="text-md font-semibold">Unusual Activity</p>
            <p className="text-2xl font-bold">{crowdData.unusual}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
