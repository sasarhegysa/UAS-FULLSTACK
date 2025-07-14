const Akomodasi = require('../../models/Akomodasi');

// [GET] Semua akomodasi
exports.getAllAkomodasi = async (req, res) => {
  try {
    const list = await Akomodasi.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data akomodasi', error: err.message });
  }
};

// [GET] Detail satu akomodasi
exports.getAkomodasiById = async (req, res) => {
  try {
    const data = await Akomodasi.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Akomodasi tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail akomodasi', error: err.message });
  }
};

// [POST] Tambah akomodasi
exports.createAkomodasi = async (req, res) => {
  try {
    const baru = await Akomodasi.create(req.body);
    res.status(201).json(baru);
  } catch (err) {
    res.status(400).json({ message: 'Gagal membuat akomodasi', error: err.message });
  }
};

// [PUT] Update akomodasi
exports.updateAkomodasi = async (req, res) => {
  try {
    const update = await Akomodasi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!update) return res.status(404).json({ message: 'Akomodasi tidak ditemukan' });
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui akomodasi', error: err.message });
  }
};

// [DELETE] Hapus akomodasi
exports.deleteAkomodasi = async (req, res) => {
  try {
    const hapus = await Akomodasi.findByIdAndDelete(req.params.id);
    if (!hapus) return res.status(404).json({ message: 'Akomodasi tidak ditemukan' });
    res.json({ message: 'Akomodasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus akomodasi', error: err.message });
  }
};
