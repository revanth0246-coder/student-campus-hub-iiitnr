const express = require('express');
const router = express.Router();
const { runAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/resources
router.get('/', async (req, res) => {
  try {
    const resources = await allAsync(`
      SELECT 
        id, subject, title, type, semester, link, description, 
        contributor, notes_count as notesCount, papers_count as papersCount,
        strftime('%d %b %Y', created_at) as date
      FROM resources 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error fetching resources.' });
  }
});

// POST /api/resources (Admin Only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { subject, title, type, semester, link, description, authorName } = req.body;

  if (!subject || !title || !link) {
    return res.status(400).json({ success: false, message: 'Subject, Title, and Link are required.' });
  }

  const id = 'res_' + Date.now();
  const notesCount = Math.floor(Math.random() * 8) + 8;
  const papersCount = Math.floor(Math.random() * 5) + 3;
  const contributor = authorName || (req.user?.name ? `Admin (${req.user.name})` : 'Admin / Academic Affairs');

  try {
    await runAsync(`
      INSERT INTO resources (id, subject, title, type, semester, link, description, contributor, notes_count, papers_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      subject.trim(),
      title.trim(),
      type || 'Notes',
      semester || 'Sem 1',
      link.trim(),
      description ? description.trim() : 'Official study notes for IIIT-NR students.',
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
      link: link.trim(),
      description: description ? description.trim() : 'Official study notes for IIIT-NR students.',
      contributor,
      notesCount,
      papersCount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    res.status(201).json({ success: true, message: 'Study material uploaded successfully to SQLite.', resource: created });
  } catch (err) {
    console.error('Resource upload error:', err);
    res.status(500).json({ success: false, message: 'Database error creating resource.' });
  }
});

// DELETE /api/resources/:id (Admin Only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
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
