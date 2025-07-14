const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Sumber booking
  rekomendasi: { type: mongoose.Schema.Types.ObjectId, ref: "Recommendation", default: null },
  package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", default: null },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },

  // Booking manual
  destinasi: { type: mongoose.Schema.Types.ObjectId, ref: "Destinasi", default: null },
  akomodasi: { type: mongoose.Schema.Types.ObjectId, ref: "Akomodasi", default: null },
  transportasi: { type: mongoose.Schema.Types.ObjectId, ref: "Transportasi", default: null },

  tanggalBerangkat: { type: Date, required: true },
  tanggalPulang: { type: Date, required: true },
  metodePembayaran: { type: String, required: true },
  buktiPembayaran: { type: String, default: null },
  ktp: { type: String, default: null },       // ✅ Tambahkan ini
  paspor: { type: String, default: null },    // ✅ Tambahkan ini
  totalHarga: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["pending", "disetujui", "menunggu_verifikasi", "ditolak", "selesai", "canceled"],
    default: "pending"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
