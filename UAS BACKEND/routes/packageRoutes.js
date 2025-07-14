const express = require("express");
const router = express.Router();
const {
  getAllPackages,
  getPackageDetail,
  bookPackage
} = require("../controllers/packageController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllPackages);
router.get("/:id", getPackageDetail);
router.post("/:id/booking", protect, authorize("user", "admin"), bookPackage);

module.exports = router;
