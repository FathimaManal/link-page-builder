const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  url:       { type: String, required: true },
  order:     { type: Number, default: 0 },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Link', linkSchema);
