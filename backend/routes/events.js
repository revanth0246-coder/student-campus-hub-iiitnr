const { broadcastSync } = require('../services/realtime');
const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin, requireAuth } = require('../middleware/auth');
const { validate, eventSchema } = require('../middleware/validation');
const { uploadImage } = require('../config/cloudinary');

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

// POST /api/events (Admin Only - Server Enforced)
router.post('/', authenticate, requireAdmin, validate(eventSchema), async (req, res) => {
  const { title, date, date_str, venue, category, desc, description, badgeColor, banner } = req.body;
  const targetDate = (date || date_str).trim();
  const id = 'ev_' + Date.now();
  const createdBy = req.user?.name ? `Admin (${req.user.name})` : 'Office of Academic Affairs';

  try {
    let finalBanner = banner || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80';
    if (finalBanner && finalBanner.startsWith('data:image')) {
      const uploadRes = await uploadImage(finalBanner, { folder: 'iiitnr-campus-hub/events' });
      if (uploadRes?.url) finalBanner = uploadRes.url;
    }

    await runAsync(`
      INSERT INTO events (id, title, date_str, venue, category, description, badge_color, banner, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title.trim(),
      targetDate,
      venue.trim(),
      category || 'Hackathon',
      desc || description ? (desc || description).trim() : 'Official campus event for IIIT-NR students.',
      badgeColor || 'bg-indigo-600',
      finalBanner,
      createdBy
    ]);

    const created = {
      id,
      title: title.trim(),
      date: targetDate,
      venue: venue.trim(),
      category: category || 'Hackathon',
      desc: desc || description ? (desc || description).trim() : 'Official campus event for IIIT-NR students.',
      badgeColor: badgeColor || 'bg-indigo-600',
      banner: banner || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
      createdBy,
      registered: false,
      createdAt: new Date().toISOString()
    };

    try { broadcastSync('events_updated', { event: created }); } catch (e) {}
    res.status(201).json({ success: true, message: 'Campus event published.', event: created });
  } catch (err) {
    console.error('Event publish error:', err);
    res.status(500).json({ success: false, message: 'Database error creating event.' });
  }
});

// DELETE /api/events/:id (Admin Only - Server Enforced)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM events WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    await runAsync(`DELETE FROM event_registrations WHERE event_id = ?`, [req.params.id]);
    try { broadcastSync('events_updated', { id: req.params.id, removed: true }); } catch (e) {}
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error deleting event.' });
  }
});

// POST /api/events/:id/toggle-register (Authenticated Student RSVP Toggle)
router.post('/:id/toggle-register', authenticate, requireAuth, async (req, res) => {
  const eventId = req.params.id;
  const roll = (req.body.studentRoll || req.user?.roll || '').trim().toUpperCase();

  if (!roll) {
    return res.status(400).json({ success: false, message: 'Student roll number required.' });
  }

  try {
    const existing = await getAsync(`
      SELECT id FROM event_registrations WHERE event_id = ? AND student_roll = ?
    `, [eventId, roll]);

    if (existing) {
      await runAsync(`
        DELETE FROM event_registrations WHERE event_id = ? AND student_roll = ?
      `, [eventId, roll]);
      try { broadcastSync('event_registration_changed', { eventId, studentRoll: roll, registered: false }); } catch (e) {}
      res.json({ success: true, registered: false, message: 'Event registration cancelled.' });
    } else {
      await runAsync(`
        INSERT INTO event_registrations (event_id, student_roll) VALUES (?, ?)
      `, [eventId, roll]);
      try { broadcastSync('event_registration_changed', { eventId, studentRoll: roll, registered: true }); } catch (e) {}
      res.json({ success: true, registered: true, message: 'Registered for event successfully!' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating event registration.' });
  }
});

module.exports = router;
