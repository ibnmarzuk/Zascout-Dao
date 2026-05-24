const zadaoService = require('../services/zadaoService');
const geminiService = require('../services/geminiService');
const SearchHistory = require('../models/SearchHistory');

async function discover(req, res) {
  const { prompt, walletAddress } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Prompt must be at least 3 characters'
    });
  }

  if (prompt.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Prompt must be under 500 characters'
    });
  }

  try {
    // Fetch live data in parallel
    const [quests, events, gigs, grants, bounties] = await Promise.allSettled([
      zadaoService.getQuests(),
      zadaoService.getEvents(),
      zadaoService.getGigs(),
      zadaoService.getGrants(),
      zadaoService.getBounties()
    ]);

    const liveData = {
      quests: quests.status === 'fulfilled' ? quests.value : [],
      events: events.status === 'fulfilled' ? events.value : [],
      gigs: gigs.status === 'fulfilled' ? gigs.value : [],
      grants: grants.status === 'fulfilled' ? grants.value : [],
      bounties: bounties.status === 'fulfilled' ? bounties.value : []
    };

    const result = await geminiService.discoverOpportunities(prompt.trim(), liveData);

    // Persist to MongoDB
    try {
      await SearchHistory.create({
        prompt: prompt.trim(),
        walletAddress: walletAddress || null,
        resultCount: result.data?.matches?.length || 0,
        success: result.success
      });
    } catch (dbErr) {
      // Non-fatal — log and continue
      console.warn('[AIController] Failed to save search history:', dbErr.message);
    }

    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      // Return fallback with 200 so frontend can handle gracefully
      res.json({
        success: true,
        data: result.fallback,
        warning: result.error
      });
    }

  } catch (err) {
    console.error('[AIController] discover error:', err.message);
    res.status(500).json({
      success: false,
      error: 'AI Scout encountered an error. Please try again.',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

module.exports = { discover };
