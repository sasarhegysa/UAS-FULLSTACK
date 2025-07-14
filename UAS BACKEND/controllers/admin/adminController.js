const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Generate token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER ADMIN BARU
exports.registerAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const newAdmin = await User.create({
      nama,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      _id: newAdmin._id,
      nama: newAdmin.nama,
      email: newAdmin.email,
      role: newAdmin.role,
      token: generateToken(newAdmin)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USERS (opsional bisa pakai query ?role=user/admin)
exports.getAllUsers = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
