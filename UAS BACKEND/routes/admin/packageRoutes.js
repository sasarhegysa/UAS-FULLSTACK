const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const controller = require('../../controllers/admin/packageController');

// Middleware khusus admin
router.use(protect, authorize('admin'));

router.get('/', controller.getAllPackages);
router.get('/:id', controller.getPackageById);
router.post('/', controller.createPackage);
router.put('/:id', controller.updatePackage);
router.delete('/:id', controller.deletePackage);

module.exports = router;
