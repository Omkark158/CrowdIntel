const express = require("express");
const {
  addCamera,
  getAllCameras,
  getCameraById,
  deleteCamera,
} = require("../controllers/cctvController");

const router = express.Router();

// Route to add a new CCTV camera
router.post("/add", addCamera);

// Route to get all CCTV cameras
router.get("/locations", getAllCameras);

// Route to get a specific CCTV camera by ID
router.get("/:id", getCameraById);

// Route to delete a CCTV camera by ID
router.delete("/:id", deleteCamera);

module.exports = router;
