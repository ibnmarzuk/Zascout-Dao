require('dotenv').config();
const axios = require('axios');
const BASE = process.env.ZADAO_API_BASE_URL || 'https://zeroauthoritydao.com/api';
const endpoints = ['/quests', '/events', '/gigs', '/grants', '/bounties', '/health'];

async function testAll() {
  console.log(`Testing ZA DAO API: ${BASE}\n`);
  for (const ep of endpoints) {
    try {
      const res = await axios.get(`${BASE}${ep}`, {
        timeout: 8000,
        headers: process.env.ZADAO_API_KEY
          ? { Authorization: `Bearer ${process.env.ZADAO_API_KEY}` }
          : { Authorization: `Bearer za_1a77fc60f98dafd7993383ddacce5bc3769e4db86c53fca1df1d108344cf1244` }
      });
      const count = Array.isArray(res.data) ? res.data.length
        : res.data?.data?.length || res.data?.results?.length || '?';
      const items = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.results || []);
      console.log(`✅ ${ep} — ${res.status} — ${count} items. Sample keys:`, items[0] ? Object.keys(items[0]).join(', ') : 'none');
    } catch (err) {
      console.log(`❌ ${ep} — ${err.response?.status || 'ERR'} — ${err.message}`);
    }
  }
}
testAll();
