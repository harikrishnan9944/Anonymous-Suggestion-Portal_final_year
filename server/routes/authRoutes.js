const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const memoryStore = require('../store/memoryStore');
const UserModel = require('../models/User');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'asp_college_secret_key_2026';

// Helper middleware for protected admin endpoints
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let user = null;

    if (getIsConnected()) {
      user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) user = null;
      }
    }

    if (!user) {
      // Memory Store Fallback Check
      const memUser = await memoryStore.verifyAdminCredentials(email, password);
      if (memUser) {
        user = memUser;
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials provided.' });
    }

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name || 'System Administrator',
        email: user.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// Verify Admin Token
router.get('/me', verifyAdminToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { router, verifyAdminToken };
