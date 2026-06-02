require('dotenv').config({ override: true });

// Fix malformed environment variables where key is duplicated, e.g., MONGODB_URI=MONGODB_URI=...
for (const key in process.env) {
  if (typeof process.env[key] === 'string' && process.env[key].startsWith(`${key}=`)) {
    process.env[key] = process.env[key].substring(key.length + 1).trim();
  }
}

// Validate required environment variables before anything else
const requiredEnvVars = ['GEMINI_API_KEY'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('Create a .env file based on .env.example');
}

// Ensure default defaults:
if (!process.env.ZADAO_API_BASE_URL) {
  process.env.ZADAO_API_BASE_URL = 'https://zeroauthoritydao.com/api';
}

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const viewRoutes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & performance middleware ─────────────────────────────────────────

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://zeroauthoritydao.com"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(compression());

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGIN || '*' 
    : '*'
}));

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// ── Template engine ───────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    code: 404,
    message: "The page you're looking for doesn't exist."
  });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Database & start ──────────────────────────────────────────────────────────
async function start() {
  try {
    await connectDB();
    if (!process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ ZAScout DAO running on port ${PORT}`);
        console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(` ZA DAO API: ${process.env.ZADAO_API_BASE_URL}`);
      });
    }
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
}

start();

module.exports = app;
