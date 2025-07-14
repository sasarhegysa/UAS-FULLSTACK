const express = require("express");
const router = express.Router();
const Transportasi = require("../models/Transportasi");

// Get semua transportasi
router.get("/", async (req, res) => {
  try {
    const data = await Transportasi.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
