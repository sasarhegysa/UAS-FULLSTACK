const mongoose = require('mongoose');

const transportasiSchema = new mongoose.Schema({
  jenis: {
    type: String,
    enum: ['Pesawat', 'Kereta Api', 'Bus', 'Kapal Laut', 'Travel'], // ✅ disamakan dengan frontend
    required: true
  },
  namaOperator: { type: String, required: true },
  tipe: { type: String },
  rute: { type: String, required: true },
  keberangkatan: { type: String },
  harga: { type: Number, required: true },
  deskripsi: { type: String }
});

module.exports = mongoose.model('Transportasi', transportasiSchema);
