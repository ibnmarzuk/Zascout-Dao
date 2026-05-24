const zadaoService = require('../services/zadaoService');

async function getGrants(req, res) {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status || 'active',
      search: req.query.search,
      limit: parseInt(req.query.limit) || 20,
      page: parseInt(req.query.page) || 1
    };

    Object.keys(filters).forEach(k => filters[k] === undefined && delete filters[k]);

    const grants = await zadaoService.getGrants(filters);

    res.json({
      success: true,
      count: grants.length,
      data: grants,
      filters,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[GrantController] getGrants error:', err.message);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch grants from Zero Authority DAO',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getGrantById(req, res) {
  try {
    const grant = await zadaoService.getResourceById('grants', req.params.id);
    if (!grant) return res.status(404).json({ success: false, error: 'Grant not found' });

    res.json({ success: true, data: grant });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
}

module.exports = { getGrants, getGrantById };
