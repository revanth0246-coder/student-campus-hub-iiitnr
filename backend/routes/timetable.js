const express = require('express');
const router = express.Router();
const { runAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const OFFICIAL_BRANCHES = [
  'Data Science & AI',
  'Computer Science & Engineering',
  'Electronics & Communication'
];

// Helper to construct empty 5-day template
function createEmptyDaysMap() {
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const map = {};
  daysOrder.forEach(d => { map[d] = { day: d, periods: {} }; });
  return { daysOrder, map };
}

// GET /api/timetable
// Query param: ?branch=Data Science & AI | Computer Science & Engineering | Electronics & Communication
router.get('/', async (req, res) => {
  try {
    const requestedBranch = (req.query.branch || 'Data Science & AI').trim();

    const rows = await allAsync(`
      SELECT branch, day, time_slot, subject, room, slot_type 
      FROM timetable 
      ORDER BY 
        CASE day 
          WHEN 'Monday' THEN 1 
          WHEN 'Tuesday' THEN 2 
          WHEN 'Wednesday' THEN 3 
          WHEN 'Thursday' THEN 4 
          WHEN 'Friday' THEN 5 
          ELSE 6 
        END, id ASC
    `);

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Build branch-specific maps
    const branchTables = {};
    OFFICIAL_BRANCHES.forEach(b => {
      const map = {};
      daysOrder.forEach(d => { map[d] = { day: d, periods: {} }; });
      branchTables[b] = map;
    });

    for (const r of rows) {
      const b = r.branch || 'Data Science & AI';
      if (!branchTables[b]) {
        branchTables[b] = {};
        daysOrder.forEach(d => { branchTables[b][d] = { day: d, periods: {} }; });
      }
      if (!branchTables[b][r.day]) {
        branchTables[b][r.day] = { day: r.day, periods: {} };
      }
      branchTables[b][r.day].periods[r.time_slot] = {
        subject: r.subject,
        room: r.room,
        type: r.slot_type
      };
    }

    const branchesOutput = {};
    OFFICIAL_BRANCHES.forEach(b => {
      branchesOutput[b] = daysOrder.map(d => branchTables[b][d]);
    });

    // Fallback if requested branch is slightly different casing
    const matchedBranch = OFFICIAL_BRANCHES.find(b => b.toLowerCase() === requestedBranch.toLowerCase()) || 'Data Science & AI';
    const activeTimetable = branchesOutput[matchedBranch] || daysOrder.map(d => branchTables['Data Science & AI'][d]);

    res.json({ 
      success: true, 
      branch: matchedBranch,
      timetable: activeTimetable, 
      branches: branchesOutput 
    });
  } catch (err) {
    console.error('Timetable get error:', err);
    res.status(500).json({ success: false, message: 'Database error fetching timetable.' });
  }
});

// POST /api/timetable/slot (Strict Admin Only)
router.post('/slot', authenticate, requireAdmin, async (req, res) => {
  const { branch, day, time, subject, room, type } = req.body;
  const targetBranch = (branch || 'Data Science & AI').trim();

  if (!day || !time || !subject) {
    return res.status(400).json({ success: false, message: 'Day, Time, and Subject are required.' });
  }

  const defaultRoom = targetBranch.includes('Computer') ? '201' : (targetBranch.includes('Electronics') ? '205' : '203');

  try {
    await runAsync(`
      INSERT INTO timetable (branch, day, time_slot, subject, room, slot_type, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(branch, day, time_slot) DO UPDATE SET
        subject = excluded.subject,
        room = excluded.room,
        slot_type = excluded.slot_type,
        updated_at = CURRENT_TIMESTAMP
    `, [targetBranch, day, time, subject.trim(), room ? room.trim() : defaultRoom, type || 'm']);

    res.json({ success: true, message: `Updated ${targetBranch} [${day} ${time}] to ${subject}.` });
  } catch (err) {
    console.error('Timetable update error:', err);
    res.status(500).json({ success: false, message: 'Database error updating timetable slot.' });
  }
});

// POST /api/timetable/reset (Strict Admin Only)
router.post('/reset', authenticate, requireAdmin, async (req, res) => {
  try {
    const { branch } = req.body || {};
    if (branch) {
      await runAsync(`DELETE FROM timetable WHERE branch = ?`, [branch.trim()]);
    } else {
      await runAsync(`DELETE FROM timetable`);
    }
    const dbModule = require('../config/database');
    await dbModule.initDatabase();
    res.json({ success: true, message: 'Timetable reset to official IIIT-NR default schedules in SQLite.' });
  } catch (err) {
    console.error('Timetable reset error:', err);
    res.status(500).json({ success: false, message: 'Database error resetting timetable.' });
  }
});

module.exports = router;
