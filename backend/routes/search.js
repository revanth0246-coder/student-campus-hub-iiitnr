const express = require('express');
const router = express.Router();
const { allAsync } = require('../config/database');

// GET /api/search?q=query
router.get('/', async (req, res) => {
  const query = (req.query.q || '').trim();

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      query,
      results: {
        assignments: [],
        exams: [],
        resources: [],
        events: [],
        announcements: [],
        exchange: []
      },
      total: 0
    });
  }

  const term = `%${query}%`;

  try {
    // 1. Assignments
    const assignments = await allAsync(`
      SELECT id, title, subject, due_date as dueDate, 'assignment' as itemType, 'planner' as targetView
      FROM assignments
      WHERE title LIKE ? OR subject LIKE ? OR description LIKE ?
      LIMIT 5
    `, [term, term, term]);

    // 2. Exams
    const exams = await allAsync(`
      SELECT id, title, subject, exam_date as examDate, room, 'exam' as itemType, 'planner' as targetView
      FROM exams
      WHERE title LIKE ? OR subject LIKE ? OR syllabus LIKE ?
      LIMIT 5
    `, [term, term, term]);

    // 3. Resources
    const resources = await allAsync(`
      SELECT id, title, subject, type, link, semester, 'resource' as itemType, 'resources' as targetView
      FROM resources
      WHERE title LIKE ? OR subject LIKE ? OR description LIKE ?
      LIMIT 5
    `, [term, term, term]);

    // 4. Events
    const events = await allAsync(`
      SELECT id, title, date_str as date, venue, category, 'event' as itemType, 'events' as targetView
      FROM events
      WHERE title LIKE ? OR venue LIKE ? OR description LIKE ? OR category LIKE ?
      LIMIT 5
    `, [term, term, term, term]);

    // 5. Announcements
    const announcements = await allAsync(`
      SELECT id, title, category, date_str as date, 'announcement' as itemType, 'announcements' as targetView
      FROM announcements
      WHERE title LIKE ? OR body LIKE ? OR category LIKE ?
      LIMIT 5
    `, [term, term, term]);

    // 6. Campus Exchange
    const exchange = await allAsync(`
      SELECT id, title, type, category, price, location, 'exchange' as itemType, 'exchange' as targetView
      FROM marketplace_listings
      WHERE status = 'active' AND (title LIKE ? OR description LIKE ? OR category LIKE ? OR location LIKE ?)
      LIMIT 5
    `, [term, term, term, term]);

    const total = assignments.length + exams.length + resources.length + events.length + announcements.length + exchange.length;

    res.json({
      success: true,
      query,
      results: {
        assignments,
        exams,
        resources,
        events,
        announcements,
        exchange
      },
      total
    });
  } catch (err) {
    console.error('Global search error:', err);
    res.status(500).json({ success: false, message: 'Database search error.' });
  }
});

module.exports = router;
