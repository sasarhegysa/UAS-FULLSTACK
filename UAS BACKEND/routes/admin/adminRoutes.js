const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const { registerAdmin, getAllUsers } = require('../../controllers/admin/adminController');

// Semua route ini hanya bisa diakses oleh admin
router.use(protect, authorize('admin'));

// Register admin baru (oleh admin yang sudah login)
router.post('/register', registerAdmin);

// Lihat semua user (opsional: bisa filter role dengan query)
router.get('/users', getAllUsers);

module.exports = router;
