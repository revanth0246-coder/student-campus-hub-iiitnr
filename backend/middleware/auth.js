const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { runAsync, getAsync } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'iiitnr_campus_hub_jwt_secret_key_2026';

/**
 * Generate a cryptographically signed JWT token for a user
 * @param {object} user 
 * @returns {string} JWT Token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    roll: user.roll || null,
    email: user.email,
    role: user.role || 'student',
    name: user.name,
    branch: user.branch || null
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  });
}

/**
 * Create a persistent session and return signed JWT
 * @param {object} user 
 * @returns {Promise<string>} JWT Token
 */
async function createSession(user) {
  const token = generateToken(user);

  try {
    // Record session in database for tracking/auditing (replace if identical token already exists)
    await runAsync(`
      INSERT OR REPLACE INTO sessions (token, user_id, role, expires_at)
      VALUES (?, ?, ?, datetime('now', '+7 days'))
    `, [token, user.id, user.role || 'student']);
  } catch (err) {
    // Non-blocking in case sessions table has constraints during migration
    console.warn('Session record note:', err.message);
  }

  return token;
}

/**
 * JWT Authentication Middleware
 * Validates Bearer token from Authorization header.
 * Attaches verified payload to req.user.
 * Client header spoofing (x-user-role, adminRole) is strictly disallowed.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      roll: decoded.roll,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      branch: decoded.branch
    };
    return next();
  } catch (err) {
    // Check fallback for legacy session tokens during migration
    try {
      const session = await getAsync(`
        SELECT s.token, s.user_id, s.role, u.name, u.email, u.roll, u.branch
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
          branch: session.branch
        };
        return next();
      }
    } catch (e) {}

    req.user = null;
    return next();
  }
}

/**
 * Strict authentication guard
 * Returns 401 if user is not authenticated via a valid JWT
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in with a valid JWT Bearer token.'
    });
  }
  next();
}

/**
 * Strict Admin-only role check enforced on the SERVER
 * Returns 403 if authenticated user is not an administrator
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in with admin credentials.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: This operation is strictly restricted to College Administration.'
    });
  }

  next();
}

/**
 * Student-accessible guard (both student and admin can access)
 */
function requireStudent(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to proceed.'
    });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  generateToken,
  createSession,
  authenticate,
  requireAuth,
  requireAdmin,
  requireStudent
};
