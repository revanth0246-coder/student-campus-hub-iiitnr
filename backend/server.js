const path = require('path');
const express = require('express');
const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Serve frontend static files when running standalone Express server
const frontendDir = path.join(__dirname, '..');
app.use(express.static(frontendDir));

// SPA fallback for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Start standalone HTTP listener only when NOT running as a Vercel serverless function
if (!process.env.VERCEL) {
  const server = app.listen(PORT, HOST, () => {
    console.log(`\n======================================================`);
    console.log(`🎓 IIIT-NR Student Campus Hub - Enterprise Backend`);
    console.log(`======================================================`);
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`📡 Health Check URL   : http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });

  initDatabase().catch(err => {
    console.error('Database initialization notice:', err.message);
  });
}

module.exports = app;
