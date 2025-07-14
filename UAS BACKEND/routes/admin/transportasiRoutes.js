const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const controller = require('../../controllers/admin/transportasiController');

// Middleware: hanya admin
router.use(protect, authorize('admin'));

// CRUD transportasi
router.get('/', controller.getAllTransportasi);
router.get('/:id', controller.getTransportasiById);
router.post('/', controller.createTransportasi);
router.put('/:id', controller.updateTransportasi);
router.delete('/:id', controller.deleteTransportasi);

module.exports = router;
