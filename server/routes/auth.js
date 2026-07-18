const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const protect = require('../middleware/protect');

const router = express.Router();

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userPayload = (u) => ({ id: u._id, username: u.username, email: u.email, bio: u.bio });

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Username or email already taken' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.status(201).json({ token: sign(user._id), user: userPayload(user) });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ token: sign(user._id), user: userPayload(user) });
  } catch (err) { next(err); }
});

router.get('/me', protect, (req, res) => {
  res.json(userPayload(req.user));
});

router.put('/me', protect, async (req, res, next) => {
  try {
    if (req.body.bio !== undefined) req.user.bio = req.body.bio;
    await req.user.save();
    res.json(userPayload(req.user));
  } catch (err) { next(err); }
});

module.exports = router;
