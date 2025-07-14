const Booking = require('../../models/Booking');

// 🔸 [Admin] GET semua booking dari semua user
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'nama email')
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

// 🔸 [Admin] GET detail booking berdasarkan ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'nama email')
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

// 🔸 [Admin] PATCH update status booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ['pending', 'disetujui', 'ditolak', 'selesai', 'canceled'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });

    res.json({ message: 'Status booking diperbarui', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 [Admin] Konfirmasi booking (set status selesai + simpan info tiket/hotel)
exports.confirmBooking = async (req, res) => {
  try {
    const { tiketPesawat, voucherHotel } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });

    booking.tiketPesawat = tiketPesawat;
    booking.voucherHotel = voucherHotel;
    booking.status = 'selesai';

    await booking.save();
    res.json({ message: 'Booking berhasil dikonfirmasi', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

