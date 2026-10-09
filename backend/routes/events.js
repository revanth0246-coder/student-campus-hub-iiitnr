const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/events
router.get('/', async (req, res) => {
  const roll = (req.query.roll || '').toUpperCase();

  try {
    const events = await allAsync(`
      SELECT 
        id, title, date_str as date, venue, category, 
        description as desc, badge_color as badgeColor, banner, 
        created_by as createdBy, created_at as createdAt
      FROM events 
      ORDER BY created_at DESC
    `);

    // Attach registered boolean
    for (const ev of events) {
      if (roll) {
        const reg = await getAsync(`
          SELECT id FROM event_registrations 
          WHERE event_id = ? AND student_roll = ?
        `, [ev.id, roll]);
        ev.registered = !!reg;
      } else {
        ev.registered = false;
      }
    }

    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error fetching events.' });
  }
});

// POST /api/events (Admin Only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { title, date, venue, category, desc, badgeColor, banner } = req.body;

  if (!title || !date || !venue) {
    return res.status(400).json({ success: false, message: 'Title, Date, and Venue are required.' });
  }

  const id = 'ev_' + Date.now();
  const createdBy = req.user?.name ? `Admin (${req.user.name})` : 'Office of Academic Affairs';

  try {
    await runAsync(`
      INSERT INTO events (id, title, date_str, venue, category, description, badge_color, banner, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title.trim(),
      date.trim(),
      venue.trim(),
      category || 'Hackathon',
      desc ? desc.trim() : 'Official campus event for IIIT-NR students.',
      badgeColor || 'bg-indigo-600',
      banner || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
      createdBy
    ]);

    const created = {
      id,
      title: title.trim(),
      date: date.trim(),
      venue: venue.trim(),
      category: category || 'Hackathon',
      desc: desc ? desc.trim() : 'Official campus event for IIIT-NR students.',
      badgeColor: badgeColor || 'bg-indigo-600',
      banner: banner || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
      createdBy,
      registered: false,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({ success: true, message: 'Campus event published to SQLite.', event: created });
  } catch (err) {
    console.error('Event publish error:', err);
    res.status(500).json({ success: false, message: 'Database error creating event.' });
  }
});

// DELETE /api/events/:id (Admin Only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM events WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.json({ success: true, message: 'Event deleted successfully from SQLite.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error deleting event.' });
  }
});

// POST /api/events/:id/toggle-register (Student)
router.post('/:id/toggle-register', async (req, res) => {
  const eventId = req.params.id;
  const roll = (req.body.roll || '24DSAI001').toUpperCase();

  try {
    const existing = await getAsync(`
      SELECT id FROM event_registrations 
      WHERE event_id = ? AND student_roll = ?
    `, [eventId, roll]);

    let registered = false;
    if (existing) {
      await runAsync(`DELETE FROM event_registrations WHERE event_id = ? AND student_roll = ?`, [eventId, roll]);
      registered = false;
    } else {
      await runAsync(`INSERT INTO event_registrations (event_id, student_roll) VALUES (?, ?)`, [eventId, roll]);
      registered = true;
    }

    res.json({
      success: true,
      message: registered ? 'Successfully registered for event!' : 'Registration cancelled.',
      registered
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error toggling event registration.' });
  }
});

module.exports = router;
