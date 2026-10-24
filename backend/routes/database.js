const express = require('express');
const router = express.Router();
const { getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const TABLE_NAMES = [
  'users',
  'timetable',
  'resources',
  'resource_bookmarks',
  'resource_reports',
  'assignments',
  'assignment_completions',
  'exams',
  'mess_menu',
  'mess_feedback',
  'marketplace_listings',
  'marketplace_inquiries',
  'events',
  'event_registrations',
  'announcements',
  'notifications',
  'sessions'
];

// Database metadata routes are restricted to College Administration
router.use(authenticate, requireAdmin);

// GET /api/database/stats (Table row counts)
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

    res.json({
      success: true,
      engine: 'PostgreSQL (pg client pool)',
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
      try {
        const countRow = await getAsync(`SELECT COUNT(*) as c FROM ${name}`);
        tableData.push({
          name,
          rowCount: countRow ? countRow.c : 0
        });
      } catch (e) {}
    }
    res.json({ success: true, tables: tableData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving table metadata.' });
  }
});

// GET /api/database/table/:name (Read-only row viewer for admin)
router.get('/table/:name', async (req, res) => {
  const tableName = req.params.name.toLowerCase();
  if (!TABLE_NAMES.includes(tableName)) {
    return res.status(400).json({ success: false, message: 'Invalid table name.' });
  }

  try {
    let sql = `SELECT * FROM ${tableName} LIMIT 100`;
    if (tableName === 'users') {
      sql = `SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, department, designation, avatar, created_at FROM users LIMIT 100`;
    }
    const rows = await allAsync(sql);
    res.json({ success: true, table: tableName, count: rows.length, rows });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error retrieving data from table ${tableName}.` });
  }
});

module.exports = router;
