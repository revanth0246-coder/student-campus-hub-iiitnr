const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ WARNING: DATABASE_URL is not set in environment variables or .env file.');
}

// Configure PostgreSQL connection pool with SSL support for Neon/Render/Supabase
const isLocalhost = connectionString ? (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) : true;

const pool = new Pool({
  connectionString,
  ssl: (!isLocalhost && connectionString) ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool client error:', err.message);
});

/**
 * Execute a parameterized SQL query ($1, $2, ...)
 * @param {string} text - SQL query text with $1, $2 placeholders
 * @param {Array} [params] - Parameter values array
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SQL) {
    console.log('⚡ Executed Query:', { text: text.trim().substring(0, 100), duration, rows: res.rowCount });
  }
  return res;
}

/**
 * Acquire a single client from the pool (for transactions)
 */
async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Initialize PostgreSQL tables from db/schema.sql
 */
async function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schemaSql);
  console.log('✅ PostgreSQL schema initialized successfully.');
}

module.exports = {
  pool,
  query,
  getClient,
  initSchema
};
