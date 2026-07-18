const express = require('express');
const User    = require('../models/User');
const Link    = require('../models/Link');

const router = express.Router();

// No protect middleware — intentionally public
router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const links = await Link.find({ owner: user._id }).sort({ order: 1 }).lean();
    res.json({ username: user.username, bio: user.bio, links });
  } catch (err) { next(err); }
});

module.exports = router;
