// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const { getAllEvents, getEventDetail, bookEvent } = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllEvents);
router.get("/:id", getEventDetail);
router.post("/:id/booking", protect, authorize("user", "admin"), bookEvent);

module.exports = router;
