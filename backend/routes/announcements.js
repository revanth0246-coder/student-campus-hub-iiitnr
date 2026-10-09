const express = require('express');
const router = express.Router();
const { runAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await allAsync(`
      SELECT 
        id, title, body, category, urgent, author, 
        COALESCE(date_str, strftime('%d %b %Y', created_at)) as date
      FROM announcements 
      ORDER BY urgent DESC, created_at DESC
    `);
    res.json({ success: true, announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error fetching announcements.' });
  }
});

// POST /api/announcements (Admin Only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { title, body, category, urgent, author, date } = req.body;

  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required.' });
  }

  const id = 'ann_' + Date.now();
  const dateStr = date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const authorName = author || (req.user?.name ? `Admin (${req.user.name})` : 'Dean Academic Office');
  const isUrgent = urgent === true || category === 'Exams' ? 1 : 0;

  try {
    await runAsync(`
      INSERT INTO announcements (id, title, body, category, urgent, author, date_str)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, title.trim(), body.trim(), category || 'Academic', isUrgent, authorName, dateStr]);

    const created = {
      id,
      title: title.trim(),
      body: body.trim(),
      category: category || 'Academic',
      urgent: isUrgent === 1,
      author: authorName,
      date: dateStr
    };

    res.status(201).json({ success: true, message: 'Official announcement published to SQLite.', announcement: created });
  } catch (err) {
    console.error('Announcement error:', err);
    res.status(500).json({ success: false, message: 'Database error creating announcement.' });
  }
});

// DELETE /api/announcements/:id (Admin Only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM announcements WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }
    res.json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error deleting announcement.' });
  }
});

module.exports = router;
