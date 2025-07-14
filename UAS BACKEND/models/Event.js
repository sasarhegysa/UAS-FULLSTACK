// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  lokasi: { type: String, required: true },
  deskripsi: { type: String },
  tanggal: { type: Date, required: true },
  harga: { type: Number, default: 0 }, // harga tiket event
  image: { type: String }, // URL gambar event

  // Tambahan untuk akomodasi & transportasi
  akomodasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Akomodasi"
  },
  transportasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transportasi"
  },
  hargaPaket: {
    type: Number // harga total tiket + akomodasi + transportasi
  }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
