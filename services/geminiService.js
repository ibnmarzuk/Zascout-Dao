const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash'; // For the new SDK

/**
 * Match user intent to real opportunities using live ZA DAO data
 * @param {string} userPrompt - What the user is looking for
 * @param {Object} liveData - { quests, events, gigs, grants } from ZA DAO
 * @returns {Object} structured AI response
 */
async function discoverOpportunities(userPrompt, liveData) {
  const opportunitySummary = buildOpportunitySummary(liveData);

  const systemPrompt = `You are ZA Scout, an intelligent opportunity discovery agent for the Zero Authority DAO ecosystem.

Your job is to analyze a contributor's request and match them to real, live opportunities from the Zero Authority DAO platform.

You ONLY recommend opportunities that exist in the provided live data. Never invent or fabricate opportunities.

Response format — always return ONLY valid JSON, no markdown:
{
  "intent": "brief description of what the user wants",
  "matches": [
    {
      "type": "quest|gig|grant|event|bounty",
      "id": "the actual ID from live data",
      "title": "exact title from live data",
      "reason": "why this matches the user's request",
      "relevanceScore": 0.0-1.0,
      "action": "direct action URL or link if available"
    }
  ],
  "summary": "2-3 sentence summary of the top recommendations",
  "missingSkills": ["skill1", "skill2"],
  "nextSteps": ["step1", "step2"]
}

Live Zero Authority DAO Opportunities:
${opportunitySummary}`;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: `User request: "${userPrompt}"`,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    const rawText = response.text || '';
    
    // Strip markdown code fences if present
    const cleanJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    // Validate structure
    if (!parsed.matches || !Array.isArray(parsed.matches)) {
      throw new Error('Invalid AI response structure');
    }

    // Sort by relevance
    parsed.matches.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return { success: true, data: parsed };
  } catch (err) {
    console.error('[GeminiService] Error:', err.message);
    return {
      success: false,
      error: 'AI Scout temporarily unavailable',
      fallback: buildKeywordFallback(userPrompt, liveData)
    };
  }
}

function buildOpportunitySummary(liveData) {
  const sections = [];

  const formatList = (items, type) => {
    if (!items?.length) return `No ${type}s currently available.`;
    return items.slice(0, 15).map(item => 
      `[${type.toUpperCase()}] ID:${item.id || item._id || '?'} | ` +
      `Title: ${item.title || item.name || 'Untitled'} | ` +
      `${item.reward ? `Reward: ${item.reward}` : ''} ` +
      `${item.description ? `| Desc: ${String(item.description).slice(0, 100)}` : ''}`
    ).join('\n');
  };

  if (liveData.quests) sections.push(`QUESTS:\n${formatList(liveData.quests, 'quest')}`);
  if (liveData.gigs) sections.push(`GIGS:\n${formatList(liveData.gigs, 'gig')}`);
  if (liveData.grants) sections.push(`GRANTS:\n${formatList(liveData.grants, 'grant')}`);
  if (liveData.events) sections.push(`EVENTS:\n${formatList(liveData.events, 'event')}`);
  if (liveData.bounties) sections.push(`BOUNTIES:\n${formatList(liveData.bounties, 'bounty')}`);

  return sections.join('\n\n') || 'No opportunities currently available.';
}

// Keyword fallback when Gemini is unavailable
function buildKeywordFallback(userPrompt, liveData) {
  const keywords = userPrompt.toLowerCase().split(/\s+/);
  const all = [
    ...(liveData.quests || []).map(i => ({ ...i, _type: 'quest' })),
    ...(liveData.gigs || []).map(i => ({ ...i, _type: 'gig' })),
    ...(liveData.grants || []).map(i => ({ ...i, _type: 'grant' })),
    ...(liveData.events || []).map(i => ({ ...i, _type: 'event' })),
    ...(liveData.bounties || []).map(i => ({ ...i, _type: 'bounty' }))
  ];

  const matches = all.filter(item => {
    const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
    return keywords.some(kw => kw.length > 3 && text.includes(kw));
  }).slice(0, 5).map(item => ({
    type: item._type,
    id: item.id || item._id,
    title: item.title || item.name,
    reason: 'Keyword match (AI Scout unavailable)',
    relevanceScore: 0.5
  }));

  return { intent: userPrompt, matches, summary: 'Keyword-based results (AI offline)', nextSteps: [] };
}

module.exports = { discoverOpportunities };
