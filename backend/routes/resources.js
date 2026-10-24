const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin, requireAuth } = require('../middleware/auth');
const { validate, resourceSchema } = require('../middleware/validation');
const { broadcastSync } = require('../services/realtime');

// GET /api/resources (Filter & Search)
router.get('/', async (req, res) => {
  const { subject, semester, unit, type, search, roll, bookmarkedOnly } = req.query;
  const cleanRoll = roll ? roll.trim().toUpperCase() : null;

  try {
    let sql = `
      SELECT 
        id, subject, title, type, semester, unit, link, description, 
        contributor, notes_count as notesCount, papers_count as papersCount,
        strftime('%d %b %Y', created_at) as date,
        created_at as createdAt
      FROM resources 
      WHERE 1=1
    `;
    const params = [];

    if (subject && subject !== 'All Subjects') {
      sql += ` AND subject LIKE ?`;
      params.push(`%${subject}%`);
    }

    if (semester && semester !== 'All Semesters') {
      sql += ` AND semester = ?`;
      params.push(semester);
    }

    if (unit && unit !== 'All Units') {
      sql += ` AND unit = ?`;
      params.push(unit);
    }

    if (type && type !== 'All Types') {
      sql += ` AND type = ?`;
      params.push(type);
    }

    if (search && search.trim()) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR subject LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY created_at DESC`;

    let resources = await allAsync(sql, params);

    // Attach bookmark info if student roll is provided
    if (cleanRoll) {
      const bookmarks = await allAsync(`
        SELECT resource_id FROM resource_bookmarks WHERE student_roll = ?
      `, [cleanRoll]);
      const bookmarkSet = new Set(bookmarks.map(b => b.resource_id));

      resources = resources.map(r => ({
        ...r,
        isBookmarked: bookmarkSet.has(r.id)
      }));

      if (bookmarkedOnly === 'true' || bookmarkedOnly === '1') {
        resources = resources.filter(r => r.isBookmarked);
      }
    } else {
      resources = resources.map(r => ({ ...r, isBookmarked: false }));
    }

    res.json({ success: true, resources });
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ success: false, message: 'Database error fetching resources.' });
  }
});

// POST /api/resources (Admin-Only Study Material Creation - Server Enforced)
router.post('/', authenticate, requireAdmin, validate(resourceSchema), async (req, res) => {
  const { subject, title, type, semester, unit, link, description, authorName } = req.body;

  const id = 'res_' + Date.now();
  const notesCount = Math.floor(Math.random() * 8) + 8;
  const papersCount = Math.floor(Math.random() * 5) + 3;
  const contributor = authorName || (req.user?.name ? `${req.user.name} (Admin)` : 'Academic Affairs');

  try {
    await runAsync(`
      INSERT INTO resources (id, subject, title, type, semester, unit, link, description, contributor, notes_count, papers_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      subject.trim(),
      title.trim(),
      type || 'Notes',
      semester || 'Sem 1',
      unit || 'Unit 1-4',
      link.trim(),
      description ? description.trim() : '',
      contributor,
      notesCount,
      papersCount
    ]);

    const created = {
      id,
      subject: subject.trim(),
      title: title.trim(),
      type: type || 'Notes',
      semester: semester || 'Sem 1',
      unit: unit || 'Unit 1-4',
      link: link.trim(),
      description: description ? description.trim() : '',
      contributor,
      notesCount,
      papersCount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isBookmarked: false
    };

    try { broadcastSync('resources_updated', { resource: created }); } catch (e) {}
    res.status(201).json({ success: true, message: 'Resource added successfully.', resource: created });
  } catch (err) {
    console.error('Error adding resource:', err);
    res.status(500).json({ success: false, message: 'Database error adding resource.' });
  }
});

// POST /api/resources/:id/bookmark (Toggle bookmark - Authenticated User)
router.post('/:id/bookmark', authenticate, requireAuth, async (req, res) => {
  const resourceId = req.params.id;
  const roll = (req.body.studentRoll || req.user?.roll || '').trim().toUpperCase();

  if (!roll) {
    return res.status(400).json({ success: false, message: 'Student roll number is required to bookmark.' });
  }

  try {
    const existing = await getAsync(`
      SELECT id FROM resource_bookmarks WHERE student_roll = ? AND resource_id = ?
    `, [roll, resourceId]);

    if (existing) {
      await runAsync(`
        DELETE FROM resource_bookmarks WHERE student_roll = ? AND resource_id = ?
      `, [roll, resourceId]);
      return res.json({ success: true, bookmarked: false, message: 'Bookmark removed.' });
    } else {
      await runAsync(`
        INSERT INTO resource_bookmarks (student_roll, resource_id) VALUES (?, ?)
      `, [roll, resourceId]);
      return res.json({ success: true, bookmarked: true, message: 'Resource bookmarked.' });
    }
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    res.status(500).json({ success: false, message: 'Database error toggling bookmark.' });
  }
});

// POST /api/resources/:id/report (Report broken link or inaccuracy)
router.post('/:id/report', authenticate, requireAuth, async (req, res) => {
  const resourceId = req.params.id;
  const { reason, studentRoll } = req.body;
  const roll = (studentRoll || req.user?.roll || 'ANONYMOUS').trim().toUpperCase();

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Please provide a reason for reporting.' });
  }

  try {
    await runAsync(`
      INSERT INTO resource_reports (resource_id, student_roll, reason, status)
      VALUES (?, ?, ?, 'pending')
    `, [resourceId, roll, reason.trim()]);

    res.json({ success: true, message: 'Thank you. Your report has been submitted to the academic team for review.' });
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ success: false, message: 'Database error submitting report.' });
  }
});

// DELETE /api/resources/:id (Admin Only - Server Enforced)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM resources WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }
    await runAsync(`DELETE FROM resource_bookmarks WHERE resource_id = ?`, [req.params.id]);
    await runAsync(`DELETE FROM resource_reports WHERE resource_id = ?`, [req.params.id]);
    try { broadcastSync('resources_updated', { id: req.params.id, removed: true }); } catch (e) {}
    res.json({ success: true, message: 'Resource deleted successfully.' });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ success: false, message: 'Database error deleting resource.' });
  }
});

module.exports = router;
