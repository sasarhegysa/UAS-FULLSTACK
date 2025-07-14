const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(async () => {
  const existing = await User.findOne({ email: "admin@travel.com" });
  if (existing) {
    console.log("⚠️ Admin sudah ada.");
    process.exit();
  }

  const admin = new User({
    nama: "Admin Dummy",
    email: "admin@travel.com",
    password: "admin123", // Ini akan auto di-hash
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin berhasil dibuat.");
  process.exit();
}).catch(err => {
  console.error("❌ Gagal konek ke MongoDB:", err.message);
  process.exit();
});
