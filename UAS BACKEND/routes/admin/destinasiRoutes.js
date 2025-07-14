const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadDestinasi');
const controller = require('../../controllers/admin/destinasiController');

router.use(protect, authorize('admin'));

router.get('/', controller.getAllDestinasi);
router.get('/:id', controller.getDestinasiById);
router.post('/', upload.single("foto"), controller.createDestinasi);
router.put('/:id', controller.updateDestinasi);
router.delete('/:id', controller.deleteDestinasi);

module.exports = router;
