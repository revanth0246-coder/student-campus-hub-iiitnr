const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await allAsync(`
      SELECT 
        id, subject, title, due_date as dueDate, faculty, 
        is_broadcast as isBroadcast, 'admin' as createdRole
      FROM assignments 
      ORDER BY created_at DESC
    `);

    // Fetch completions for each assignment
    for (const a of assignments) {
      const completions = await allAsync(`
        SELECT student_roll FROM assignment_completions WHERE assignment_id = ?
      `, [a.id]);
      a.completedBy = completions.map(c => c.student_roll);
    }

    res.json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error fetching assignments.' });
  }
});

// POST /api/assignments (Admin Only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { subject, title, dueDate, faculty } = req.body;

  if (!subject || !title || !dueDate) {
    return res.status(400).json({ success: false, message: 'Subject, Title, and Due Date are required.' });
  }

  const id = 'asgn_' + Date.now();
  const createdBy = faculty || (req.user?.name ? `Admin (${req.user.name})` : 'Dean Academic Affairs');

  try {
    await runAsync(`
      INSERT INTO assignments (id, subject, title, due_date, faculty, is_broadcast)
      VALUES (?, ?, ?, ?, ?, 1)
    `, [id, subject.trim(), title.trim(), dueDate, createdBy]);

    const created = {
      id,
      subject: subject.trim(),
      title: title.trim(),
      dueDate,
      isBroadcast: true,
      createdBy,
      createdRole: 'admin',
      completedBy: []
    };

    res.status(201).json({ success: true, message: 'Assignment broadcasted to all students via SQLite.', assignment: created });
  } catch (err) {
    console.error('Assignment error:', err);
    res.status(500).json({ success: false, message: 'Database error creating assignment.' });
  }
});

// DELETE /api/assignments/:id (Admin Only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM assignments WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found in database.' });
    }
    res.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error deleting assignment.' });
  }
});

// POST /api/assignments/:id/toggle-completion (Student Checklist)
router.post('/:id/toggle-completion', async (req, res) => {
  const { roll } = req.body;
  const assignmentId = req.params.id;

  if (!roll) {
    return res.status(400).json({ success: false, message: 'Student roll number is required.' });
  }

  const cleanRoll = roll.trim().toUpperCase();

  try {
    const existing = await getAsync(`
      SELECT id FROM assignment_completions 
      WHERE assignment_id = ? AND student_roll = ?
    `, [assignmentId, cleanRoll]);

    let isCompleted = false;
    if (existing) {
      await runAsync(`
        DELETE FROM assignment_completions 
        WHERE assignment_id = ? AND student_roll = ?
      `, [assignmentId, cleanRoll]);
      isCompleted = false;
    } else {
      await runAsync(`
        INSERT INTO assignment_completions (assignment_id, student_roll)
        VALUES (?, ?)
      `, [assignmentId, cleanRoll]);
      isCompleted = true;
    }

    res.json({
      success: true,
      message: isCompleted ? 'Assignment marked as completed!' : 'Assignment marked as pending.',
      isCompleted
    });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ success: false, message: 'Database error updating completion status.' });
  }
});

module.exports = router;
