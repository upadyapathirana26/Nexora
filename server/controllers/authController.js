// server/controllers/authController.js

// In-memory OTP store (replace with Redis in production)
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const otpStore = new Map(); // email → { otp, expiresAt }
const sendOTPEmail = require('../utils/sendEmail');



const register = async (req, res) => {
  // 🔍 Debug log (you can remove later)
  console.log('📥 Register body:', req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};





const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Password correct → send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    // Send email
    await sendOTPEmail(email, otp);

    // Return partial success — wait for OTP
    res.json({
      success: true,
      message: 'OTP sent to your email',
      requiresOTP: true,
      email, // masked if needed: email.replace(/(.{2})[^@]+/, '$1***')
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};












const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ message: 'OTP expired or not requested' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // ✅ OTP valid → issue final JWT
  const user = await User.findOne({ email });
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  otpStore.delete(email); // cleanup

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
    },
  });
};






module.exports = { register, login,verifyOTP };