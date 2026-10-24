const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate, userCreateSchema, userUpdateSchema } = require('../middleware/validation');
const { broadcastSync } = require('../services/realtime');
const { uploadImage } = require('../config/cloudinary');

// All user management routes are strictly restricted to College Administrators
router.use(authenticate, requireAdmin);

/**
 * GET /api/users
 * Retrieve all registered users (students & administrators)
 */
router.get('/', async (req, res) => {
  try {
    const roleFilter = req.query.role;
    let sql = `
      SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, department, designation, avatar, last_login, created_at 
      FROM users
    `;
    const params = [];
    if (roleFilter && ['admin', 'student'].includes(roleFilter)) {
      sql += ` WHERE role = ?`;
      params.push(roleFilter);
    }
    sql += ` ORDER BY role ASC, name ASC`;

    const users = await allAsync(sql, params);
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Database error fetching users.' });
  }
});

/**
 * GET /api/users/:id
 * Retrieve details for a specific user by ID, roll, or email
 */
router.get('/:id', async (req, res) => {
  const targetId = req.params.id;
  try {
    const user = await getAsync(`
      SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, department, designation, avatar, last_login, created_at 
      FROM users 
      WHERE id = ? OR UPPER(roll) = ? OR LOWER(email) = ?
    `, [targetId, targetId.toUpperCase(), targetId.toLowerCase()]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'Database error fetching user details.' });
  }
});

/**
 * POST /api/users
 * Admin creates a new user account (student or administrator)
 */
router.post('/', validate(userCreateSchema), async (req, res) => {
  const { name, email, password, role, roll, branch, year, semester, cgpa, department, designation, avatar } = req.body;
  const cleanEmail = email.trim().toLowerCase();
  const cleanRoll = roll ? roll.trim().toUpperCase() : (role === 'admin' ? `ADMIN_${Date.now().toString().slice(-4)}` : null);

  try {
    const existing = await getAsync(`
      SELECT id FROM users WHERE LOWER(email) = ? OR (roll IS NOT NULL AND roll = ?)
    `, [cleanEmail, cleanRoll]);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this Email or Roll Number already exists.'
      });
    }

    const newId = `${role}_${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);
    let chosenAvatar = avatar || (role === 'admin' 
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces');
    if (chosenAvatar && chosenAvatar.startsWith('data:image')) {
      const uploadRes = await uploadImage(chosenAvatar, { folder: 'iiitnr-campus-hub/avatars' });
      if (uploadRes?.url) chosenAvatar = uploadRes.url;
    }

    await runAsync(`
      INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, department, designation, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newId,
      cleanRoll,
      name.trim(),
      cleanEmail,
      passwordHash,
      role,
      branch || (role === 'student' ? 'Data Science & AI' : null),
      year || (role === 'student' ? '1st Year' : null),
      semester || (role === 'student' ? 'Semester 2' : null),
      cgpa || (role === 'student' ? '8.0' : null),
      department || (role === 'admin' ? 'Office of Academic Affairs' : null),
      designation || (role === 'admin' ? 'Campus Administrator' : null),
      chosenAvatar
    ]);

    const created = await getAsync(`
      SELECT id, roll, name, email, role, branch, year, semester, cgpa, department, designation, avatar, created_at
      FROM users WHERE id = ?
    `, [newId]);

    try { broadcastSync('user_created', { user: created }); } catch (e) {}

    res.status(201).json({
      success: true,
      message: `${role.toUpperCase()} account created successfully for ${name} (${cleanEmail}).`,
      user: created
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Database error creating user account.' });
  }
});

/**
 * PUT /api/users/:id
 * Admin updates user profile information
 */
