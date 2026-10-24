const express = require('express');
const router = express.Router();
const { runAsync, getAsync } = require('../config/database');
const { uploadImage } = require('../config/cloudinary');

// PUT /api/profile/:id
router.put('/:id', async (req, res) => {
  const { name, roll, branch, year, semester, cgpa, email, avatar } = req.body;
  const targetId = req.params.id;

  try {
    const user = await getAsync(`SELECT * FROM users WHERE id = ? OR LOWER(roll) = ?`, [targetId, (roll || '').toLowerCase()]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in SQLite database.' });
    }

    const updatedName = name ? name.trim() : user.name;
    const updatedRoll = roll ? roll.trim().toUpperCase() : user.roll;
    const updatedEmail = email ? email.trim().toLowerCase() : user.email;
    const updatedBranch = branch || user.branch;
    const updatedYear = year || user.year;
    const updatedSemester = semester ? semester.trim() : user.semester;
    const updatedCgpa = cgpa ? cgpa.trim() : user.cgpa;
    
    let updatedAvatar = avatar || user.avatar;
    if (updatedAvatar && updatedAvatar.startsWith('data:image')) {
      const uploadRes = await uploadImage(updatedAvatar, { folder: 'iiitnr-campus-hub/avatars' });
      if (uploadRes?.url) {
        updatedAvatar = uploadRes.url;
      }
    }

    await runAsync(`
      UPDATE users SET
        name = ?,
        roll = ?,
        email = ?,
        branch = ?,
        year = ?,
        semester = ?,
        cgpa = ?,
        avatar = ?
      WHERE id = ?
    `, [
      updatedName,
      updatedRoll,
      updatedEmail,
      updatedBranch,
      updatedYear,
      updatedSemester,
      updatedCgpa,
      updatedAvatar,
      user.id
    ]);

    const updatedUser = await getAsync(`SELECT * FROM users WHERE id = ?`, [user.id]);
    const { password_hash: _, ...safeUser } = updatedUser;

    res.json({
      success: true,
      message: 'Profile and gallery avatar updated successfully in database.',
      user: safeUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Database error updating profile.' });
  }
});

module.exports = router;
