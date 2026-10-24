const fs = require('fs');
const path = require('path');

console.log('======================================================');
console.log('🧪 Verifying PostgreSQL Migration Artifacts');
console.log('======================================================\n');

let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check db/schema.sql exists and has valid table definitions
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
assert(fs.existsSync(schemaPath), 'db/schema.sql file exists');

const schemaContent = fs.readFileSync(schemaPath, 'utf8');
assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS users'), 'schema.sql defines users table');
assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS timetable'), 'schema.sql defines timetable table');
assert(schemaContent.includes('SERIAL PRIMARY KEY'), 'schema.sql uses SERIAL PRIMARY KEY for auto-increment');
assert(schemaContent.includes('TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP'), 'schema.sql uses TIMESTAMPTZ timestamps');
assert(schemaContent.includes('ON DELETE CASCADE'), 'schema.sql defines foreign keys with ON DELETE CASCADE');

// Check all 17 tables are in schema.sql
const expectedTables = [
  'users', 'sessions', 'timetable', 'resources', 'assignments',
  'assignment_completions', 'announcements', 'events', 'event_registrations',
  'exams', 'mess_menu', 'mess_feedback', 'marketplace_listings',
  'marketplace_inquiries', 'resource_bookmarks', 'resource_reports', 'notifications'
];

expectedTables.forEach(t => {
  assert(
    new RegExp(`CREATE TABLE IF NOT EXISTS ${t}\\b`, 'i').test(schemaContent),
    `schema.sql contains table: ${t}`
  );
});

// 2. Check db/index.js
const indexPath = path.join(__dirname, '..', 'db', 'index.js');
assert(fs.existsSync(indexPath), 'db/index.js exists');

const indexModule = require('../db/index');
assert(typeof indexModule.query === 'function', 'db/index.js exports query function');
assert(typeof indexModule.getClient === 'function', 'db/index.js exports getClient function');
assert(typeof indexModule.initSchema === 'function', 'db/index.js exports initSchema function');
assert(Boolean(indexModule.pool), 'db/index.js exports pool instance');

// 3. Check db/seed.js
const seedPath = path.join(__dirname, '..', 'db', 'seed.js');
assert(fs.existsSync(seedPath), 'db/seed.js exists');

const seedContent = fs.readFileSync(seedPath, 'utf8');
assert(seedContent.includes('$1'), 'seed.js uses $1 parameterized queries');
assert(!/VALUES\s*\([^$)]*['"][^$)]*['"]\)/i.test(seedContent), 'seed.js has no hardcoded string literals inside VALUES (only parameterized $1, $2, ...)');
assert(seedContent.includes('bcrypt'), 'seed.js hashes admin password with bcrypt');

// 4. Check .env.example
const envExPath = path.join(__dirname, '..', '.env.example');
assert(fs.existsSync(envExPath), '.env.example file exists');
const envExContent = fs.readFileSync(envExPath, 'utf8');
assert(envExContent.includes('DATABASE_URL='), '.env.example includes DATABASE_URL');
assert(envExContent.includes('JWT_SECRET='), '.env.example includes JWT_SECRET');
assert(envExContent.includes('ADMIN_PASSWORD='), '.env.example includes ADMIN_PASSWORD');

// 5. Check .gitignore prevents leaking credentials
const gitignorePath = path.join(__dirname, '..', '.gitignore');
assert(fs.existsSync(gitignorePath), '.gitignore file exists');
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
assert(gitignoreContent.includes('.env'), '.gitignore ignores .env files');

console.log('\n======================================================');
if (failed === 0) {
  console.log('🎉 All PostgreSQL migration checks passed successfully!');
  process.exit(0);
} else {
  console.error(`⚠️ ${failed} check(s) failed.`);
  process.exit(1);
}
