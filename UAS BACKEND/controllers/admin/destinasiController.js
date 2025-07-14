const Destinasi = require('../../models/Destinasi');

// [GET] Ambil semua destinasi
exports.getAllDestinasi = async (req, res) => {
  try {
    const data = await Destinasi.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data destinasi', error: err.message });
  }
};

// [GET] Ambil satu destinasi berdasarkan ID
exports.getDestinasiById = async (req, res) => {
  try {
    const data = await Destinasi.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data destinasi', error: err.message });
  }
};

exports.createDestinasi = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { nama, lokasi, deskripsi, tipe, hargaTiket } = req.body;

    if (!nama || !lokasi || !deskripsi || !tipe || !hargaTiket) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    const newDestinasi = await Destinasi.create({
      nama,
      lokasi,
      deskripsi,
      tipe,
      hargaTiket,
      foto: req.file ? `/public/foto_destinasi/${req.file.filename}` : null
    });

    res.status(201).json(newDestinasi);
  } catch (err) {
    console.error("❌ GAGAL TAMBAH DESTINASI:", err);
    res.status(400).json({ message: "Gagal membuat destinasi", error: err.message });
  }
};


// [PUT] Update destinasi (tanpa ganti gambar)
exports.updateDestinasi = async (req, res) => {
  try {
    const updated = await Destinasi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui destinasi', error: err.message });
  }
};

// [DELETE] Hapus destinasi
exports.deleteDestinasi = async (req, res) => {
  try {
    const deleted = await Destinasi.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    res.json({ message: 'Destinasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus destinasi', error: err.message });
  }
};
