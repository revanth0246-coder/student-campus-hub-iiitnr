const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { runAsync, getAsync, allAsync, db, seedInitialData } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const DB_PATH = path.join(__dirname, '..', 'database', 'campus_hub.sqlite');

const TABLE_NAMES = [
  'users',
  'timetable',
  'resources',
  'assignments',
  'assignment_completions',
  'announcements',
  'events',
  'event_registrations',
  'sessions'
];

// All database inspection & SQL execution routes are strictly restricted to College Administration
router.use(authenticate, requireAdmin);

// GET /api/database/stats (Overall statistics - Admin Only)
router.get('/stats', async (req, res) => {
  try {
    const stats = {};
    for (const name of TABLE_NAMES) {
      try {
        const row = await getAsync(`SELECT COUNT(*) as count FROM ${name}`);
        stats[name] = row ? row.count : 0;
      } catch (e) {
        stats[name] = 0;
      }
    }

    let fileSizeKB = 0;
    if (fs.existsSync(DB_PATH)) {
      const fileStat = fs.statSync(DB_PATH);
      fileSizeKB = (fileStat.size / 1024).toFixed(1);
    }

    res.json({
      success: true,
      engine: 'SQLite 3',
      dbFile: 'backend/database/campus_hub.sqlite',
      fileSizeKB: `${fileSizeKB} KB`,
      totalTables: TABLE_NAMES.length,
      tableCounts: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving database statistics.' });
  }
});

// GET /api/database/tables (Metadata & schema info)
router.get('/tables', async (req, res) => {
  try {
    const tableData = [];
    for (const name of TABLE_NAMES) {
      const cols = await allAsync(`PRAGMA table_info(${name})`);
      const countRow = await getAsync(`SELECT COUNT(*) as c FROM ${name}`);
      tableData.push({
        name,
        rowCount: countRow ? countRow.c : 0,
        columns: cols.map(c => ({ name: c.name, type: c.type, pk: !!c.pk, notnull: !!c.notnull }))
      });
    }
    res.json({ success: true, tables: tableData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving table metadata.' });
  }
});

// GET /api/database/table/:name (Rows of a specific table)
router.get('/table/:name', async (req, res) => {
  const tableName = req.params.name.toLowerCase();
  if (!TABLE_NAMES.includes(tableName)) {
    return res.status(400).json({ success: false, message: 'Invalid table name.' });
  }

  try {
    let sql = `SELECT * FROM ${tableName}`;
    if (tableName === 'users') {
      sql = `SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, department, designation, avatar, created_at FROM users`;
    }
    const rows = await allAsync(sql);
    res.json({ success: true, table: tableName, count: rows.length, rows });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error retrieving data from table ${tableName}.` });
  }
});

// POST /api/database/query (SQL Query Console - Admin Only)
router.post('/query', authenticate, requireAdmin, async (req, res) => {
  const { sql } = req.body;
  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ success: false, message: 'SQL query string is required.' });
  }

  const trimmed = sql.trim();
  const isSelect = /^SELECT\b/i.test(trimmed) || /^PRAGMA\b/i.test(trimmed);

  try {
    if (isSelect) {
      const rows = await allAsync(trimmed);
      res.json({ success: true, type: 'SELECT', rowCount: rows.length, rows });
    } else {
      const result = await runAsync(trimmed);
      res.json({ success: true, type: 'MUTATION', changes: result.changes, lastID: result.lastID });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/database/export (Full Database Dump)
router.get('/export', async (req, res) => {
  try {
    const dump = {
      timestamp: new Date().toISOString(),
      engine: 'SQLite 3',
      tables: {}
    };

    for (const name of TABLE_NAMES) {
      if (name === 'users') {
        dump.tables[name] = await allAsync(`SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, department, designation, avatar, created_at FROM users`);
      } else {
        dump.tables[name] = await allAsync(`SELECT * FROM ${name}`);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="iiitnr_campus_hub_db_export.json"');
    res.send(JSON.stringify(dump, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database export failed.' });
  }
});

// POST /api/database/reset (Re-seed Database - Admin Only)
router.post('/reset', authenticate, requireAdmin, async (req, res) => {
  try {
    for (const name of TABLE_NAMES) {
      await runAsync(`DELETE FROM ${name}`);
    }
    await seedInitialData();
    res.json({ success: true, message: 'SQLite database reset to official default state.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database reset error.' });
  }
});

module.exports = router;
