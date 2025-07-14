const Package = require('../../models/Package');

// [POST] Tambah paket tour
exports.createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(400).json({ message: 'Gagal membuat paket', error: err.message });
  }
};

// [GET] Ambil semua paket
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('destinasi')
      .populate('akomodasi')
      .populate('transportasi');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data paket', error: err.message });
  }
};

// [GET] Detail satu paket
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate('destinasi')
      .populate('akomodasi')
      .populate('transportasi');
    if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail paket', error: err.message });
  }
};

// [PUT] Update paket
exports.updatePackage = async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui paket', error: err.message });
  }
};

// [DELETE] Hapus paket
exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    res.json({ message: 'Paket berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus paket', error: err.message });
  }
};
