const zadaoService = require('../services/zadaoService');

async function getEvents(req, res) {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status || 'active',
      search: req.query.search,
      limit: parseInt(req.query.limit) || 20,
      page: parseInt(req.query.page) || 1
    };

    Object.keys(filters).forEach(k => filters[k] === undefined && delete filters[k]);

    const events = await zadaoService.getEvents(filters);

    res.json({
      success: true,
      count: events.length,
      data: events,
      filters,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[EventController] getEvents error:', err.message);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch events from Zero Authority DAO',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getEventById(req, res) {
  try {
    const event = await zadaoService.getResourceById('events', req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
}

module.exports = { getEvents, getEventById };
