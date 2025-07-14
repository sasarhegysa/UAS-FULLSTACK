const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// 🔹 Serve folder statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public_bukti_transfer')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 🔹 Route utama
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));
app.use('/api/rekomendasi', require('./routes/recommendationRoutes'));
app.use('/api/package', require('./routes/packageRoutes'));
app.use('/api/event', require('./routes/eventRoutes'));
app.use('/api/destinasi', require('./routes/destinasiRoutes'));
// Route user untuk akomodasi dan transportasi (biar booking custom bisa ambil)
app.use('/api/akomodasi', require('./routes/akomodasiRoutes'));
app.use('/api/transportasi', require('./routes/transportasiRoutes'));


// 🔹 Admin routes
app.use('/api/admin', require('./routes/admin/adminRoutes'));
app.use('/api/admin/akomodasi', require('./routes/admin/akomodasiRoutes'));
app.use('/api/admin/booking', require('./routes/admin/bookingRoutes'));
app.use('/api/admin/destinasi', require('./routes/admin/destinasiRoutes'));
app.use('/api/admin/event', require('./routes/admin/eventRoutes'));
app.use('/api/admin/package', require('./routes/admin/packageRoutes'));
app.use('/api/admin/transportasi', require('./routes/admin/transportasiRoutes'));

app.get('/', (req, res) => {
  res.send('API TRAVELOOP aktif ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
})