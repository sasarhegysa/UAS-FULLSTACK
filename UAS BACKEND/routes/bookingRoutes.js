const express = require('express');
const router = express.Router();

const {
  createBooking,
  createManualBooking,
  createBookingFromRecommendation,
  getUserBookings,
  getBooking,
  cancelBooking,
  uploadBuktiPembayaran,
  uploadTravelerData,
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/authMiddleware');
const uploadTransfer = require('../middleware/uploadTransfer');
const uploadDokumen = require('../middleware/uploadDokumen');

// 🔹 Upload bukti pembayaran
router.patch(
  '/:id/upload',
  protect,
  authorize('user', 'admin'),
  uploadTransfer.single('bukti'),
  uploadBuktiPembayaran
);

// 🔹 Upload data traveler + dokumen
router.patch(
  '/:id/traveler',
  protect,
  authorize('user', 'admin'),
  uploadDokumen.fields([
    { name: 'ktp', maxCount: 1 },
    { name: 'paspor', maxCount: 1 },
  ]),
  uploadTravelerData
);

// 🔹 Booking dari rekomendasi AI
router.post(
  '/rekomendasi/:id',
  protect,
  authorize('user', 'admin'),
  createBookingFromRecommendation
);

// 🔹 Booking dari paket atau event
router.post(
  '/',
  protect,
  authorize('user', 'admin'),
  createBooking
);

// 🔹 Booking manual (custom)
router.post(
  '/custom',
  protect,
  authorize('user', 'admin'),
  createManualBooking
);

// 🔹 Lihat semua booking milik user
router.get(
  '/',
  protect,
  authorize('user', 'admin'),
  getUserBookings
);

// 🔹 Lihat detail 1 booking
router.get(
  '/:id',
  protect,
  authorize('user', 'admin'),
  getBooking
);

// 🔹 Batalkan booking
router.patch(
  '/:id/cancel',
  protect,
  authorize('user', 'admin'),
  cancelBooking
);

module.exports = router;
