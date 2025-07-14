const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../../middleware/authMiddleware");
const controller = require("../../controllers/admin/eventController");
const upload = require("../../middleware/uploadEvent"); // ⬅️ pastikan path sesuai

// Middleware: hanya admin
router.use(protect, authorize("admin"));

// Tambahkan upload.single untuk post & put
router.post("/", upload.single("image"), controller.createEvent);
router.put("/:id", upload.single("image"), controller.updateEvent);

router.get("/", controller.getAllEvents);
router.get("/:id", controller.getEventById);
router.delete("/:id", controller.deleteEvent);

module.exports = router;
