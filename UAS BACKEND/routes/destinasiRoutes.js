const express = require("express");
const router = express.Router();
const Destinasi = require("../models/Destinasi"); // sesuaikan path model jika berbeda

// GET semua destinasi (versi publik)
router.get("/", async (req, res) => {
  try {
    // Ambil semua destinasi, bisa kamu filter kalau butuh
    const destinasi = await Destinasi.find(); 
    res.status(200).json(destinasi);
  } catch (error) {
    console.error("Gagal mengambil data destinasi publik:", error.message);
    res.status(500).json({ message: "Gagal mengambil data destinasi." });
  }
});

// GET detail destinasi berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const destinasi = await Destinasi.findById(req.params.id);
    if (!destinasi) {
      return res.status(404).json({ message: "Destinasi tidak ditemukan." });
    }
    res.status(200).json(destinasi);
  } catch (error) {
    console.error("Gagal mengambil detail destinasi:", error.message);
    res.status(500).json({ message: "Gagal mengambil detail destinasi." });
  }
});


module.exports = router;
