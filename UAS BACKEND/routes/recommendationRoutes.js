const express = require('express');
const router = express.Router();
const { postRecommendation, getRecommendationDetail } = require('../controllers/recommendationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('user', 'admin'), postRecommendation);
router.get('/:id', protect, authorize('user', 'admin'), getRecommendationDetail);

module.exports = router;
