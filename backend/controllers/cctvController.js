const CCTVCamera = require("../models/Cctv");

// Add a new CCTV camera
exports.addCamera = async (req, res) => {
  try {
    const { location, ipAddress } = req.body;

    // Check if the camera already exists (based on IP Address)
    const existingCamera = await CCTVCamera.findOne({ ipAddress });
    if (existingCamera) {
      return res.status(400).json({ error: "CCTV Camera with this IP already exists" });
    }

    const newCamera = new CCTVCamera({ location, ipAddress });
    await newCamera.save();

    res.status(201).json({ message: "CCTV Camera added successfully", camera: newCamera });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all CCTV cameras
exports.getAllCameras = async (req, res) => {
  try {
    const cameras = await CCTVCamera.find();
    res.status(200).json({ cameras });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single CCTV camera by ID
exports.getCameraById = async (req, res) => {
  try {
    const { id } = req.params;
    const camera = await CCTVCamera.findById(id);

    if (!camera) return res.status(404).json({ error: "CCTV Camera not found" });

    res.status(200).json({ camera });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a CCTV camera by ID
exports.deleteCamera = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCamera = await CCTVCamera.findByIdAndDelete(id);

    if (!deletedCamera) return res.status(404).json({ error: "CCTV Camera not found" });

    res.status(200).json({ message: "CCTV Camera deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
