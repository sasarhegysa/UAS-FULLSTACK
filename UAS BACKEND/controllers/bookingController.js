const Booking = require('../models/Booking');
const Recommendation = require('../models/Recommendation');
const Akomodasi = require('../models/Akomodasi');
const Transportasi = require('../models/Transportasi');


// 🔸 Booking dari REKOMENDASI AI
exports.createBookingFromRecommendation = async (req, res) => {
  try {
    const { tanggalBerangkat, tanggalPulang, metodePembayaran } = req.body;
    const { id } = req.params;

    const rekomendasi = await Recommendation.findById(id);
    if (!rekomendasi) return res.status(404).json({ message: 'Rekomendasi tidak ditemukan' });
    if (!rekomendasi.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Akses ditolak: bukan rekomendasi milikmu' });
    }

    const totalHarga = rekomendasi.totalEstimasi || 0;

    const booking = new Booking({
      user: req.user._id,
      rekomendasi: id,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran,
      totalHarga,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking berhasil dibuat', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔸 Booking dari PAKET atau EVENT
exports.createBooking = async (req, res) => {
  try {
    const {
      packageId,
      eventId,
      destinasiId,
      akomodasiId,
      transportasiId,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran
    } = req.body;

    const booking = new Booking({
      user: req.user._id,
      package: packageId || null,
      event: eventId || null,
      destinasi: destinasiId || null,
      akomodasi: akomodasiId || null,
      transportasi: transportasiId || null,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking berhasil dibuat', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createManualBooking = async (req, res) => {
  try {
    const {
      destinasiId,
      akomodasiId,
      transportasiId,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran,
      kamarTipe
    } = req.body;

    if (!destinasiId || !akomodasiId || !transportasiId || !kamarTipe) {
      return res.status(400).json({ message: 'Destinasi, akomodasi, transportasi, dan tipe kamar wajib dipilih' });
    }

    if (new Date(tanggalPulang) < new Date(tanggalBerangkat)) {
      return res.status(400).json({ message: "Tanggal pulang tidak boleh sebelum tanggal berangkat" });
    }

    const akomodasi = await Akomodasi.findById(akomodasiId);
    const transportasi = await Transportasi.findById(transportasiId);

    if (!akomodasi || !transportasi) {
      return res.status(404).json({ message: "Akomodasi atau transportasi tidak ditemukan" });
    }

    // Temukan kamar berdasarkan tipe
    const kamar = akomodasi.kamar.find(k => k.nama === kamarTipe);
    if (!kamar) {
      return res.status(400).json({ message: "Tipe kamar tidak valid" });
    }

    const hargaPerMalam = kamar.hargaPerMalam;

    // Hitung jumlah malam
    const tgl1 = new Date(tanggalBerangkat);
    const tgl2 = new Date(tanggalPulang);
    const selisihHari = Math.ceil((tgl2 - tgl1) / (1000 * 60 * 60 * 24));
    const jumlahMalam = selisihHari > 0 ? selisihHari : 1;

    // Hitung total harga
    const totalHarga = (hargaPerMalam * jumlahMalam) + transportasi.harga;

    const booking = new Booking({
      user: req.user._id,
      destinasi: destinasiId,
      akomodasi: akomodasiId,
      transportasi: transportasiId,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran,
      totalHarga,
      status: "pending",
    });

    await booking.save();
    res.status(201).json({ message: 'Booking custom berhasil dibuat', booking });
  } catch (err) {
    console.error("createManualBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};


// 🔸 Lihat semua booking milik user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('rekomendasi')
      .populate('package')
      .populate('event')
      .populate('destinasi')
      .populate('akomodasi')
      .populate('transportasi');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Lihat detail 1 booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('rekomendasi')
      .populate('package')
      .populate('event')
      .populate('destinasi')
      .populate('akomodasi')
      .populate('transportasi');

    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking tidak bisa dibatalkan' });
    }

    booking.status = 'canceled';
    await booking.save();

    res.json({ message: 'Booking berhasil dibatalkan', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Upload bukti pembayaran
exports.uploadBuktiPembayaran = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    if (!req.file) return res.status(400).json({ message: 'Tidak ada file yang diupload' });

    booking.buktiPembayaran = `/bukti_transfer/${req.file.filename}`;
    await booking.save();

    res.json({
      message: 'Bukti pembayaran berhasil diupload',
      buktiPembayaran: booking.buktiPembayaran
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Upload data traveler dan dokumen (KTP/Paspor)
exports.uploadTravelerData = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });

    const {
      namaLengkap,
      tanggalLahir,
      nik,
      noHp,
      email
    } = req.body;

    booking.traveler = { namaLengkap, tanggalLahir, nik, noHp, email };

    if (req.files?.ktp?.[0]) {
      booking.dokumen = booking.dokumen || {};
      booking.dokumen.ktp = `/uploads/${req.files.ktp[0].filename}`;
    }

    if (req.files?.paspor?.[0]) {
      booking.dokumen = booking.dokumen || {};
      booking.dokumen.paspor = `/uploads/${req.files.paspor[0].filename}`;
    }

    booking.status = 'menunggu_verifikasi';
    await booking.save();

    res.json({ message: 'Data traveler berhasil disimpan', booking });
  } catch (err) {
    console.error('uploadTravelerData error:', err);
    res.status(500).json({ message: 'Gagal upload data traveler' });
  }
};

