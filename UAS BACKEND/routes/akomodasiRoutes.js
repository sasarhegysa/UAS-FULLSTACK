const express = require("express");
const router = express.Router();
const Akomodasi = require("../models/Akomodasi");

// Get semua akomodasi
router.get("/", async (req, res) => {
  try {
    const data = await Akomodasi.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
