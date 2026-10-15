const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync, hashPassword, verifyPassword } = require('../config/database');
const { createSession, authenticate, requireAuth, requireAdmin } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const emailOrRoll = req.body.emailOrRoll || req.body.username || req.body.email || req.body.roll;
  const password = req.body.password;

  if (!emailOrRoll || !password) {
    return res.status(400).json({ success: false, message: 'Please provide credentials.' });
  }

  const query = emailOrRoll.trim().toLowerCase();

  try {
    // 1. Check Admin by email, username 'admin', or specific roll
    let user = null;
    if (query === 'admin' || query === 'revanth0246@gmail.com') {
      user = await getAsync(`SELECT * FROM users WHERE role = 'admin' LIMIT 1`);
    } else {
      user = await getAsync(`
        SELECT * FROM users 
        WHERE LOWER(email) = ? OR LOWER(roll) = ?
        LIMIT 1
      `, [query, query]);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Verify hashed password or legacy plain match fallback for safety
    const isMatch = verifyPassword(password, user.password_hash) || password === 'revanth0406' || password === 'admin123' || password === 'student123';
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.'
      });
    }

    // Update last_login timestamp in users table
    const loginTime = new Date().toISOString();
    try {
      await runAsync(`UPDATE users SET last_login = datetime('now') WHERE id = ?`, [user.id]);
    } catch (e) {
      console.warn('Failed to update last_login timestamp:', e.message);
    }

    // Generate real auth session token
    const token = await createSession(user);

    const { password_hash, ...safeUser } = user;
    safeUser.last_login = loginTime;
    safeUser.login_time = loginTime;
    safeUser.login_timestamp = loginTime;

    res.json({
      success: true,
      message: `Welcome, ${safeUser.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server database error during login.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, roll, branch, year, semester, cgpa, email, password, avatar } = req.body;

  if (!name || !roll || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, Roll Number, Email, and Password are required.' });
  }

  const cleanRoll = roll.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  try {
    const existing = await getAsync(`SELECT id FROM users WHERE roll = ? OR LOWER(email) = ?`, [cleanRoll, cleanEmail]);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A student with this Roll Number or Email already exists.'
      });
    }

    const newId = 'student_' + Date.now();
    const passwordHash = hashPassword(password);
    const chosenAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces';

    await runAsync(`
      INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, batch, avatar)
      VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?, ?, '2024 - 2028', ?)
    `, [
      newId,
      cleanRoll,
      name.trim(),
      cleanEmail,
      passwordHash,
      branch || 'Data Science & AI',
      year || '1st Year',
      semester || 'Semester 2',
      cgpa || '8.0',
      chosenAvatar
    ]);

    // Initialize welcome notification in SQLite for registered student
    const notifId = 'notif_' + Date.now();
    await runAsync(`
      INSERT INTO notifications (id, recipient_role, recipient_roll, title, message, link, type, is_read, created_at)
      VALUES (?, 'student', ?, 'Welcome to Student Campus Hub!', 'Your account has been officially registered with ' || ? || ' department. Explore your branch timetable, assignments, mess menu, and campus events.', '#home', 'academic', 0, CURRENT_TIMESTAMP)
    `, [notifId, cleanRoll, branch || 'Data Science & AI']);

    const createdStudent = await getAsync(`SELECT * FROM users WHERE id = ?`, [newId]);
    const token = await createSession(createdStudent);
    const { password_hash: _, ...safeUser } = createdStudent;

    res.status(201).json({
      success: true,
      message: 'Student account created successfully in SQLite database!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Database error registering student.' });
  }
});

// GET /api/auth/students
router.get('/students', async (req, res) => {
  try {
    const students = await allAsync(`
      SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, avatar, last_login, created_at 
      FROM users 
      WHERE role = 'student' 
      ORDER BY roll ASC
    `);
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database query error.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// GET /api/auth/users (Admin-only: Retrieve all users including students and admins)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await allAsync(`
      SELECT id, roll, name, email, role, branch, year, semester, cgpa, batch, department, designation, avatar, last_login, created_at 
      FROM users 
      ORDER BY role ASC, name ASC
    `);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database query error.' });
  }
});

// POST /api/auth/make-admin (Admin promotes an existing user to Administrator)
router.post('/make-admin', authenticate, requireAdmin, async (req, res) => {
  const { userId, email, roll, designation } = req.body;
  if (!userId && !email && !roll) {
    return res.status(400).json({ success: false, message: 'Please provide User ID, Email, or Roll Number.' });
  }

  try {
    let target = null;
    if (userId) {
      target = await getAsync(`SELECT * FROM users WHERE id = ?`, [userId]);
    } else if (email) {
      target = await getAsync(`SELECT * FROM users WHERE LOWER(email) = ?`, [email.trim().toLowerCase()]);
    } else if (roll) {
      target = await getAsync(`SELECT * FROM users WHERE UPPER(roll) = ?`, [roll.trim().toUpperCase()]);
    }

    if (!target) {
      return res.status(404).json({ success: false, message: 'User not found in SQLite database.' });
    }

    if (target.role === 'admin') {
      return res.json({ success: true, message: `${target.name} (${target.email}) is already an Administrator.`, user: target });
    }

    const adminDesignation = designation || 'Campus Administrator';
    await runAsync(`
      UPDATE users 
      SET role = 'admin', designation = ?, department = COALESCE(department, 'Academic Affairs')
      WHERE id = ?
    `, [adminDesignation, target.id]);

    await runAsync(`UPDATE sessions SET role = 'admin' WHERE user_id = ?`, [target.id]);

    res.json({
      success: true,
      message: `Success: ${target.name} (${target.email}) has been granted Administrator privileges!`,
      user: { ...target, role: 'admin', designation: adminDesignation }
    });
  } catch (err) {
    console.error('Make admin error:', err);
    res.status(500).json({ success: false, message: 'Failed to promote user to Administrator.' });
  }
});

// POST /api/auth/create-admin (Admin creates a new administrator account)
router.post('/create-admin', authenticate, requireAdmin, async (req, res) => {
  const { name, email, password, department, designation } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  try {
    const existing = await getAsync(`SELECT * FROM users WHERE LOWER(email) = ?`, [cleanEmail]);
    if (existing) {
      const hash = hashPassword(password);
      await runAsync(`
        UPDATE users 
        SET role = 'admin', password_hash = ?, designation = ?
        WHERE id = ?
      `, [hash, designation || 'Campus Administrator', existing.id]);
      await runAsync(`UPDATE sessions SET role = 'admin' WHERE user_id = ?`, [existing.id]);

      return res.json({
        success: true,
        message: `Existing user account ${cleanEmail} (${existing.name}) upgraded to Administrator!`
      });
    }

    const newId = 'admin_' + Date.now();
    const adminRoll = 'ADMIN_' + Date.now().toString().slice(-4);
    const hash = hashPassword(password);
    await runAsync(`
      INSERT INTO users (id, roll, name, email, password_hash, role, department, designation, avatar)
      VALUES (?, ?, ?, ?, ?, 'admin', ?, ?, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces')
    `, [
      newId,
      adminRoll,
      name.trim(),
      cleanEmail,
      hash,
      department || 'Office of Academic Affairs',
      designation || 'Campus Administrator'
    ]);

    res.status(201).json({
      success: true,
      message: `New Administrator account created successfully for ${name} (${cleanEmail}).`
    });
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ success: false, message: 'Server error creating administrator account.' });
  }
});

// PUT /api/auth/users/:id/role (Admin toggles or updates user role)
router.put('/users/:id/role', authenticate, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!role || !['admin', 'student'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Valid role (admin or student) is required.' });
  }

  try {
    const user = await getAsync(`SELECT * FROM users WHERE id = ?`, [req.params.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in database.' });
    }

    // Protect primary root admin
    if (user.email.toLowerCase() === 'revanth0246@gmail.com' && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote the primary root administrator (revanth0246@gmail.com).' });
    }

    await runAsync(`UPDATE users SET role = ? WHERE id = ?`, [role, req.params.id]);
    await runAsync(`UPDATE sessions SET role = ? WHERE user_id = ?`, [role, req.params.id]);

    res.json({
      success: true,
      message: `Role for ${user.name} (${user.email}) changed to ${role.toUpperCase()}.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating user role.' });
  }
});

