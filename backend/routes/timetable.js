const express = require('express');
const router = express.Router();
const { runAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/timetable
router.get('/', async (req, res) => {
  try {
    const rows = await allAsync(`
      SELECT day, time_slot, subject, room, slot_type 
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

    // Group into structured frontend format
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timetableMap = {};
    daysOrder.forEach(d => { timetableMap[d] = { day: d, periods: {} }; });

    for (const r of rows) {
      if (!timetableMap[r.day]) {
        timetableMap[r.day] = { day: r.day, periods: {} };
      }
      timetableMap[r.day].periods[r.time_slot] = {
        subject: r.subject,
        room: r.room,
        type: r.slot_type
      };
    }

    const timetable = daysOrder.map(d => timetableMap[d]);
    res.json({ success: true, timetable });
  } catch (err) {
    console.error('Timetable get error:', err);
    res.status(500).json({ success: false, message: 'Database error fetching timetable.' });
  }
});

// POST /api/timetable/slot (Strict Admin Only)
router.post('/slot', authenticate, requireAdmin, async (req, res) => {
  const { day, time, subject, room, type } = req.body;

  if (!day || !time || !subject) {
    return res.status(400).json({ success: false, message: 'Day, Time, and Subject are required.' });
  }

  try {
    await runAsync(`
      INSERT INTO timetable (day, time_slot, subject, room, slot_type, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(day, time_slot) DO UPDATE SET
        subject = excluded.subject,
        room = excluded.room,
        slot_type = excluded.slot_type,
        updated_at = CURRENT_TIMESTAMP
    `, [day, time, subject.trim(), room ? room.trim() : '203', type || 'm']);

    res.json({ success: true, message: `Updated ${day} ${time} to ${subject}.` });
  } catch (err) {
    console.error('Timetable update error:', err);
    res.status(500).json({ success: false, message: 'Database error updating timetable slot.' });
  }
});

// POST /api/timetable/reset (Strict Admin Only)
router.post('/reset', authenticate, requireAdmin, async (req, res) => {
  try {
    await runAsync(`DELETE FROM timetable`);
    const { seedInitialData } = require('../config/database');
    // Call seed logic to restore official defaults
    const dbModule = require('../config/database');
    await dbModule.initDatabase();
    res.json({ success: true, message: 'Timetable reset to official IIIT-NR default schedule in SQLite.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error resetting timetable.' });
  }
});

module.exports = router;
