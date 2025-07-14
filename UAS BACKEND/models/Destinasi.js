const mongoose = require('mongoose');

const destinasiSchema = new mongoose.Schema({
  nama: { type: String, required: true, trim: true },
  lokasi: { type: String, required: true, trim: true },
  deskripsi: { type: String, required: true, trim: true },
  tipe: {
    type: String,
    required: true,
    enum: ['Pantai', 'Gunung', 'Perkotaan', 'Sejarah', 'Alam', 'Taman Hiburan', 'Lainnya'],
    default: 'Lainnya',
  },
  hargaTiket: { type: Number, required: true, min: 0 },
  foto: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Destinasi', destinasiSchema);
