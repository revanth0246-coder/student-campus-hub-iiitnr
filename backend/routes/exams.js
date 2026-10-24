const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate, examSchema } = require('../middleware/validation');
const { broadcastSync } = require('../services/realtime');

// GET /api/exams
router.get('/', async (req, res) => {
  try {
    const exams = await allAsync(`
      SELECT 
        id, subject, title, exam_date as examDate, exam_time as examTime,
        room, syllabus, created_by as createdBy, created_at as createdAt
      FROM exams 
      ORDER BY exam_date ASC
    `);
    res.json({ success: true, exams });
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ success: false, message: 'Database error fetching exams.' });
  }
});

// POST /api/exams (Admin Only - Server Enforced)
router.post('/', authenticate, requireAdmin, validate(examSchema), async (req, res) => {
  const { subject, title, examDate, exam_date, examTime, exam_time, room, syllabus } = req.body;
  const targetDate = (examDate || exam_date).trim();
  const targetTime = (examTime || exam_time || '10:00 AM - 01:00 PM').trim();
  const id = 'exam_' + Date.now();
  const createdBy = req.user?.name ? `Admin (${req.user.name})` : 'Academic Affairs';

  try {
    await runAsync(`
      INSERT INTO exams (id, subject, title, exam_date, exam_time, room, syllabus, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      subject.trim(),
      title.trim(),
      targetDate,
      targetTime,
      room ? room.trim() : 'Room 203',
      syllabus ? syllabus.trim() : 'Detailed syllabus on academic portal.',
      createdBy
    ]);

    // Trigger notification
    try {
      await runAsync(`
        INSERT INTO notifications (type, title, message, link_view)
        VALUES ('exam', ?, ?, 'planner')
      `, [
        `Upcoming Exam: ${subject.trim()}`,
        `Exam scheduled on ${targetDate} (${targetTime}) in ${room || 'Room 203'}.`
      ]);
    } catch (ne) {}

    const created = {
      id,
      subject: subject.trim(),
      title: title.trim(),
      examDate: targetDate,
      examTime: targetTime,
      room: room || 'Room 203',
      syllabus: syllabus || 'Detailed syllabus on academic portal.',
      createdBy
    };

    try { broadcastSync('exams_updated', { exam: created }); } catch (e) {}
    res.status(201).json({ success: true, message: 'Exam added successfully.', exam: created });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ success: false, message: 'Database error creating exam.' });
  }
});

// PUT /api/exams/:id (Admin Only - Server Enforced)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { subject, title, examDate, exam_date, examTime, exam_time, room, syllabus } = req.body;
  const examId = req.params.id;
  const targetDate = examDate || exam_date;
  const targetTime = examTime || exam_time;

  try {
    const existing = await getAsync(`SELECT * FROM exams WHERE id = ?`, [examId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    await runAsync(`
      UPDATE exams 
      SET subject = COALESCE(?, subject),
          title = COALESCE(?, title),
          exam_date = COALESCE(?, exam_date),
          exam_time = COALESCE(?, exam_time),
          room = COALESCE(?, room),
          syllabus = COALESCE(?, syllabus)
      WHERE id = ?
    `, [
      subject ? subject.trim() : null,
      title ? title.trim() : null,
      targetDate ? targetDate.trim() : null,
      targetTime ? targetTime.trim() : null,
      room ? room.trim() : null,
      syllabus ? syllabus.trim() : null,
      examId
    ]);

    try { broadcastSync('exams_updated', { id: examId }); } catch (e) {}
    res.json({ success: true, message: 'Exam updated successfully.' });
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({ success: false, message: 'Database error updating exam.' });
  }
});

// DELETE /api/exams/:id (Admin Only - Server Enforced)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM exams WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }
    try { broadcastSync('exams_updated', { id: req.params.id, removed: true }); } catch (e) {}
    res.json({ success: true, message: 'Exam removed successfully.' });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ success: false, message: 'Database error deleting exam.' });
  }
});

module.exports = router;
