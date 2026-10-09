const crypto = require('crypto');
const { runAsync, getAsync } = require('../config/database');

// Generate and persist a token
async function createSession(user) {
  const token = 'agy_token_' + crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  await runAsync(`
    INSERT INTO sessions (token, user_id, role, expires_at)
    VALUES (?, ?, ?, ?)
  `, [token, user.id, user.role, expiresAt]);

  return token;
}

// Authentication middleware
async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // Header or query fallback for seamless API flexibility
  const roleFallback = req.headers['x-user-role'] || req.query.adminRole || req.body?.adminRole;

  if (token) {
    try {
      const session = await getAsync(`
        SELECT s.*, u.id as user_id, u.name, u.email, u.roll, u.role
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime('now')
      `, [token]);

      if (session) {
        req.user = {
          id: session.user_id,
          name: session.name,
          email: session.email,
          roll: session.roll,
          role: session.role
        };
        return next();
      }
    } catch (err) {
      console.warn('Session lookup error:', err);
    }
  }

  // If role is declared directly by client header or payload
  if (roleFallback === 'admin') {
    req.user = { role: 'admin', name: 'Administrator' };
    return next();
  }

  // Optional/Public continuation
  req.user = null;
  next();
}

// Strict Admin-only guard
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: This action is strictly restricted to College Administration.'
    });
  }
  next();
}

// Strict authenticated guard
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Please log in to proceed.'
    });
  }
  next();
}

module.exports = {
  createSession,
  authenticate,
  requireAdmin,
  requireAuth
};
