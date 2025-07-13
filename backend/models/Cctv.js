const mongoose = require("mongoose");

const CCTVCameraSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  ipAddress: {
    type: String,
    required: [true, "IP Address is required"],
    unique: true,
    validate: {
      validator: function (value) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(value); // Validates IPv4 format
      },
      message: "Invalid IP Address format",
    },
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CCTVCamera", CCTVCameraSchema);
