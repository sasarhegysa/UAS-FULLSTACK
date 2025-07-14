// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// === REGISTER ===
const register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // Cek email sudah dipakai?
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email sudah terdaftar' });

    // Buat user baru (default role: user)
    const user = await User.create({ nama, email, password });

    res.status(201).json({
      _id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === LOGIN ===
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    res.json({
      _id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === LOGOUT (dummy) ===
// Logout biasanya frontend tinggal hapus token di localStorage
const logout = (req, res) => {
  res.json({ message: 'Logout berhasil (hapus token di frontend)' });
};

// === GET ME ===
const getMe = async (req, res) => {
  try {
    // req.user sudah ditempel oleh middleware `protect`
    const user = req.user;
    res.json({
      _id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { register, login, logout, getMe };
