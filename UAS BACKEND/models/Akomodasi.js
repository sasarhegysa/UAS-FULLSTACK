const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  nama: { type: String, required: true }, // Contoh: Deluxe, Suite
  kapasitas: { type: Number, required: true }, // Berapa orang
  fasilitas: [String], // Contoh: ['AC', 'WiFi', 'TV']
  hargaPerMalam: { type: Number, required: true }
});

const akomodasiSchema = new mongoose.Schema({
  nama: { type: String, required: true }, // Nama hotel/villa
  tipe: {
    type: String,
    enum: ['Hotel', 'Villa', 'Homestay', 'Guesthouse'],
    required: true
  },
  lokasi: { type: String, required: true },
  deskripsi: { type: String },
  kamar: [roomTypeSchema] // Embedded document
});

module.exports = mongoose.model('Akomodasi', akomodasiSchema);
