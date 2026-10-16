const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Never allow role to be set by user on registration
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password,
      phone: phone?.trim(),
      role: 'citizen', // Always citizen
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contributionPoints: user.contributionPoints,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contributionPoints: user.contributionPoints,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, logout, getMe };
