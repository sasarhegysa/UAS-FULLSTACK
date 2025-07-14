const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  confirmBooking
} = require('../../controllers/admin/bookingController');

// Middleware: hanya untuk admin
router.use(protect, authorize('admin'));

// 🔹 Ambil semua booking dari semua user
router.get('/', getAllBookings);

// 🔹 Ambil detail booking tertentu
router.get('/:id', getBookingById);

// 🔹 Update status booking (pending, selesai, ditolak, dll)
router.patch('/:id/status', updateBookingStatus);

// 🔹 Konfirmasi booking (setelah admin cek dokumen & bukti bayar)
router.patch('/:id/confirm', confirmBooking);

module.exports = router;
