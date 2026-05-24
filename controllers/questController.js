const zadaoService = require('../services/zadaoService');

async function getQuests(req, res) {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status || 'active',
      search: req.query.search,
      limit: parseInt(req.query.limit) || 20,
      page: parseInt(req.query.page) || 1
    };

    // Remove undefined filters
    Object.keys(filters).forEach(k => filters[k] === undefined && delete filters[k]);

    const quests = await zadaoService.getQuests(filters);

    res.json({
      success: true,
      count: quests.length,
      data: quests,
      filters,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[QuestController] getQuests error:', err.message);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch quests from Zero Authority DAO',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getQuestById(req, res) {
  try {
    const quest = await zadaoService.getResourceById('quests', req.params.id);
    if (!quest) return res.status(404).json({ success: false, error: 'Quest not found' });

    res.json({ success: true, data: quest });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
}

module.exports = { getQuests, getQuestById };
