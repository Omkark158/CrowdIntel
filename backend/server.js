const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cctvRoutes = require("./routes/cctvRoutes");
const path = require('path');



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to your frontend URL
    methods: ["GET", "POST"]
  }
});


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/cctv", cctvRoutes);
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// WebSocket Logic
io.on("connection", (socket) => {
  console.log("New WebSocket connection: ", socket.id);

  socket.on("video-stream", (data) => {
    io.emit("video-feed", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
