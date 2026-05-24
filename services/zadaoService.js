const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_SECONDS) || 300 });

function validateConfig() {
  const baseUrl = process.env.ZADAO_API_BASE_URL;
  const apiKey = process.env.ZADAO_API_KEY;

  if (!baseUrl || !/^https?:\/\//.test(baseUrl)) {
    console.error('\n[ZADao] ERROR: ZADAO_API_BASE_URL is missing or malformed. Please set a valid URL (e.g. https://zeroauthoritydao.com/api) in your environment variables.\n');
  }
  
  if (!apiKey || apiKey.trim() === '') {
    console.error('\n[ZADao] ERROR: ZADAO_API_KEY is missing or malformed. Please set your API key in the environment variables.\n');
  }
}

validateConfig();

const rawBaseUrl = process.env.ZADAO_API_BASE_URL || 'https://zeroauthoritydao.com/api';
let cleanBaseUrl = rawBaseUrl;
if (typeof cleanBaseUrl === 'string') {
  cleanBaseUrl = cleanBaseUrl.replace(/^ZADAO_API_BASE_URL=/, '').replace(/^['"]|['"]$/g, '').trim().replace(/\/+$/, '');
}

const zadaoClient = axios.create({
  baseURL: cleanBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(process.env.ZADAO_API_KEY ? { 'Authorization': `Bearer ${process.env.ZADAO_API_KEY}` } : { 'Authorization': 'Bearer za_1a77fc60f98dafd7993383ddacce5bc3769e4db86c53fca1df1d108344cf1244' })
  }
});

// Request interceptor — log outgoing
zadaoClient.interceptors.request.use(req => {
  console.log(`[ZADao] → ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
  return req;
});

// Response interceptor — log + normalise
zadaoClient.interceptors.response.use(
  res => {
    console.log(`[ZADao] ← ${res.status} ${res.config.url}`);
    return res;
  },
  async err => {
    const { config, response } = err;
    // Retry once on 5xx or network error
    if (config && !config.__retried && (!response || response.status >= 500)) {
      config.__retried = true;
      console.warn(`[ZADao] Retrying ${config.url}...`);
      await new Promise(r => setTimeout(r, 1000));
      return zadaoClient(config);
    }
    return Promise.reject(err);
  }
);

// Generic cached fetch
async function fetchResource(endpoint, params = {}) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    console.log(`[ZADao] Cache HIT ${cacheKey}`);
    return cached;
  }
  
  try {
    const res = await zadaoClient.get(endpoint, { params });
    // Normalise response — ZA DAO may wrap in { data: [...] } or return array directly
    const data = Array.isArray(res.data) 
      ? res.data 
      : res.data?.data || res.data?.results || res.data?.items || res.data || [];
      
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;
    console.error(`[ZADao] ERROR ${endpoint}: ${status} — ${message}`);
    throw new Error(`ZA DAO API error (${status || 'network'}): ${message}`);
  }
}

// — Specific resource fetchers —
async function getQuests(filters = {}) {
  return fetchResource('/quests', filters);
}

async function getEvents(filters = {}) {
  return fetchResource('/events', filters);
}

async function getGigs(filters = {}) {
  return fetchResource('/gigs', filters);
}

async function getGrants(filters = {}) {
  return fetchResource('/grants', filters);
}

async function getBounties(filters = {}) {
  return fetchResource('/bounties', filters);
}

async function getResourceById(resource, id) {
  return fetchResource(`/${resource}/${id}`);
}

// Health check for the ZA DAO API
async function pingAPI() {
  try {
    const res = await zadaoClient.get('/health', { timeout: 5000 });
    return { ok: true, status: res.status };
  } catch {
    return { ok: false };
  }
}

function clearCache() {
  cache.flushAll();
}

module.exports = {
  fetchResource,
  getQuests,
  getEvents,
  getGigs,
  getGrants,
  getBounties,
  getResourceById,
  pingAPI,
  clearCache,
  cache
};
