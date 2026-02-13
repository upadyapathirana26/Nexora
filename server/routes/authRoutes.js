// server/routes/authRoutes.js
// server/routes/authRoutes.js
const express = require('express');
const { register, login, verifyOTP } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);      // ← no ()
router.post('/login', login);            // ← no ()
router.post('/verify-otp', verifyOTP);   // ← no ()

module.exports = router;