const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { query } = require('./config/database');

const app = express();

// Helmet Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration (Allow configured FRONTEND_URL, localhost, and Vercel domains)
const allowedOrigins = process.env.FRONTEND_URL
  ? [
      process.env.FRONTEND_URL.replace(/\/$/, ''),
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://localhost:5500',
      'http://127.0.0.1:5500'
    ]
  : '*';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins === '*' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow any vercel.app preview URL if FRONTEND_URL is set
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-user-role', 'x-user-roll']
}));

// Private Network Access (PNA) header support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * GET /api/health and GET /health
 * Requirement 5: Returns {"status":"ok","db":"connected"} after a SELECT 1
 */
const healthHandler = async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({
      status: 'ok',
      db: 'connected',
      uptime: process.uptime()
    });
  } catch (err) {
    console.error('Health check database query error:', err.message);
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      error: err.message
    });
  }
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Real-Time Server-Sent Events (SSE) Engine
const { initRealtime } = require('./services/realtime');
initRealtime(app);

// Mount all routes on both /api/<route> and /<route> for seamless routing on Vercel & Express
const routeMap = [
  ['/auth', require('./routes/auth')],
  ['/users', require('./routes/users')],
  ['/timetable', require('./routes/timetable')],
  ['/resources', require('./routes/resources')],
  ['/assignments', require('./routes/assignments')],
  ['/exams', require('./routes/exams')],
  ['/mess', require('./routes/mess')],
  ['/exchange', require('./routes/exchange')],
  ['/announcements', require('./routes/announcements')],
  ['/events', require('./routes/events')],
  ['/notifications', require('./routes/notifications')],
  ['/search', require('./routes/search')],
  ['/database', require('./routes/database')]
];

routeMap.forEach(([routePath, routerModule]) => {
  app.use('/api' + routePath, routerModule);
  app.use(routePath, routerModule);
});

// Root /api info
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    service: 'IIIT-NR Student Campus Hub Full-Stack API',
    engine: 'PostgreSQL (pg client pool)'
  });
});

module.exports = app;
