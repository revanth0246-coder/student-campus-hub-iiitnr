const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

let activePool = null;

/**
 * Acquire or initialize the active PostgreSQL Pool.
 * If DATABASE_URL is set, connects to PostgreSQL / Neon with SSL.
 * If DATABASE_URL is not set and running in test mode, initializes an in-memory pg-mem pool.
 */
function getPool() {
  if (activePool) return activePool;

  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    activePool = new Pool({
      connectionString,
      ssl: (!isLocalhost && connectionString) ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    activePool.on('error', (err) => {
      console.error('❌ Unexpected PostgreSQL pool error:', err.message);
    });
    console.log('🐘 PostgreSQL pool active from DATABASE_URL');
    return activePool;
  }

  // Pure in-memory PostgreSQL engine for automated test runs without external DB dependency
  if (process.env.NODE_ENV === 'test' || !process.env.VERCEL) {
    try {
      process.env.NOCHECKFULLQUERYUSAGE = 'true';
      const { newDb, DataType } = require('pg-mem');
      const memDb = newDb();
      try {
        memDb.public.registerFunction({
          name: 'strftime',
          args: [DataType.text, DataType.timestamp],
          returns: DataType.text,
          implementation: (fmt, d) => (d ? new Date(d).toISOString() : '')
        });
      } catch (fErr) {}
      const memPg = memDb.adapters.createPg();
      activePool = new memPg.Pool();
      console.log('🧠 In-memory PostgreSQL engine active (pg-mem)');
      return activePool;
    } catch (e) {
      console.warn('pg-mem not available:', e.message);
    }
  }

  throw new Error('PostgreSQL configuration error: process.env.DATABASE_URL is not configured.');
}

/**
 * Convert SQLite ? placeholders and SQLite-specific datetime syntax to PostgreSQL ($1, $2, CURRENT_TIMESTAMP)
 */
function convertSqliteToPg(sql) {
  let index = 1;
  let converted = sql.replace(/\?/g, () => `$${index++}`);
  converted = converted.replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP');
  converted = converted.replace(/datetime\('now',\s*'\+30 days'\)/gi, "CURRENT_TIMESTAMP + INTERVAL '30 days'");
  converted = converted.replace(/strftime\([^)]*,\s*created_at\)/gi, 'created_at');
  return converted;
}

/**
 * Execute raw SQL query with parameters ($1, $2, ...)
 */
async function query(sql, params = []) {
  const pool = getPool();
  return pool.query(sql, params);
}

/**
 * Execute INSERT, UPDATE, DELETE with ? or $1 placeholders
 */
async function runAsync(sql, params = []) {
  const pool = getPool();
  const pgSql = convertSqliteToPg(sql);
  const res = await pool.query(pgSql, params);
  return {
    lastID: res.rows[0]?.id || null,
    changes: res.rowCount
  };
}

/**
 * Execute SELECT and return the first row or null
 */
async function getAsync(sql, params = []) {
  const pool = getPool();
  const pgSql = convertSqliteToPg(sql);
  const res = await pool.query(pgSql, params);
  return res.rows[0] || null;
}

/**
 * Execute SELECT and return array of all matching rows
 */
async function allAsync(sql, params = []) {
  const pool = getPool();
  const pgSql = convertSqliteToPg(sql);
  const res = await pool.query(pgSql, params);
  return res.rows || [];
}

/**
 * Password hashing helpers
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_iiitnr_salt_2026').digest('hex');
}

function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (e) {
      return false;
    }
  }
  return hashPassword(password) === hash;
}

/**
 * Initialize PostgreSQL Schema and seed initial data if empty
 */
async function initDatabase() {
  const pool = getPool();
  console.log('🐘 Initializing PostgreSQL database via db/schema.sql...');
  
  const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
  }

  // Check if admin account exists
  let adminCheck = null;
  try {
    adminCheck = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  } catch (err) {
    adminCheck = { rowCount: 0 };
  }

  if (!adminCheck || adminCheck.rowCount === 0) {
    console.log('🌱 Seeding PostgreSQL database via db/seed.js...');
    const { runSeed } = require('../../db/seed');
    await runSeed(pool);
  } else {
    // Ensure primary admin credentials match revanth0246@gmail.com and password revanth0406
    try {
      const primaryAdmin = await pool.query("SELECT id FROM users WHERE email = 'revanth0246@gmail.com' LIMIT 1");
      const newAdminHash = bcrypt.hashSync('revanth0406', 10);
      if (primaryAdmin.rowCount === 0) {
        const oldAdmin = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        if (oldAdmin.rowCount > 0) {
          await pool.query(
            "UPDATE users SET name = 'Revanth', email = 'revanth0246@gmail.com', password_hash = $1 WHERE id = $2",
            [newAdminHash, oldAdmin.rows[0].id]
          );
        }
      } else {
        await pool.query(
          "UPDATE users SET password_hash = $1 WHERE id = $2",
          [newAdminHash, primaryAdmin.rows[0].id]
        );
      }
    } catch (e) {}
  }
}

module.exports = {
  getPool,
  query,
  runAsync,
  getAsync,
  allAsync,
  initDatabase,
  hashPassword,
  verifyPassword
};
