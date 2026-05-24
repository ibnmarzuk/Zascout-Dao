const express = require('express');
const router = express.Router();
const zadaoService = require('../services/zadaoService');

router.get('/', async (req, res) => {
  // Try to load basic recent opportunities for dashboard
  try {
    const bounties = await zadaoService.getBounties({ limit: 4 });
    const events = await zadaoService.getEvents({ limit: 4 });
    
    res.render('index', {
      title: 'Dashboard — ZAScout DAO',
      opportunities: bounties?.slice(0, 4) || [],
      events: events?.slice(0, 4) || []
    });
  } catch (err) {
    res.render('index', {
      title: 'Dashboard — ZAScout DAO',
      opportunities: [],
      events: []
    });
  }
});

router.get('/quests', async (req, res) => {
  try {
    const quests = await zadaoService.getQuests({
      status: req.query.status,
      search: req.query.search,
      category: req.query.category
    });

    res.render('quests', {
      title: 'Quests — ZAScout DAO',
      quests,
      filters: {
        status: req.query.status || '',
        search: req.query.search || '',
        category: req.query.category || ''
      },
      error: null
    });
  } catch (err) {
    res.render('quests', {
      title: 'Quests — ZAScout DAO',
      quests: [],
      filters: {},
      error: 'Unable to load quests. Please try again.'
    });
  }
});

router.get('/bounties', async (req, res) => {
  try {
    const bounties = await zadaoService.getBounties({
      status: req.query.status,
      search: req.query.search,
      category: req.query.category
    });

    res.render('bounties', {
      title: 'Bounties — ZAScout DAO',
      quests: bounties, // map bounties to quests template if needed, or specific template
      filters: {
        status: req.query.status || '',
        search: req.query.search || '',
        category: req.query.category || ''
      },
      error: null
    });
  } catch (err) {
    res.render('bounties', {
      title: 'Bounties — ZAScout DAO',
      quests: [],
      filters: {},
      error: 'Unable to load bounties. Please try again.'
    });
  }
});

router.get('/gigs', async (req, res) => {
  try {
    const gigs = await zadaoService.getGigs({
      status: req.query.status,
      search: req.query.search,
      category: req.query.category
    });

    res.render('gigs', {
      title: 'Gigs — ZAScout DAO',
      gigs,
      filters: {
        status: req.query.status || '',
        search: req.query.search || '',
        category: req.query.category || ''
      },
      error: null
    });
  } catch (err) {
    res.render('gigs', {
      title: 'Gigs — ZAScout DAO',
      gigs: [],
      filters: {},
      error: 'Unable to load gigs. Please try again.'
    });
  }
});

router.get('/grants', async (req, res) => {
  try {
    const grants = await zadaoService.getGrants({
      status: req.query.status,
      search: req.query.search,
      category: req.query.category
    });

    res.render('grants', {
      title: 'Grants — ZAScout DAO',
      grants,
      filters: {
        status: req.query.status || '',
        search: req.query.search || '',
        category: req.query.category || ''
      },
      error: null
    });
  } catch (err) {
    res.render('grants', {
      title: 'Grants — ZAScout DAO',
      grants: [],
      filters: {},
      error: 'Unable to load grants. Please try again.'
    });
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = await zadaoService.getEvents({
      status: req.query.status,
      search: req.query.search,
      category: req.query.category
    });

    res.render('events', {
      title: 'Events — ZAScout DAO',
      events,
      filters: {
        status: req.query.status || '',
        search: req.query.search || '',
        category: req.query.category || ''
      },
      error: null
    });
  } catch (err) {
    res.render('events', {
      title: 'Events — ZAScout DAO',
      events: [],
      filters: {},
      error: 'Unable to load events. Please try again.'
    });
  }
});

router.get('/ai-scout', (req, res) => {
  res.render('ai-scout', { title: 'AI Scout — ZAScout DAO' });
});

router.get('/bookmarks', (req, res) => {
  res.render('bookmarks', { title: 'Bookmarks — ZAScout DAO' }); // Wait, do I have a bookmarks view? I need one.
});

router.get('/reputation', (req, res) => {
  res.render('reputation', { title: 'Reputation' });
});

router.get('/mcp', (req, res) => {
  res.render('mcp', { title: 'MCP' });
});

router.get('/opportunities', (req, res) => {
  res.redirect('/bounties');
});

module.exports = router;
