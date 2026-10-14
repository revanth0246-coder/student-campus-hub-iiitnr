const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// GET /api/notifications
router.get('/', async (req, res) => {
  const roll = (req.query.roll || '24DSAI001').toUpperCase();

  try {
    const notifications = await allAsync(`
      SELECT 
        id, user_roll as userRoll, type, title, message, link_view as linkView,
        is_read as isRead, strftime('%d-%m %H:%M', created_at) as timeStr,
        created_at as createdAt
      FROM notifications
      WHERE user_roll IS NULL OR user_roll = ? OR user_roll = 'ALL'
      ORDER BY id DESC
      LIMIT 30
    `, [roll]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Database error fetching notifications.' });
  }
});

// PUT /api/notifications/:id/read (Mark one as read)
router.put('/:id/read', async (req, res) => {
  try {
    await runAsync(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    console.error('Error marking notification read:', err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// POST /api/notifications/read-all (Mark all as read)
router.post('/read-all', async (req, res) => {
  const roll = (req.body.roll || '24DSAI001').toUpperCase();

  try {
    await runAsync(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE user_roll IS NULL OR user_roll = ? OR user_roll = 'ALL'
    `, [roll]);

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// POST /api/notifications (Create notification broadcast)
router.post('/', authenticate, async (req, res) => {
  const { userRoll, type, title, message, linkView } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  try {
    await runAsync(`
      INSERT INTO notifications (user_roll, type, title, message, link_view)
      VALUES (?, ?, ?, ?, ?)
    `, [
      userRoll ? userRoll.toUpperCase() : null,
      type || 'info',
      title.trim(),
      message.trim(),
      linkView || 'dashboard'
    ]);

    res.status(201).json({ success: true, message: 'Notification created successfully in SQLite.' });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

module.exports = router;
