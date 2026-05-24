const express = require('express');
const router = express.Router();

const questController = require('../controllers/questController');
const eventController = require('../controllers/eventController');
const gigController = require('../controllers/gigController');
const grantController = require('../controllers/grantController');
const aiController = require('../controllers/aiController');
const Bookmark = require('../models/Bookmark');
const zadaoService = require('../services/zadaoService');

// Quests
router.get('/quests/fetched', questController.getQuests);
router.get('/quests/:id', questController.getQuestById);

// Events
router.get('/events/fetched', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

// Gigs
router.get('/gigs/fetched', gigController.getGigs);
router.get('/gigs/:id', gigController.getGigById);

// Grants
router.get('/grants/fetched', grantController.getGrants);
router.get('/grants/:id', grantController.getGrantById);

// Generic resource proxy — /api/v1/:resource
router.get('/v1/:resource', async (req, res) => {
  const { resource } = req.params;
  const allowed = ['quests', 'events', 'gigs', 'grants', 'bounties'];
  if (!allowed.includes(resource)) {
    return res.status(400).json({ success: false, error: `Unknown resource: ${resource}` });
  }

  try {
    const data = await zadaoService.fetchResource(`/${resource}`, req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
});

// AI Scout
router.post('/ai/discover', aiController.discover);

const SearchHistory = require('../models/SearchHistory');

router.get('/ai/trending', async (req, res) => {
  try {
    const trending = await SearchHistory.aggregate([
      { $match: { success: true } },
      { $group: { _id: { $toLower: "$prompt" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    res.json({ success: true, data: trending.map(t => t._id) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health
router.get('/health', async (req, res) => {
  const zadaoStatus = await zadaoService.pingAPI();
  res.json({
    app: 'ok',
    zadao_api: zadaoStatus.ok ? 'ok' : 'unreachable',
    timestamp: new Date().toISOString()
  });
});

// Cache bust (admin use)
router.delete('/cache', (req, res) => {
  zadaoService.clearCache();
  res.json({ success: true, message: 'Cache cleared' });
});

// Bookmarks routes
router.get('/bookmarks', async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ success: false, error: 'wallet address required' });
  
  const bookmarks = await Bookmark.find({ walletAddress: wallet.toLowerCase() })
    .sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: bookmarks });
});

router.post('/bookmarks', async (req, res) => {
  const { walletAddress, resourceType, resourceId, resourceTitle, resourceData } = req.body;
  if (!walletAddress || !resourceType || !resourceId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase(), resourceType, resourceId },
      { $set: { resourceTitle, resourceData } },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: bookmark });
  } catch (err) {
    if (err.code === 11000) {
      res.json({ success: true, message: 'Already bookmarked' });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});

router.delete('/bookmarks/:id', async (req, res) => {
  await Bookmark.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
