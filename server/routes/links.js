const express = require('express');
const Link    = require('../models/Link');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const links = await Link.find({ owner: req.user._id }).sort({ order: 1 });
    res.json(links);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { title, url, order } = req.body;
    const link = await Link.create({ title, url, order: order ?? 0, owner: req.user._id });
    res.status(201).json(link);
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, owner: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });

    const { title, url, order } = req.body;
    if (title !== undefined) link.title = title;
    if (url   !== undefined) link.url   = url;
    if (order !== undefined) link.order = order;
    await link.save();
    res.json(link);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
