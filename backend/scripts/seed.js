const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

async function seed() {
  if (process.env.DATABASE_URL) {
    console.log('🐘 Detected DATABASE_URL, running PostgreSQL seed...');
    const { runSeed } = require('../../db/seed');
    await runSeed();
  } else {
    console.log('💾 No DATABASE_URL detected. Initializing & seeding SQLite database...');
    const { initDatabase } = require('../config/database');
    await initDatabase();
    console.log('✅ SQLite database initialized and seeded successfully.');
  }
}

seed().catch(err => {
  console.error('❌ Seeding error:', err.message || err);
  process.exit(1);
});
