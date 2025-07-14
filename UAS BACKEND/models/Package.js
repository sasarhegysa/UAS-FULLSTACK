const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
  durasi: String, // opsional
  fasilitas: [String], // opsional
  image: String,       // opsional
  destinasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destinasi",
    required: true,
  },
  akomodasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Akomodasi",
    required: true,
  },
  transportasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transportasi",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Package", packageSchema);
