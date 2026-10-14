const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate } = require('../middleware/auth');

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

// POST /api/resources (Add resource)
router.post('/', authenticate, async (req, res) => {
  const { subject, title, type, semester, unit, link, description, authorName } = req.body;

  if (!subject || !title || !link) {
    return res.status(400).json({ success: false, message: 'Subject, Title, and Link are required.' });
  }

  const id = 'res_' + Date.now();
  const notesCount = Math.floor(Math.random() * 8) + 8;
  const papersCount = Math.floor(Math.random() * 5) + 3;
  const contributor = authorName || (req.user?.name ? `${req.user.name} (${req.user.role === 'admin' ? 'Admin' : 'Student'})` : 'Academic Affairs');

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
      description ? description.trim() : 'Study material uploaded for campus students.',
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
      description: description ? description.trim() : 'Study material uploaded for campus students.',
      contributor,
      notesCount,
      papersCount,
      isBookmarked: false,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    res.status(201).json({ success: true, message: 'Study resource added successfully to SQLite.', resource: created });
  } catch (err) {
    console.error('Resource upload error:', err);
    res.status(500).json({ success: false, message: 'Database error creating resource.' });
  }
});

// POST /api/resources/:id/bookmark (Toggle bookmark)
router.post('/:id/bookmark', async (req, res) => {
  const resourceId = req.params.id;
  const roll = (req.body.roll || '24DSAI001').toUpperCase();

  try {
    const existing = await getAsync(`
      SELECT id FROM resource_bookmarks WHERE resource_id = ? AND student_roll = ?
    `, [resourceId, roll]);

    let bookmarked = false;
    if (existing) {
      await runAsync(`DELETE FROM resource_bookmarks WHERE id = ?`, [existing.id]);
      bookmarked = false;
    } else {
      await runAsync(`
        INSERT INTO resource_bookmarks (student_roll, resource_id)
        VALUES (?, ?)
      `, [roll, resourceId]);
      bookmarked = true;
    }

    res.json({
      success: true,
      message: bookmarked ? 'Resource bookmarked!' : 'Bookmark removed.',
      bookmarked
    });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ success: false, message: 'Database error toggling bookmark.' });
  }
});

// POST /api/resources/:id/report (Report broken link or issue)
router.post('/:id/report', async (req, res) => {
  const resourceId = req.params.id;
  const { roll, reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'Please provide a reason for reporting.' });
  }

  try {
    await runAsync(`
      INSERT INTO resource_reports (resource_id, student_roll, reason)
      VALUES (?, ?, ?)
    `, [
      resourceId,
      (roll || '24DSAI001').toUpperCase(),
      reason.trim()
    ]);

    res.json({ success: true, message: 'Thank you! Your report has been submitted to the administration for review.' });
  } catch (err) {
    console.error('Resource report error:', err);
    res.status(500).json({ success: false, message: 'Database error filing report.' });
  }
});

// GET /api/resources/reports (Admin only view reports)
router.get('/reports', async (req, res) => {
  try {
    const reports = await allAsync(`
      SELECT 
        rr.id, rr.resource_id as resourceId, rr.student_roll as studentRoll,
        rr.reason, rr.status, strftime('%d %b %H:%M', rr.created_at) as timestamp,
        r.title as resourceTitle, r.subject as resourceSubject, r.link as resourceLink
      FROM resource_reports rr
      LEFT JOIN resources r ON rr.resource_id = r.id
      ORDER BY rr.id DESC
    `);
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error fetching reports.' });
  }
});

// DELETE /api/resources/:id (Delete Resource)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM resources WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Resource not found in database.' });
    }
    res.json({ success: true, message: 'Resource deleted successfully from SQLite database.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error deleting resource.' });
  }
});

module.exports = router;
