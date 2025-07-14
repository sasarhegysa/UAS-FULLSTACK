const generateRekomendasi = require('../utils/aiEngine');
const Recommendation = require('../models/Recommendation');

const postRecommendation = async (req, res) => {
  const { budget } = req.body;

  console.log("=== POST /api/rekomendasi ===");
  console.log("User:", req.user);
  console.log("Budget:", budget);

  if (!budget) return res.status(400).json({ message: "Budget wajib diisi." });

  try {
    const result = await generateRekomendasi(budget);
    console.log("Rekomendasi AI:", result);

    const rekomendasi = await Recommendation.create({
      user: req.user._id,
      budget,
      ...result,
    });

    return res.status(201).json(rekomendasi);
  } catch (err) {
    console.error("🔥 ERROR generateRekomendasi:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


const getRecommendationDetail = async (req, res) => {
  try {
    const rekomendasi = await Recommendation.findById(req.params.id);
    if (!rekomendasi) return res.status(404).json({ message: 'Rekomendasi tidak ditemukan' });

    // Hanya pemilik rekomendasi boleh lihat
    if (!rekomendasi.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    res.json(rekomendasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  postRecommendation,
  getRecommendationDetail,
};
