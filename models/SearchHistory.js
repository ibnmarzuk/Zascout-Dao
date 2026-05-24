const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  prompt: { type: String, required: true, maxlength: 500 },
  walletAddress: { type: String, lowercase: true, default: null },
  resultCount: { type: Number, default: 0 },
  success: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Auto-delete after 30 days
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
