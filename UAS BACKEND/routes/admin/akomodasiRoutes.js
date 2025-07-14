const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const controller = require('../../controllers/admin/akomodasiController');

// Middleware: hanya admin yang bisa akses
router.use(protect, authorize('admin'));

// CRUD Akomodasi
router.get('/', controller.getAllAkomodasi);
router.get('/:id', controller.getAkomodasiById);
router.post('/', controller.createAkomodasi);
router.put('/:id', controller.updateAkomodasi);
router.delete('/:id', controller.deleteAkomodasi);

module.exports = router;
