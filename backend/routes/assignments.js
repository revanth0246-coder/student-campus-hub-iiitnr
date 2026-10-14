const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate } = require('../middleware/auth');

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

// POST /api/assignments (Create assignment by Student or Admin)
router.post('/', authenticate, async (req, res) => {
  const { subject, title, dueDate, priority, status, description, faculty } = req.body;

  if (!subject || !title || !dueDate) {
    return res.status(400).json({ success: false, message: 'Subject, Title, and Due Date are required.' });
  }

  const id = 'asgn_' + Date.now();
  const isAdmin = req.user?.role === 'admin';
  const creatorName = req.user?.name || req.body.faculty || (isAdmin ? 'Office of Academic Affairs' : 'Student');
  const studentId = isAdmin ? null : (req.user?.roll || req.body.studentRoll || 'student');
  const isBroadcast = isAdmin ? 1 : 0;
  const initialPriority = priority || 'Medium';
  const initialStatus = status || 'Pending';

  try {
    await runAsync(`
      INSERT INTO assignments (id, subject, title, due_date, faculty, priority, status, description, student_id, is_broadcast)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      subject.trim(),
      title.trim(),
      dueDate.trim(),
      creatorName,
      initialPriority,
      initialStatus,
      description ? description.trim() : '',
      studentId,
      isBroadcast
    ]);

    // If admin broadcasted, add notification
    if (isAdmin) {
      try {
        await runAsync(`
          INSERT INTO notifications (type, title, message, link_view)
          VALUES ('assignment', ?, ?, 'planner')
        `, [
          `New Assignment: ${subject.trim()}`,
          `"${title.trim()}" due on ${dueDate.trim()}. Priority: ${initialPriority}.`
        ]);
      } catch (ne) {}
    }

    const created = {
      id,
      subject: subject.trim(),
      title: title.trim(),
      dueDate: dueDate.trim(),
      priority: initialPriority,
      status: initialStatus,
      description: description ? description.trim() : '',
      faculty: creatorName,
      studentId,
      isBroadcast: !!isBroadcast,
      completedBy: []
    };

    res.status(201).json({ success: true, message: 'Assignment added successfully.', assignment: created });
  } catch (err) {
    console.error('Assignment creation error:', err);
    res.status(500).json({ success: false, message: 'Database error creating assignment.' });
  }
});

// PUT /api/assignments/:id (Edit assignment)
router.put('/:id', authenticate, async (req, res) => {
  const { subject, title, dueDate, priority, status, description } = req.body;
  const assignmentId = req.params.id;

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
      dueDate ? dueDate.trim() : null,
      priority || null,
      status || null,
      description !== undefined ? description.trim() : null,
      assignmentId
    ]);

    res.json({ success: true, message: 'Assignment updated successfully.' });
  } catch (err) {
    console.error('Assignment update error:', err);
    res.status(500).json({ success: false, message: 'Database error updating assignment.' });
  }
});

// PUT /api/assignments/:id/status (Fast status toggle)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const assignmentId = req.params.id;

  if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Valid status required: Pending, In Progress, Completed.' });
  }

  try {
    await runAsync(`UPDATE assignments SET status = ? WHERE id = ?`, [status, assignmentId]);
    res.json({ success: true, message: `Status updated to ${status}.` });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ success: false, message: 'Database error updating status.' });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', authenticate, async (req, res) => {
  const assignmentId = req.params.id;

  try {
    const existing = await getAsync(`SELECT title FROM assignments WHERE id = ?`, [assignmentId]);
    const result = await runAsync(`DELETE FROM assignments WHERE id = ?`, [assignmentId]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }
    await runAsync(`DELETE FROM assignment_completions WHERE assignment_id = ?`, [assignmentId]);
    if (existing && existing.title) {
      await runAsync(`DELETE FROM notifications WHERE message LIKE ?`, [`%"${existing.title}"%`]);
    }
    res.json({ success: true, message: 'Assignment removed successfully.' });
  } catch (err) {
    console.error('Delete assignment error:', err);
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
      message: isCompleted ? 'Marked as completed!' : 'Marked as pending.',
      isCompleted
    });
  } catch (err) {
    console.error('Toggle completion error:', err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

module.exports = router;