router.put('/:id', validate(userUpdateSchema), async (req, res) => {
  const targetId = req.params.id;
  const updates = req.body;

  try {
    const existing = await getAsync(`SELECT * FROM users WHERE id = ?`, [targetId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let passwordHash = existing.password_hash;
    if (updates.password) {
      passwordHash = await bcrypt.hash(updates.password, 10);
    }

    let finalAvatar = updates.avatar || null;
    if (finalAvatar && finalAvatar.startsWith('data:image')) {
      const uploadRes = await uploadImage(finalAvatar, { folder: 'iiitnr-campus-hub/avatars' });
      if (uploadRes?.url) finalAvatar = uploadRes.url;
    }

    await runAsync(`
      UPDATE users 
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          password_hash = ?,
          role = COALESCE(?, role),
          branch = COALESCE(?, branch),
          year = COALESCE(?, year),
          semester = COALESCE(?, semester),
          cgpa = COALESCE(?, cgpa),
          department = COALESCE(?, department),
          designation = COALESCE(?, designation),
          avatar = COALESCE(?, avatar)
      WHERE id = ?
    `, [
      updates.name ? updates.name.trim() : null,
      updates.email ? updates.email.trim().toLowerCase() : null,
      passwordHash,
      updates.role || null,
      updates.branch || null,
      updates.year || null,
      updates.semester || null,
      updates.cgpa || null,
      updates.department || null,
      updates.designation || null,
      finalAvatar,
      targetId
    ]);

    const updated = await getAsync(`
      SELECT id, roll, name, email, role, branch, year, semester, cgpa, department, designation, avatar 
      FROM users WHERE id = ?
    `, [targetId]);

    try { broadcastSync('user_updated', { user: updated }); } catch (e) {}

    res.json({
      success: true,
      message: `User ${updated.name} updated successfully.`,
      user: updated
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Database error updating user.' });
  }
});

/**
 * PUT /api/users/:id/role
 * Admin updates or toggles user role (student <-> admin)
 */
router.put('/:id/role', async (req, res) => {
  const { role } = req.body;
  const targetId = req.params.id;

  if (!role || !['admin', 'student'].includes(role)) {
    return res.status(400).json({ success: false, message: "Valid role ('admin' or 'student') is required." });
  }

  try {
    const user = await getAsync(`SELECT * FROM users WHERE id = ?`, [targetId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Protect primary root admin from demotion
    if (user.email.toLowerCase() === 'revanth0246@gmail.com' && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote the primary root administrator (revanth0246@gmail.com).' });
    }

    await runAsync(`UPDATE users SET role = ? WHERE id = ?`, [role, targetId]);
    await runAsync(`UPDATE sessions SET role = ? WHERE user_id = ?`, [role, targetId]);

    try { broadcastSync('user_role_changed', { userId: targetId, role }); } catch (e) {}

    res.json({
      success: true,
      message: `Role for ${user.name} (${user.email}) changed to ${role.toUpperCase()}.`
    });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ success: false, message: 'Server error updating user role.' });
  }
});

/**
 * DELETE /api/users/:id
 * Admin deletes a user account and purges all related data
 */
router.delete('/:id', async (req, res) => {
  const targetId = req.params.id;

  try {
    const target = await getAsync(`
      SELECT * FROM users WHERE id = ? OR UPPER(roll) = ? OR LOWER(email) = ?
    `, [targetId, targetId.toUpperCase(), targetId.toLowerCase()]);

    if (!target) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Protect primary root admin
    if (target.email.toLowerCase() === 'revanth0246@gmail.com') {
      return res.status(403).json({ success: false, message: 'Cannot delete the primary root administrator account.' });
    }

    const studentRoll = target.roll;
    const studentDbId = target.id;

    if (studentRoll) {
      const upperRoll = studentRoll.toUpperCase();
      try { await runAsync(`DELETE FROM assignment_completions WHERE UPPER(student_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM event_registrations WHERE UPPER(student_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM notifications WHERE UPPER(user_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM resource_bookmarks WHERE UPPER(student_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM resource_reports WHERE UPPER(student_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM mess_feedback WHERE UPPER(student_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM marketplace_inquiries WHERE UPPER(sender_roll) = ?`, [upperRoll]); } catch (e) {}
      try { await runAsync(`DELETE FROM marketplace_listings WHERE UPPER(user_roll) = ? OR user_id = ?`, [upperRoll, studentDbId]); } catch (e) {}
    }
    await runAsync(`DELETE FROM sessions WHERE user_id = ?`, [studentDbId]);
    await runAsync(`DELETE FROM users WHERE id = ?`, [studentDbId]);

    try { broadcastSync('user_removed', { id: studentDbId, roll: target.roll, name: target.name }); } catch (e) {}

    res.json({
      success: true,
      message: `User ${target.name} (${target.roll || target.email}) removed permanently from the system.`
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Database error removing user: ' + err.message });
  }
});

module.exports = router;