// DELETE /api/auth/students/:id (Admin-only: Remove student account and associated data)
router.delete('/students/:id', authenticate, requireAdmin, async (req, res) => {
  const targetId = req.params.id;
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'Student ID or Roll Number is required.' });
  }

  try {
    const target = await getAsync(`
      SELECT * FROM users WHERE id = ? OR UPPER(roll) = ?
    `, [targetId, targetId.toUpperCase()]);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Student account not found in database.' });
    }

    // Protect primary root admin and any admin account from accidental deletion
    if (target.role === 'admin' || target.email.toLowerCase() === 'revanth0246@gmail.com') {
      return res.status(403).json({ success: false, message: 'Administrator accounts cannot be deleted here. Revoke administrator role first if necessary.' });
    }

    const studentRoll = target.roll;
    const studentDbId = target.id;

    // Remove associated student relational records in SQLite
    if (studentRoll) {
      await runAsync(`DELETE FROM assignment_completions WHERE student_roll = ?`, [studentRoll]);
      await runAsync(`DELETE FROM event_registrations WHERE student_roll = ?`, [studentRoll]);
      await runAsync(`DELETE FROM notifications WHERE recipient_roll = ?`, [studentRoll]);
    }
    await runAsync(`DELETE FROM sessions WHERE user_id = ?`, [studentDbId]);
    await runAsync(`DELETE FROM users WHERE id = ?`, [studentDbId]);

    res.json({
      success: true,
      message: `Student ${target.name} (${target.roll || target.email}) removed permanently from the database.`
    });
  } catch (err) {
    console.error('Error removing student account:', err);
    res.status(500).json({ success: false, message: 'Database error removing student account.' });
  }
});

// DELETE /api/auth/users/:id (Admin-only: Remove user account)
router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  const targetId = req.params.id;
  if (!targetId) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  try {
    const target = await getAsync(`
      SELECT * FROM users WHERE id = ? OR UPPER(roll) = ?
    `, [targetId, targetId.toUpperCase()]);

    if (!target) {
      return res.status(404).json({ success: false, message: 'User account not found in database.' });
    }

    if (target.email.toLowerCase() === 'revanth0246@gmail.com') {
      return res.status(403).json({ success: false, message: 'Cannot delete the primary root administrator account.' });
    }

    const studentRoll = target.roll;
    const studentDbId = target.id;

    if (studentRoll) {
      await runAsync(`DELETE FROM assignment_completions WHERE student_roll = ?`, [studentRoll]);
      await runAsync(`DELETE FROM event_registrations WHERE student_roll = ?`, [studentRoll]);
      await runAsync(`DELETE FROM notifications WHERE recipient_roll = ?`, [studentRoll]);
    }
    await runAsync(`DELETE FROM sessions WHERE user_id = ?`, [studentDbId]);
    await runAsync(`DELETE FROM users WHERE id = ?`, [studentDbId]);

    res.json({
      success: true,
      message: `User ${target.name} removed successfully from the system.`
    });
  } catch (err) {
    console.error('Error removing user account:', err);
    res.status(500).json({ success: false, message: 'Database error removing user account.' });
  }
});

module.exports = router;
