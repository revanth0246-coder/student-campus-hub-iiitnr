const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// GET /api/mess (Full 7-day schedule)
router.get('/', async (req, res) => {
  try {
    const rows = await allAsync(`SELECT * FROM mess_menu ORDER BY id ASC`);
    
    // Sort logically by days of the week
    rows.sort((a, b) => DAYS_ORDER.indexOf(a.day_of_week) - DAYS_ORDER.indexOf(b.day_of_week));

    // Get today's day name in Indian/Local time
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[new Date().getDay()];

    res.json({
      success: true,
      today: todayName,
      menu: rows.map(r => ({
        id: r.id,
        day: r.day_of_week,
        breakfast: r.breakfast,
        lunch: r.lunch,
        snacks: r.snacks,
        dinner: r.dinner,
        note: r.special_note || '',
        updatedBy: r.updated_by || 'Mess Committee',
        updatedAt: r.updated_at
      }))
    });
  } catch (err) {
    console.error('Error fetching mess menu:', err);
    res.status(500).json({ success: false, message: 'Database error fetching mess menu.' });
  }
});

// GET /api/mess/today (Today's Menu)
router.get('/today', async (req, res) => {
  try {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[new Date().getDay()];

    const row = await getAsync(`SELECT * FROM mess_menu WHERE day_of_week = ?`, [todayName]);
    if (!row) {
      return res.status(404).json({ success: false, message: 'No menu found for today.' });
    }

    res.json({
      success: true,
      day: row.day_of_week,
      breakfast: row.breakfast,
      lunch: row.lunch,
      snacks: row.snacks,
      dinner: row.dinner,
      note: row.special_note || '',
      updatedBy: row.updated_by,
      updatedAt: row.updated_at
    });
  } catch (err) {
    console.error('Error fetching today mess menu:', err);
    res.status(500).json({ success: false, message: 'Database error fetching today menu.' });
  }
});

// PUT /api/mess/:day (Admin Only Update Menu)
router.put('/:day', authenticate, requireAdmin, async (req, res) => {
  const dayParam = req.params.day;
  const { breakfast, lunch, snacks, dinner, note } = req.body;

  // Find matching day case-insensitively
  const matchedDay = DAYS_ORDER.find(d => d.toLowerCase() === dayParam.toLowerCase());
  if (!matchedDay) {
    return res.status(400).json({ success: false, message: 'Invalid day of week.' });
  }

  const updatedBy = req.user?.name ? `Admin (${req.user.name})` : 'Hostel Mess Committee';

  try {
    await runAsync(`
      UPDATE mess_menu
      SET breakfast = COALESCE(?, breakfast),
          lunch = COALESCE(?, lunch),
          snacks = COALESCE(?, snacks),
          dinner = COALESCE(?, dinner),
          special_note = COALESCE(?, special_note),
          updated_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE day_of_week = ?
    `, [breakfast, lunch, snacks, dinner, note, updatedBy, matchedDay]);

    // Send a notification about mess menu updates
    try {
      await runAsync(`
        INSERT INTO notifications (type, title, message, link_view)
        VALUES ('mess', ?, ?, 'mess')
      `, [
        `Hostel Mess Menu Updated: ${matchedDay}`,
        `The hostel mess committee updated the meal schedule for ${matchedDay}. Check the updated dishes.`
      ]);
    } catch (ne) {}

    res.json({ success: true, message: `Mess menu for ${matchedDay} updated successfully in SQLite database.` });
  } catch (err) {
    console.error('Error updating mess menu:', err);
    res.status(500).json({ success: false, message: 'Database error updating mess menu.' });
  }
});

// POST /api/mess/feedback (Student submits rating and review)
router.post('/feedback', async (req, res) => {
  const { studentRoll, studentName, mealType, rating, comment } = req.body;

  if (!mealType || !rating) {
    return res.status(400).json({ success: false, message: 'Meal type and rating (1-5) are required.' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
  }

  try {
    await runAsync(`
      INSERT INTO mess_feedback (student_roll, student_name, meal_type, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `, [
      (studentRoll || '24DSAI001').toUpperCase(),
      studentName || 'Campus Student',
      mealType,
      numericRating,
      comment ? comment.trim() : ''
    ]);

    res.status(201).json({ success: true, message: 'Thank you! Your meal feedback has been recorded in the database.' });
  } catch (err) {
    console.error('Error submitting mess feedback:', err);
    res.status(500).json({ success: false, message: 'Database error saving feedback.' });
  }
});

// GET /api/mess/feedback (Get summary and recent reviews)
router.get('/feedback', async (req, res) => {
  try {
    const recent = await allAsync(`
      SELECT 
        id, student_roll as studentRoll, student_name as studentName,
        meal_type as mealType, rating, comment,
        strftime('%d %b %H:%M', created_at) as timestamp
      FROM mess_feedback
      ORDER BY id DESC
      LIMIT 20
    `);

    const avgRow = await getAsync(`SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews FROM mess_feedback`);

    res.json({
      success: true,
      averageRating: avgRow?.avgRating ? Number(avgRow.avgRating).toFixed(1) : '4.5',
      totalReviews: avgRow?.totalReviews || 0,
      feedback: recent
    });
  } catch (err) {
    console.error('Error retrieving mess feedback:', err);
    res.status(500).json({ success: false, message: 'Database error retrieving feedback.' });
  }
});

module.exports = router;
