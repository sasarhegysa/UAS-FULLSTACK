const Transportasi = require('../../models/Transportasi');

// [GET] Semua transportasi
exports.getAllTransportasi = async (req, res) => {
  try {
    const list = await Transportasi.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data transportasi', error: err.message });
  }
};

// [GET] Detail 1 transportasi
exports.getTransportasiById = async (req, res) => {
  try {
    const data = await Transportasi.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Transportasi tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail transportasi', error: err.message });
  }
};

// [POST] Tambah transportasi
exports.createTransportasi = async (req, res) => {
  try {
    const baru = await Transportasi.create(req.body);
    res.status(201).json(baru);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambah transportasi', error: err.message });
  }
};

// [PUT] Update transportasi
exports.updateTransportasi = async (req, res) => {
  try {
    const update = await Transportasi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!update) return res.status(404).json({ message: 'Transportasi tidak ditemukan' });
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui transportasi', error: err.message });
  }
};

// [DELETE] Hapus transportasi
exports.deleteTransportasi = async (req, res) => {
  try {
    const hapus = await Transportasi.findByIdAndDelete(req.params.id);
    if (!hapus) return res.status(404).json({ message: 'Transportasi tidak ditemukan' });
    res.json({ message: 'Transportasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus transportasi', error: err.message });
  }
};
