const Package = require("../models/Package");
const Booking = require("../models/Booking");

// Ambil semua paket (dengan populate relasi)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("destinasi")
      .populate("akomodasi")
      .populate("transportasi");

    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil detail 1 paket (dengan populate relasi)
exports.getPackageDetail = async (req, res) => {
  try {
    const paket = await Package.findById(req.params.id)
      .populate("destinasi")
      .populate("akomodasi")
      .populate("transportasi");

    if (!paket) return res.status(404).json({ message: "Paket tidak ditemukan" });
    res.json(paket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Booking paket tour
exports.bookPackage = async (req, res) => {
  try {
    const paket = await Package.findById(req.params.id);
    if (!paket) return res.status(404).json({ message: "Paket tidak ditemukan" });

    const { tanggalBerangkat, tanggalPulang, metodePembayaran } = req.body;
    if (!tanggalBerangkat || !tanggalPulang || !metodePembayaran) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      package: paket._id,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran,
      status: "pending"
    });

    res.status(201).json({ message: "Booking paket berhasil", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
