const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin, requireAuth } = require('../middleware/auth');
const { validate, messFeedbackSchema, messMenuSchema } = require('../middleware/validation');
const { broadcastSync } = require('../services/realtime');

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// GET /api/mess (Full 7-day schedule)
router.get('/', async (req, res) => {
  try {
    const rows = await allAsync(`SELECT * FROM mess_menu ORDER BY id ASC`);
    rows.sort((a, b) => DAYS_ORDER.indexOf(a.day_of_week) - DAYS_ORDER.indexOf(b.day_of_week));

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

// Common handler for updating mess menu
async function handleMenuUpdate(req, res) {
  const dayParam = req.params.day;
  const { breakfast, lunch, snacks, dinner, note } = req.body;

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

    try {
      await runAsync(`
        INSERT INTO notifications (type, title, message, link_view)
        VALUES ('mess', ?, ?, 'mess')
      `, [
        `Hostel Mess Menu Updated: ${matchedDay}`,
        `The hostel mess committee updated the meal schedule for ${matchedDay}. Check the updated dishes.`
      ]);
    } catch (ne) {}

    try { broadcastSync('mess_updated', { day: matchedDay }); } catch (e) {}
    res.json({ success: true, message: `Mess menu for ${matchedDay} updated successfully.` });
  } catch (err) {
    console.error('Error updating mess menu:', err);
    res.status(500).json({ success: false, message: 'Database error updating mess menu.' });
  }
}

// PUT /api/mess/:day (Admin Only Update Menu - Server Enforced)
router.put('/:day', authenticate, requireAdmin, validate(messMenuSchema), handleMenuUpdate);
router.put('/menu/:day', authenticate, requireAdmin, validate(messMenuSchema), handleMenuUpdate);

// POST /api/mess/feedback (Student submits rating and review - Validated)
router.post('/feedback', authenticate, validate(messFeedbackSchema), async (req, res) => {
  const { studentRoll, studentName, mealType, rating, comment } = req.body;
  const roll = (req.user?.roll || studentRoll || 'STUDENT').toUpperCase();
  const name = req.user?.name || studentName || 'Campus Student';
  const numericRating = parseInt(rating, 10);

  try {
    await runAsync(`
      INSERT INTO mess_feedback (student_roll, student_name, meal_type, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `, [
      roll,
      name,
      mealType,
      numericRating,
      comment ? comment.trim() : ''
    ]);

    try { broadcastSync('mess_feedback_received', { mealType, rating: numericRating }); } catch (e) {}
    res.status(201).json({ success: true, message: 'Thank you! Your meal feedback has been recorded.' });
  } catch (err) {
    console.error('Error submitting mess feedback:', err);
    res.status(500).json({ success: false, message: 'Database error saving feedback.' });
  }
});

// GET /api/mess/feedback & GET /api/mess/reviews (Retrieve reviews)
async function handleGetFeedback(req, res) {
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
}

router.get('/feedback', handleGetFeedback);
router.get('/reviews', handleGetFeedback);

module.exports = router;
