const { broadcastSync } = require('../services/realtime');
const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin, requireAuth } = require('../middleware/auth');
const { validate, assignmentSchema } = require('../middleware/validation');

// GET /api/assignments
router.get('/', async (req, res) => {
  const { status, priority, subject, search, roll } = req.query;

  try {
    let sql = `
      SELECT 
        id, subject, title, due_date as dueDate, faculty,
        priority, status, description, student_id as studentId,
        is_broadcast as isBroadcast, created_at as createdAt
      FROM assignments 
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      sql += ` AND status = ?`;
      params.push(status);
    }

    if (priority && priority !== 'All') {
      sql += ` AND priority = ?`;
      params.push(priority);
    }

    if (subject && subject !== 'All Subjects') {
      sql += ` AND subject LIKE ?`;
      params.push(`%${subject}%`);
    }

    if (search && search.trim()) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR subject LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY due_date ASC, created_at DESC`;

    const assignments = await allAsync(sql, params);

    // Fetch completions for student checklist
    for (const a of assignments) {
      const completions = await allAsync(`
        SELECT student_roll FROM assignment_completions WHERE assignment_id = ?
      `, [a.id]);
      a.completedBy = completions.map(c => c.student_roll);
      if (roll) {
        a.isCompleted = a.completedBy.includes(roll.toUpperCase()) || a.status === 'Completed';
      }
    }

    res.json({ success: true, assignments });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ success: false, message: 'Database error fetching assignments.' });
  }
});

// POST /api/assignments (Admin Broadcast Assignment - Server Enforced)
router.post('/', authenticate, requireAdmin, validate(assignmentSchema), async (req, res) => {
  const { subject, title, dueDate, due_date, priority, status, description, faculty } = req.body;
  const targetDueDate = (dueDate || due_date).trim();
  const id = 'asgn_' + Date.now();
  const creatorName = faculty || (req.user?.name ? `Admin (${req.user.name})` : 'Office of Academic Affairs');
  const initialPriority = priority || 'Medium';
  const initialStatus = status || 'Pending';

  try {
    await runAsync(`
      INSERT INTO assignments (id, subject, title, due_date, faculty, priority, status, description, student_id, is_broadcast)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 1)
    `, [
      id,
      subject.trim(),
      title.trim(),
      targetDueDate,
      creatorName,
      initialPriority,
      initialStatus,
      description ? description.trim() : ''
    ]);

    // Send broadcast notification to students
    try {
      await runAsync(`
        INSERT INTO notifications (type, title, message, link_view)
        VALUES ('academic', ?, ?, 'assignments')
      `, [
        `New Assignment: ${title.trim()}`,
        `A new ${subject.trim()} assignment has been published. Due date: ${targetDueDate}.`
      ]);
    } catch (ne) {}

    const created = {
      id,
      subject: subject.trim(),
      title: title.trim(),
      dueDate: targetDueDate,
      priority: initialPriority,
      status: initialStatus,
      description: description ? description.trim() : '',
      faculty: creatorName,
      isBroadcast: 1,
      completedBy: []
    };

    try { broadcastSync('assignments_updated', { assignment: created }); } catch (e) {}
    res.status(201).json({ success: true, message: 'Assignment created successfully.', assignment: created });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ success: false, message: 'Database error creating assignment.' });
  }
});

// PUT /api/assignments/:id (Admin Only Update - Server Enforced)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { subject, title, dueDate, due_date, priority, status, description } = req.body;
  const assignmentId = req.params.id;
  const targetDueDate = dueDate || due_date;

  try {
    const existing = await getAsync(`SELECT * FROM assignments WHERE id = ?`, [assignmentId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    await runAsync(`
      UPDATE assignments 
      SET subject = COALESCE(?, subject),
          title = COALESCE(?, title),
          due_date = COALESCE(?, due_date),
          priority = COALESCE(?, priority),
          status = COALESCE(?, status),
          description = COALESCE(?, description)
      WHERE id = ?
    `, [
      subject ? subject.trim() : null,
      title ? title.trim() : null,
      targetDueDate ? targetDueDate.trim() : null,
      priority || null,
      status || null,
      description !== undefined ? description.trim() : null,
      assignmentId
    ]);

    try { broadcastSync('assignments_updated', { id: assignmentId }); } catch (e) {}
    res.json({ success: true, message: 'Assignment updated successfully.' });
  } catch (err) {
    console.error('Assignment update error:', err);
    res.status(500).json({ success: false, message: 'Database error updating assignment.' });
  }
});

// DELETE /api/assignments/:id (Admin Only Delete - Server Enforced)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const assignmentId = req.params.id;

  try {
    const result = await runAsync(`DELETE FROM assignments WHERE id = ?`, [assignmentId]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }
    await runAsync(`DELETE FROM assignment_completions WHERE assignment_id = ?`, [assignmentId]);
    try { broadcastSync('assignments_updated', { id: assignmentId, removed: true }); } catch (e) {}
    res.json({ success: true, message: 'Assignment deleted successfully.' });
  } catch (err) {
    console.error('Assignment delete error:', err);
    res.status(500).json({ success: false, message: 'Database error deleting assignment.' });
  }
});

// POST /api/assignments/:id/toggle-completion (Student Checklist Toggle)
router.post('/:id/toggle-completion', authenticate, requireAuth, async (req, res) => {
  const assignmentId = req.params.id;
  const roll = (req.body.studentRoll || req.user?.roll || '').trim().toUpperCase();

  if (!roll) {
    return res.status(400).json({ success: false, message: 'Student roll number is required.' });
  }

  try {
    const existing = await getAsync(`
      SELECT id FROM assignment_completions 
      WHERE assignment_id = ? AND student_roll = ?
    `, [assignmentId, roll]);

    if (existing) {
      await runAsync(`
        DELETE FROM assignment_completions 
        WHERE assignment_id = ? AND student_roll = ?
      `, [assignmentId, roll]);

      try { broadcastSync('assignment_completion_changed', { assignmentId, studentRoll: roll, completed: false }); } catch (e) {}
      res.json({ success: true, completed: false, message: 'Marked as incomplete.' });
    } else {
      await runAsync(`
        INSERT INTO assignment_completions (assignment_id, student_roll)
        VALUES (?, ?)
      `, [assignmentId, roll]);

      try { broadcastSync('assignment_completion_changed', { assignmentId, studentRoll: roll, completed: true }); } catch (e) {}
      res.json({ success: true, completed: true, message: 'Marked as completed.' });
    }
  } catch (err) {
    console.error('Completion toggle error:', err);
    res.status(500).json({ success: false, message: 'Database error toggling completion status.' });
  }
});

module.exports = router;
