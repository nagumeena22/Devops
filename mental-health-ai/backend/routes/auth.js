const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, occupation } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'admin' : 'user',
      occupation: occupation ? occupation.trim() : ''
    });

    const savedUser = await user.save();
    return res.status(201).json({
      user: {
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        occupation: savedUser.occupation,
        createdAt: savedUser.createdAt
      }
    });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ error: 'Server error while registering user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        occupation: user.occupation,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error while logging in.' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        occupation: user.occupation,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Profile error', err);
    return res.status(500).json({ error: 'Server error while fetching profile.' });
  }
});

module.exports = router;
