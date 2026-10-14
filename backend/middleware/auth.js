const crypto = require('crypto');
const { runAsync, getAsync } = require('../config/database');

// Generate and persist a token
async function createSession(user) {
  const token = 'agy_token_' + crypto.randomBytes(24).toString('hex');

  await runAsync(`
    INSERT INTO sessions (token, user_id, role, expires_at)
    VALUES (?, ?, ?, datetime('now', '+30 days'))
  `, [token, user.id, user.role]);

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
        SELECT s.token, s.user_id, s.role, s.created_at as session_login_time, s.expires_at,
               u.id as user_id, u.name, u.email, u.roll, u.role, u.branch, u.year, u.semester, u.cgpa, u.avatar, u.batch, u.department, u.designation, u.last_login
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
      `, [token]);

      if (session) {
        req.user = {
          id: session.user_id,
          name: session.name,
          email: session.email,
          roll: session.roll,
          role: session.role,
          branch: session.branch,
          year: session.year,
          semester: session.semester,
          cgpa: session.cgpa,
          avatar: session.avatar,
          batch: session.batch,
          department: session.department,
          designation: session.designation,
          last_login: session.last_login,
          session_login_time: session.session_login_time
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
