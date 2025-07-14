// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Cek token dan ambil user dari token
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Harus ada header Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak: token tidak ada' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Tempel user ke req supaya bisa diakses di controller berikutnya
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Middleware: Cek role user (misal: hanya admin boleh akses)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: role tidak sesuai' });
    }
    next();
  };
};

module.exports = { protect, authorize };
