const zadaoService = require('../services/zadaoService');

async function getGigs(req, res) {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status || 'active',
      search: req.query.search,
      limit: parseInt(req.query.limit) || 20,
      page: parseInt(req.query.page) || 1
    };

    Object.keys(filters).forEach(k => filters[k] === undefined && delete filters[k]);

    const gigs = await zadaoService.getGigs(filters);

    res.json({
      success: true,
      count: gigs.length,
      data: gigs,
      filters,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[GigController] getGigs error:', err.message);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch gigs from Zero Authority DAO',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getGigById(req, res) {
  try {
    const gig = await zadaoService.getResourceById('gigs', req.params.id);
    if (!gig) return res.status(404).json({ success: false, error: 'Gig not found' });

    res.json({ success: true, data: gig });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
}

module.exports = { getGigs, getGigById };
