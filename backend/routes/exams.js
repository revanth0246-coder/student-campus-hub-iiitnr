const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

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

// POST /api/exams (Admin Only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { subject, title, examDate, examTime, room, syllabus } = req.body;

  if (!subject || !title || !examDate) {
    return res.status(400).json({ success: false, message: 'Subject, Title, and Exam Date are required.' });
  }

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
      examDate.trim(),
      examTime ? examTime.trim() : '10:00 AM - 01:00 PM',
      room ? room.trim() : 'Room 203',
      syllabus ? syllabus.trim() : 'Detailed syllabus on academic portal.',
      createdBy
    ]);

    // Also trigger a notification for all students about new exam schedule
    try {
      await runAsync(`
        INSERT INTO notifications (type, title, message, link_view)
        VALUES ('exam', ?, ?, 'planner')
      `, [
        `Upcoming Exam: ${subject.trim()}`,
        `Exam scheduled on ${examDate.trim()} (${examTime || '10:00 AM - 01:00 PM'}) in ${room || 'Room 203'}.`
      ]);
    } catch (ne) {}

    const created = {
      id,
      subject: subject.trim(),
      title: title.trim(),
      examDate: examDate.trim(),
      examTime: examTime || '10:00 AM - 01:00 PM',
      room: room || 'Room 203',
      syllabus: syllabus || 'Detailed syllabus on academic portal.',
      createdBy
    };

    res.status(201).json({ success: true, message: 'Exam added successfully.', exam: created });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ success: false, message: 'Database error creating exam.' });
  }
});

// PUT /api/exams/:id (Admin Only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { subject, title, examDate, examTime, room, syllabus } = req.body;
  const examId = req.params.id;

  try {
    const existing = await getAsync(`SELECT * FROM exams WHERE id = ?`, [examId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    await runAsync(`
      UPDATE exams 
      SET subject = ?, title = ?, exam_date = ?, exam_time = ?, room = ?, syllabus = ?
      WHERE id = ?
    `, [
      subject ? subject.trim() : existing.subject,
      title ? title.trim() : existing.title,
      examDate ? examDate.trim() : existing.exam_date,
      examTime ? examTime.trim() : existing.exam_time,
      room ? room.trim() : existing.room,
      syllabus ? syllabus.trim() : existing.syllabus,
      examId
    ]);

    res.json({ success: true, message: 'Exam details updated successfully.' });
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({ success: false, message: 'Database error updating exam.' });
  }
});

// DELETE /api/exams/:id (Admin Only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await runAsync(`DELETE FROM exams WHERE id = ?`, [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }
    res.json({ success: true, message: 'Exam deleted successfully.' });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ success: false, message: 'Database error deleting exam.' });
  }
});

module.exports = router;
