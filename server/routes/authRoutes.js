// server/routes/authRoutes.js
// server/routes/authRoutes.js
const express = require('express');
const { register, login, verifyOTP } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);      // ← no ()
router.post('/login', login);            // ← no ()
router.post('/verify-otp', verifyOTP);   // ← no ()
// Get current user info
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    _id: req.user.userId,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    bio: req.user.bio,
  });
});

module.exports = router;