const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, '..', 'database');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'campus_hub.sqlite');
const db = new sqlite3.Database(DB_PATH);

// Promise helpers for clean async/await SQL operations
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Password hashing using Node.js crypto
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_iiitnr_salt_2026').digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Official Weekly Timetables for All 3 Branches (w.e.f. 24/08/2026 | IIIT Naya Raipur)
const defaultTimetablesByBranch = {
  'Data Science & AI': [
    {
      day: 'Monday',
      slots: {
        '9:00 - 9:55': { s: 'Slot A (Maths)', r: '203', t: 'a' },
        '10:00 - 10:55': { s: 'Slot B (Prog)', r: '203', t: 'b' },
        '11:00 - 11:55': { s: 'Slot C (Digital)', r: '203', t: 'c' },
        '12:00 - 12:55': { s: 'Slot M (IT Work)', r: '203', t: 'm' },
        '1:00 - 2:00': { s: 'Lunch Break (L)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Creative Arts: Music', r: 'Auditorium', t: 'music' },
        '03:00 - 03:55': { s: 'Slot F (Physics)', r: '203', t: 'f' },
        '04:00 - 04:55': { s: 'Slot G (Comm)', r: '203', t: 'g' },
        '05:00 - 05:55': { s: 'Free / Library', r: '-', t: 'free' }
      }
    },
    {
      day: 'Tuesday',
      slots: {
        '9:00 - 9:55': { s: 'Slot B (Prog)', r: '203', t: 'b' },
        '10:00 - 10:55': { s: 'Slot C (Digital)', r: '203', t: 'c' },
        '11:00 - 11:55': { s: 'Slot A (Maths)', r: '203', t: 'a' },
        '12:00 - 12:55': { s: 'Slot F (Physics)', r: '203', t: 'f' },
        '1:00 - 2:00': { s: 'Lunch Break (U)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Health & Wellness: Yoga', r: 'Sports Complex', t: 'yoga' },
        '03:00 - 03:55': { s: 'Slot G (Comm)', r: '203', t: 'g' },
        '04:00 - 04:55': { s: 'Slot M (IT Work)', r: '203', t: 'm' },
        '05:00 - 05:55': { s: 'Free / Mentorship', r: '-', t: 'free' }
      }
    },
    {
      day: 'Wednesday',
      slots: {
        '9:00 - 9:55': { s: 'Slot C (Digital)', r: '203', t: 'c' },
        '10:00 - 10:55': { s: 'Slot A (Maths)', r: '203', t: 'a' },
        '11:00 - 11:55': { s: 'Slot B (Prog)', r: '203', t: 'b' },
        '12:00 - 12:55': { s: 'Slot G (Comm)', r: '203', t: 'g' },
        '1:00 - 2:00': { s: 'Lunch Break (N)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Slot N (Discrete)', r: '203', t: 'n' },
        '03:00 - 03:55': { s: 'Slot M (IT Work)', r: '203', t: 'm' },
        '04:00 - 04:55': { s: 'Slot F (Physics)', r: '203', t: 'f' },
        '05:00 - 05:55': { s: 'Free Study Hour', r: '-', t: 'free' }
      }
    },
    {
      day: 'Thursday',
      slots: {
        '9:00 - 9:55': { s: 'Slot F (Physics)', r: '203', t: 'f' },
        '10:00 - 10:55': { s: 'Slot G (Comm)', r: '203', t: 'g' },
        '11:00 - 11:55': { s: 'Slot M (IT Work)', r: '203', t: 'm' },
        '12:00 - 12:55': { s: 'Slot N (Discrete)', r: '203', t: 'n' },
        '1:00 - 2:00': { s: 'Lunch Break (C)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Indian Lang & Culture (ILC)', r: '203', t: 'ilc' },
        '03:00 - 03:55': { s: 'Slot A (Maths)', r: '203', t: 'a' },
        '04:00 - 04:55': { s: 'Slot B (Prog)', r: '203', t: 'b' },
        '05:00 - 05:55': { s: 'Slot C (Digital)', r: '203', t: 'c' }
      }
    },
    {
      day: 'Friday',
      slots: {
        '9:00 - 9:55': { s: 'Slot G (Comm)', r: '203', t: 'g' },
        '10:00 - 10:55': { s: 'Slot M (IT Work)', r: '203', t: 'm' },
        '11:00 - 11:55': { s: 'Slot N (Discrete)', r: '203', t: 'n' },
        '12:00 - 12:55': { s: 'Slot A (Maths)', r: '203', t: 'a' },
        '1:00 - 2:00': { s: 'Lunch Break (H)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Creative Arts / Yoga', r: 'Campus Hall', t: 'yoga' },
        '03:00 - 03:55': { s: 'Slot B (Prog)', r: '203', t: 'b' },
        '04:00 - 04:55': { s: 'Slot C (Digital)', r: '203', t: 'c' },
        '05:00 - 05:55': { s: 'Slot F (Physics)', r: '203', t: 'f' }
      }
    }
  ],
  'Computer Science & Engineering': [
    {
      day: 'Monday',
      slots: {
        '9:00 - 9:55': { s: 'Slot A (Data Structures)', r: '201', t: 'a' },
        '10:00 - 10:55': { s: 'Slot B (OOP with Java)', r: '201', t: 'b' },
        '11:00 - 11:55': { s: 'Slot C (Discrete Maths)', r: '201', t: 'c' },
        '12:00 - 12:55': { s: 'Slot M (Comp Org & Arch)', r: '201', t: 'm' },
        '1:00 - 2:00': { s: 'Lunch Break (L)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Slot F (Operating Systems)', r: '201', t: 'f' },
        '03:00 - 03:55': { s: 'Slot G (Theory of Comp)', r: '201', t: 'g' },
        '04:00 - 04:55': { s: 'Slot B (Web Tech Lab)', r: 'CC Lab 1', t: 'b' },
        '05:00 - 05:55': { s: 'Free / Coding Club', r: 'CC Lab 1', t: 'free' }
      }
    },
    {
      day: 'Tuesday',
      slots: {
        '9:00 - 9:55': { s: 'Slot B (OOP with Java)', r: '201', t: 'b' },
        '10:00 - 10:55': { s: 'Slot C (Discrete Maths)', r: '201', t: 'c' },
        '11:00 - 11:55': { s: 'Slot A (Data Structures)', r: '201', t: 'a' },
        '12:00 - 12:55': { s: 'Slot F (Operating Systems)', r: '201', t: 'f' },
        '1:00 - 2:00': { s: 'Lunch Break (U)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Health & Wellness: Yoga', r: 'Sports Complex', t: 'yoga' },
        '03:00 - 03:55': { s: 'Slot M (Comp Org & Arch)', r: '201', t: 'm' },
        '04:00 - 04:55': { s: 'Slot G (Theory of Comp)', r: '201', t: 'g' },
        '05:00 - 05:55': { s: 'Free / Self Study', r: '-', t: 'free' }
      }
    },
    {
      day: 'Wednesday',
      slots: {
        '9:00 - 9:55': { s: 'Slot C (Discrete Maths)', r: '201', t: 'c' },
        '10:00 - 10:55': { s: 'Slot A (Data Structures)', r: '201', t: 'a' },
        '11:00 - 11:55': { s: 'Slot B (OOP with Java)', r: '201', t: 'b' },
        '12:00 - 12:55': { s: 'Slot G (Technical Comm)', r: '201', t: 'g' },
        '1:00 - 2:00': { s: 'Lunch Break (N)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Slot N (Database / SQL)', r: 'CC Lab 2', t: 'n' },
        '03:00 - 03:55': { s: 'Slot M (Comp Org & Arch)', r: '201', t: 'm' },
        '04:00 - 04:55': { s: 'Slot F (Operating Systems)', r: '201', t: 'f' },
        '05:00 - 05:55': { s: 'Free Study Hour', r: '-', t: 'free' }
      }
    },
    {
      day: 'Thursday',
      slots: {
        '9:00 - 9:55': { s: 'Slot F (Operating Systems)', r: '201', t: 'f' },
        '10:00 - 10:55': { s: 'Slot G (Technical Comm)', r: '201', t: 'g' },
        '11:00 - 11:55': { s: 'Slot M (Comp Org & Arch)', r: '201', t: 'm' },
        '12:00 - 12:55': { s: 'Slot N (Database / SQL)', r: 'CC Lab 2', t: 'n' },
        '1:00 - 2:00': { s: 'Lunch Break (C)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Indian Lang & Culture (ILC)', r: '201', t: 'ilc' },
        '03:00 - 03:55': { s: 'Slot A (Data Structures)', r: '201', t: 'a' },
        '04:00 - 04:55': { s: 'Slot B (OOP with Java)', r: '201', t: 'b' },
        '05:00 - 05:55': { s: 'Slot C (Discrete Maths)', r: '201', t: 'c' }
      }
    },
    {
      day: 'Friday',
      slots: {
        '9:00 - 9:55': { s: 'Slot G (Theory of Comp)', r: '201', t: 'g' },
        '10:00 - 10:55': { s: 'Slot M (Comp Org & Arch)', r: '201', t: 'm' },
        '11:00 - 11:55': { s: 'Slot N (Database / SQL)', r: 'CC Lab 2', t: 'n' },
        '12:00 - 12:55': { s: 'Slot A (Data Structures)', r: '201', t: 'a' },
        '1:00 - 2:00': { s: 'Lunch Break (H)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Creative Arts: Music', r: 'Auditorium', t: 'music' },
        '03:00 - 03:55': { s: 'Slot B (OOP with Java)', r: '201', t: 'b' },
        '04:00 - 04:55': { s: 'Slot C (Discrete Maths)', r: '201', t: 'c' },
        '05:00 - 05:55': { s: 'Slot F (OS Project Lab)', r: 'CC Lab 2', t: 'f' }
      }
    }
  ],
  'Electronics & Communication': [
    {
      day: 'Monday',
      slots: {
        '9:00 - 9:55': { s: 'Slot A (Maths & Transforms)', r: '205', t: 'a' },
        '10:00 - 10:55': { s: 'Slot B (Devices & Circuits)', r: '205', t: 'b' },
        '11:00 - 11:55': { s: 'Slot C (Digital Circuits & uP)', r: '205', t: 'c' },
        '12:00 - 12:55': { s: 'Slot M (Hardware Lab)', r: 'Hardware Lab', t: 'm' },
        '1:00 - 2:00': { s: 'Lunch Break (L)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Creative Arts: Music', r: 'Auditorium', t: 'music' },
        '03:00 - 03:55': { s: 'Slot F (Signals & Systems)', r: '205', t: 'f' },
        '04:00 - 04:55': { s: 'Slot G (Electromagnetic Fields)', r: '205', t: 'g' },
        '05:00 - 05:55': { s: 'Free / Robotics Lab', r: 'Hardware Lab', t: 'free' }
      }
    },
    {
      day: 'Tuesday',
      slots: {
        '9:00 - 9:55': { s: 'Slot B (Devices & Circuits)', r: '205', t: 'b' },
        '10:00 - 10:55': { s: 'Slot C (Digital Circuits & uP)', r: '205', t: 'c' },
        '11:00 - 11:55': { s: 'Slot A (Maths & Transforms)', r: '205', t: 'a' },
        '12:00 - 12:55': { s: 'Slot F (Signals & Systems)', r: '205', t: 'f' },
        '1:00 - 2:00': { s: 'Lunch Break (U)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Health & Wellness: Yoga', r: 'Sports Complex', t: 'yoga' },
        '03:00 - 03:55': { s: 'Slot G (Electromagnetic Fields)', r: '205', t: 'g' },
        '04:00 - 04:55': { s: 'Slot M (Circuit Sim Lab)', r: 'VLSI Lab', t: 'm' },
        '05:00 - 05:55': { s: 'Free / Mentorship', r: '-', t: 'free' }
      }
    },
    {
      day: 'Wednesday',
      slots: {
        '9:00 - 9:55': { s: 'Slot C (Digital Circuits & uP)', r: '205', t: 'c' },
        '10:00 - 10:55': { s: 'Slot A (Maths & Transforms)', r: '205', t: 'a' },
        '11:00 - 11:55': { s: 'Slot B (Devices & Circuits)', r: '205', t: 'b' },
        '12:00 - 12:55': { s: 'Slot G (Electromagnetic Fields)', r: '205', t: 'g' },
        '1:00 - 2:00': { s: 'Lunch Break (N)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Slot N (Comm Systems)', r: '205', t: 'n' },
        '03:00 - 03:55': { s: 'Slot M (Hardware Lab)', r: 'Hardware Lab', t: 'm' },
        '04:00 - 04:55': { s: 'Slot F (Signals & Systems)', r: '205', t: 'f' },
        '05:00 - 05:55': { s: 'Free Study Hour', r: '-', t: 'free' }
      }
    },
    {
      day: 'Thursday',
      slots: {
        '9:00 - 9:55': { s: 'Slot F (Signals & Systems)', r: '205', t: 'f' },
        '10:00 - 10:55': { s: 'Slot G (Electromagnetic Fields)', r: '205', t: 'g' },
        '11:00 - 11:55': { s: 'Slot M (Hardware Lab)', r: 'Hardware Lab', t: 'm' },
        '12:00 - 12:55': { s: 'Slot N (Comm Systems)', r: '205', t: 'n' },
        '1:00 - 2:00': { s: 'Lunch Break (C)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Indian Lang & Culture (ILC)', r: '205', t: 'ilc' },
        '03:00 - 03:55': { s: 'Slot A (Maths & Transforms)', r: '205', t: 'a' },
        '04:00 - 04:55': { s: 'Slot B (Devices & Circuits)', r: '205', t: 'b' },
        '05:00 - 05:55': { s: 'Slot C (Digital Circuits & uP)', r: '205', t: 'c' }
      }
    },
    {
      day: 'Friday',
      slots: {
        '9:00 - 9:55': { s: 'Slot G (Electromagnetic Fields)', r: '205', t: 'g' },
        '10:00 - 10:55': { s: 'Slot M (Hardware Lab)', r: 'Hardware Lab', t: 'm' },
        '11:00 - 11:55': { s: 'Slot N (Comm Systems)', r: '205', t: 'n' },
        '12:00 - 12:55': { s: 'Slot A (Maths & Transforms)', r: '205', t: 'a' },
        '1:00 - 2:00': { s: 'Lunch Break (H)', r: '-', t: 'lunch' },
        '02:00 - 02:55': { s: 'Creative Arts / Yoga', r: 'Campus Hall', t: 'yoga' },
        '03:00 - 03:55': { s: 'Slot B (Devices & Circuits)', r: '205', t: 'b' },
        '04:00 - 04:55': { s: 'Slot C (Digital Circuits & uP)', r: '205', t: 'c' },
        '05:00 - 05:55': { s: 'Slot F (Signals Lab)', r: 'Hardware Lab', t: 'f' }
      }
    }
  ]
};

async function seedBranchTimetables() {
  try {
    const priyaUser = await getAsync(`SELECT id FROM users WHERE roll = '24ECE042'`);
    if (!priyaUser) {
      await runAsync(`
        INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, batch, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'student_003',
        '24ECE042',
        'Priya Verma',
        'priya24@iiitnr.ac.in',
        hashPassword('student123'),
        'student',
        'Electronics & Communication',
        '1st Year',
        'Semester 1',
        '8.8',
        '2024 - 2028',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
      ]);
    }

    const branchRows = await allAsync(`SELECT DISTINCT branch FROM timetable`);
    const seededBranches = branchRows.map(r => r.branch);
    for (const [branchName, branchDays] of Object.entries(defaultTimetablesByBranch)) {
      if (!seededBranches.includes(branchName)) {
        for (const dayItem of branchDays) {
          for (const [timeSlot, slotInfo] of Object.entries(dayItem.slots)) {
            await runAsync(`
              INSERT OR REPLACE INTO timetable (branch, day, time_slot, subject, room, slot_type)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [branchName, dayItem.day, timeSlot, slotInfo.s, slotInfo.r, slotInfo.t]);
          }
        }
      }
    }
  } catch (err) {
    console.error('seedBranchTimetables error:', err.message);
  }
}

// Seed the 100 official DSAI 2026-2030 students from the official registry
async function seedDSAIStudents() {
  try {
    const dsaiStudents = require('../data/dsai_students');
    const defaultPasswordHash = hashPassword('Test@1234');
    for (const s of dsaiStudents) {
      const existing = await getAsync(`SELECT id FROM users WHERE roll = ? OR LOWER(email) = ?`, [s.roll, s.email.toLowerCase()]);
      if (!existing) {
        await runAsync(`
          INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, batch, avatar)
          VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?, ?, ?, ?)
        `, [
          s.id,
          s.roll,
          s.name,
          s.email.toLowerCase(),
          defaultPasswordHash,
          s.branch,
          s.year,
          s.semester,
          s.cgpa,
          s.batch,
          s.avatar
        ]);
      }
    }
    console.log('✅ 100 DSAI Students verified/seeded in SQLite.');
  } catch (err) {
    console.error('seedDSAIStudents error:', err.message);
  }
}

// Initialize tables and seed default data
async function initDatabase() {
  await runAsync(`PRAGMA foreign_keys = ON;`);

  // 1. Users Table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      roll TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'student')),
      branch TEXT,
      year TEXT,
      semester TEXT,
      cgpa TEXT,
      avatar TEXT,
      batch TEXT,
      department TEXT,
      designation TEXT,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safe migration for last_login in existing databases
  try {
    await runAsync(`ALTER TABLE users ADD COLUMN last_login DATETIME;`);
  } catch (e) {
    // Column already exists or fresh table
  }

  // 2. Auth Sessions Table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 3. Timetable Table (Branch-Aware Weekly Schedule)
  try {
    const ttCols = await allAsync(`PRAGMA table_info(timetable)`);
    const hasBranchCol = ttCols.some(c => c.name === 'branch');
    if (ttCols.length > 0 && !hasBranchCol) {
      await runAsync(`
        CREATE TABLE IF NOT EXISTS timetable_v2 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          branch TEXT NOT NULL DEFAULT 'Data Science & AI',
          day TEXT NOT NULL,
          time_slot TEXT NOT NULL,
          subject TEXT NOT NULL,
          room TEXT DEFAULT '203',
          slot_type TEXT DEFAULT 'm',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(branch, day, time_slot)
        )
      `);
      await runAsync(`
        INSERT OR IGNORE INTO timetable_v2 (id, branch, day, time_slot, subject, room, slot_type, updated_at)
        SELECT id, 'Data Science & AI', day, time_slot, subject, room, slot_type, updated_at FROM timetable
      `);
      await runAsync(`DROP TABLE timetable`);
      await runAsync(`ALTER TABLE timetable_v2 RENAME TO timetable`);
    }
  } catch (err) {
    console.error('Timetable schema migration warning:', err.message);
  }

  await runAsync(`
    CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      branch TEXT NOT NULL DEFAULT 'Data Science & AI',
      day TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      subject TEXT NOT NULL,
      room TEXT DEFAULT '203',
      slot_type TEXT DEFAULT 'm',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(branch, day, time_slot)
    )
  `);

  // 4. Resources Table (Admin Only)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      semester TEXT DEFAULT 'Sem 1',
      unit TEXT DEFAULT 'Unit 1-4',
      link TEXT NOT NULL,
      description TEXT,
      contributor TEXT DEFAULT 'Admin / Academic Affairs',
      notes_count INTEGER DEFAULT 12,
      papers_count INTEGER DEFAULT 6,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Assignments Table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Pending',
      description TEXT,
      faculty TEXT DEFAULT 'Admin / Academic Affairs',
      student_id TEXT,
      is_broadcast INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Assignment Completions Table (Student Checklist)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS assignment_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id TEXT NOT NULL,
      student_roll TEXT NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(assignment_id, student_roll),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
    )
  `);

  // 7. Announcements Table (Admin Only)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT DEFAULT 'Academic',
      urgent INTEGER DEFAULT 0,
      author TEXT DEFAULT 'Dean Academic Office',
      date_str TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 8. Events Table (Admin Only)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date_str TEXT NOT NULL,
      venue TEXT NOT NULL,
      category TEXT DEFAULT 'Hackathon',
      description TEXT,
      badge_color TEXT DEFAULT 'bg-indigo-600',
      banner TEXT,
      created_by TEXT DEFAULT 'Administration',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 9. Event Registrations Table (Student Registration)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      student_roll TEXT NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(event_id, student_roll),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  // 10. Exams Table (Exams & Syllabus Planner)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      exam_time TEXT DEFAULT '10:00 AM - 01:00 PM',
      room TEXT DEFAULT 'Room 203',
      syllabus TEXT,
      created_by TEXT DEFAULT 'Academic Affairs',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 11. Mess Menu Table (Weekly Hostel Mess Schedule)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS mess_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week TEXT NOT NULL UNIQUE,
      breakfast TEXT NOT NULL,
      lunch TEXT NOT NULL,
      snacks TEXT NOT NULL,
      dinner TEXT NOT NULL,
      special_note TEXT,
      updated_by TEXT DEFAULT 'Hostel Mess Committee',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 12. Mess Meal Feedback Table (Student Ratings & Reviews)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS mess_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_roll TEXT NOT NULL,
      student_name TEXT,
      meal_type TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 13. Campus Exchange Listings (Buy & Sell, Lost & Found)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS marketplace_listings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_roll TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('sell', 'lost', 'found')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      price TEXT,
      location TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'sold', 'resolved')),
      contact_pref TEXT DEFAULT 'In-App Message',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 14. Campus Exchange Inquiries
  await runAsync(`
    CREATE TABLE IF NOT EXISTS marketplace_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id TEXT NOT NULL,
      sender_roll TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      contact_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE CASCADE
    )
  `);

  // 15. Resource Bookmarks Table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS resource_bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_roll TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_roll, resource_id)
    )
  `);

  // 16. Resource Reports Table (Broken Links & Flagged Content)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS resource_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id TEXT NOT NULL,
      student_roll TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 17. Centralized Notifications Table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_roll TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link_view TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safe migrations for assignments and resources
  try { await runAsync(`ALTER TABLE assignments ADD COLUMN priority TEXT DEFAULT 'Medium';`); } catch (e) {}
  try { await runAsync(`ALTER TABLE assignments ADD COLUMN status TEXT DEFAULT 'Pending';`); } catch (e) {}
  try { await runAsync(`ALTER TABLE assignments ADD COLUMN description TEXT;`); } catch (e) {}
  try { await runAsync(`ALTER TABLE assignments ADD COLUMN student_id TEXT;`); } catch (e) {}
  try { await runAsync(`ALTER TABLE resources ADD COLUMN unit TEXT DEFAULT 'All Units';`); } catch (e) {}

  // Check if initial seeding is needed
  const adminCount = await getAsync(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
  if (!adminCount || adminCount.count === 0) {
    await seedInitialData();
  } else {
    // Ensure primary admin credentials match revanth0246@gmail.com
    try {
      const primaryAdmin = await getAsync(`SELECT id FROM users WHERE email = 'revanth0246@gmail.com'`);
      if (!primaryAdmin) {
        const oldAdmin = await getAsync(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`);
        if (oldAdmin) {
          await runAsync(`
            UPDATE users 
            SET name = 'Revanth', email = 'revanth0246@gmail.com', password_hash = ? 
            WHERE id = ?
          `, [hashPassword('revanth0406'), oldAdmin.id]);
        }
      }
    } catch (e) {}
  }

  // Check if additional module seeding is needed
  const messCount = await getAsync(`SELECT COUNT(*) as count FROM mess_menu`);
  if (!messCount || messCount.count === 0) {
    await seedAdditionalModules();
  }

  // Ensure all 3 branch timetables are seeded in SQLite
  await seedBranchTimetables();
  await seedDSAIStudents();
}

// Seed the official database
async function seedInitialData() {
  console.log('🌱 Seeding initial database with official IIIT-NR data...');

  // 1. Seed Admin
  await runAsync(`
    INSERT INTO users (id, roll, name, email, password_hash, role, department, designation, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'admin_001',
    'ADMIN',
    'Revanth',
    'revanth0246@gmail.com',
    hashPassword('revanth0406'),
    'admin',
    'Office of Academic Affairs',
    'Chief Administrator',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces'
  ]);

  // 2. Seed Default Student
  await runAsync(`
    INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, batch, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'student_001',
    '24DSAI001',
    'Sahil Pulipaka',
    'sahil@iiitnr.ac.in',
    hashPassword('student123'),
    'student',
    'Data Science & AI',
    '1st Year',
    'Semester 1',
    '7.8',
    '2024 - 2028',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop&crop=faces'
  ]);

  // 3. Seed Second Student (CSE)
  await runAsync(`
    INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, batch, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'student_002',
    '24CSE015',
    'Aarav Sharma',
    'aarav24@iiitnr.ac.in',
    hashPassword('student123'),
    'student',
    'Computer Science & Engineering',
    '2nd Year',
    'Semester 4',
    '8.6',
    '2024 - 2028',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces'
  ]);

  // 3b. Seed Third Student (ECE)
  await runAsync(`
    INSERT INTO users (id, roll, name, email, password_hash, role, branch, year, semester, cgpa, batch, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'student_003',
    '24ECE042',
    'Priya Verma',
    'priya24@iiitnr.ac.in',
    hashPassword('student123'),
    'student',
    'Electronics & Communication',
    '1st Year',
    'Semester 1',
    '8.8',
    '2024 - 2028',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
  ]);

  // 4. Seed Official Timetables for All 3 Branches (w.e.f. 24/08/2026)
  await seedBranchTimetables();

  // 5. Seed Resources
  const initialResources = [
    {
      id: 'res_1',
      subject: 'Slot A (Mathematics)',
      title: 'Calculus, Matrices & Linear Algebra Complete Lecture Notes',
      type: 'Notes',
      semester: 'Sem 1',
      link: 'https://drive.google.com/drive/folders/slot-a-maths-iiitnr',
      description: 'Eigenvalues, Cayley-Hamilton theorem, Multivariable calculus, and past mid-sem test solutions.',
      contributor: 'Admin / Dept. of Mathematics'
    },
    {
      id: 'res_2',
      subject: 'Slot B (Computer Programming)',
      title: 'Problem Solving with C & Python Programming PYQ Bank',
      type: 'Previous Papers',
      semester: 'Sem 1',
      link: 'https://drive.google.com/drive/folders/slot-b-programming-pyq',
      description: 'Pointers, dynamic memory allocation, file handling, recursion, and lab test coding problems.',
      contributor: 'Admin / Dept. of CSE'
    },
    {
      id: 'res_3',
      subject: 'Slot C (Digital Logic)',
      title: 'Digital Electronics, Boolean Algebra & K-Maps Cheatsheet',
      type: 'Important Links',
      semester: 'Sem 1',
      link: 'https://github.com/iiitnr-students/slot-c-digital-logic',
      description: 'Combinational logic design, Multiplexers, Decoders, Flip-Flops, and circuit simulation templates.',
      contributor: 'Admin / Academic Cell'
    },
    {
      id: 'res_4',
      subject: 'Slot F (Physics)',
      title: 'Engineering Physics & Electromagnetics Study Package',
      type: 'Notes',
      semester: 'Sem 1',
      link: 'https://drive.google.com/drive/folders/slot-f-physics-notes',
      description: 'Optics, quantum mechanics fundamentals, electromagnetic wave propagation, and lab viva guides.',
      contributor: 'Admin / Faculty of Physics'
    },
    {
      id: 'res_5',
      subject: 'Slot G (Communication)',
      title: 'Professional Communication & Technical Report Writing Guide',
      type: 'Notes',
      semester: 'Sem 1',
      link: 'https://drive.google.com/drive/folders/slot-g-english-comm',
      description: 'Business correspondence, formal presentation frameworks, resume guidelines, and phonetics notes.',
      contributor: 'Admin / Humanities Cell'
    },
    {
      id: 'res_6',
      subject: 'Slot M (IT Workshop)',
      title: 'Linux CLI Commands, Git Version Control & Engineering Mechanics',
      type: 'Important Links',
      semester: 'Sem 1',
      link: 'https://github.com/iiitnr-students/it-workshop-manual',
      description: 'Bash scripts, vim cheatsheet, git workflow, truss analysis, and force equilibrium practical problems.',
      contributor: 'Admin / IT Workshop Lab'
    },
    {
      id: 'res_7',
      subject: 'Slot N (Discrete Maths)',
      title: 'Discrete Structures, Graph Theory & Propositional Logic Bank',
      type: 'Previous Papers',
      semester: 'Sem 1',
      link: 'https://drive.google.com/drive/folders/slot-n-discrete-maths',
      description: 'Set theory, recurrence relations, tree traversals, shortest path algorithms, and mid-sem test archives.',
      contributor: 'Admin / Dept. of Mathematics'
    }
  ];

  for (const r of initialResources) {
    await runAsync(`
      INSERT INTO resources (id, subject, title, type, semester, link, description, contributor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [r.id, r.subject, r.title, r.type, r.semester, r.link, r.description, r.contributor]);
  }

  // 6. Seed Assignments
  const initialAssignments = [
    {
      id: 'asgn_1',
      subject: 'Slot B (Computer Programming)',
      title: 'Problem Set 3: Recursion, Pointers & Dynamic Memory',
      dueDate: '2026-10-18',
      faculty: 'Dr. Anurag Sharma (Admin)'
    },
    {
      id: 'asgn_2',
      subject: 'Slot A (Mathematics)',
      title: 'Eigenvalues & Diagonalization Practice Problems',
      dueDate: '2026-10-22',
      faculty: 'Dean Academics Office'
    },
    {
      id: 'asgn_3',
      subject: 'Slot C (Digital Logic)',
      title: 'K-Map Minimization & 4-bit ALU Design Simulation',
      dueDate: '2026-10-25',
      faculty: 'Dept. of ECE & Admin'
    },
    {
      id: 'asgn_4',
      subject: 'Slot F (Engineering Physics)',
      title: 'Interference & Diffraction Numerical Assignment',
      dueDate: '2026-10-28',
      faculty: 'Physics Faculty'
    },
    {
      id: 'asgn_5',
      subject: 'Slot G (Communication Skills)',
      title: 'Technical Research Paper Abstract & Citation Review',
      dueDate: '2026-10-31',
      faculty: 'Humanities Dept.'
    }
  ];

  for (const a of initialAssignments) {
    await runAsync(`
      INSERT INTO assignments (id, subject, title, due_date, faculty)
      VALUES (?, ?, ?, ?, ?)
    `, [a.id, a.subject, a.title, a.dueDate, a.faculty]);
  }

  // 7. Seed Announcements
  const initialAnnouncements = [
    {
      id: 'ann_1',
      title: 'Official Notification: B.Tech Mid-Semester Examinations Schedule Announced',
      body: 'Mid-sem examinations for B.Tech Autumn Semester 2026 are scheduled from 15th to 21st November. Detailed seating arrangements in Room 203 & Lecture Hall Complex will be released shortly.',
      category: 'Exams',
      urgent: 1,
      author: 'Office of Dean Academic Affairs',
      date_str: '08 Oct 2026'
    },
    {
      id: 'ann_2',
      title: 'Section-1 Timetable Revision (Room 203 w.e.f. 24/08/2026)',
      body: 'Please review the updated Room 203 schedule with dedicated slots for Slot A through Slot N, ILC/Yoga, and Creative Arts. All students must occupy designated seats by 8:55 AM.',
      category: 'Academic',
      urgent: 0,
      author: 'Academic Coordination Committee',
      date_str: '06 Oct 2026'
    },
    {
      id: 'ann_3',
      title: 'Central Library Extended Hours During Mid-Term Preparations',
      body: 'Central Library will operate 24x7 from 10th October onwards. Digital resource access terminals in the e-library wing are fully updated with PYQ archives.',
      category: 'Campus',
      urgent: 0,
      author: 'Chief Librarian, IIIT-NR',
      date_str: '04 Oct 2026'
    },
    {
      id: 'ann_4',
      title: 'National Level Hackathon "HackNR 2026" Registrations Open',
      body: 'Annual 36-hour flagship hackathon hosted by IIIT Naya Raipur. Cash prizes worth Rs 3.5 Lakhs. Register your teams before 25th October via the Events portal.',
      category: 'Events',
      urgent: 0,
      author: 'Student Activity Council (SAC)',
      date_str: '01 Oct 2026'
    }
  ];

  for (const ann of initialAnnouncements) {
    await runAsync(`
      INSERT INTO announcements (id, title, body, category, urgent, author, date_str)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [ann.id, ann.title, ann.body, ann.category, ann.urgent, ann.author, ann.date_str]);
  }

  // 8. Seed Events
  const initialEvents = [
    {
      id: 'ev_1',
      title: 'HackNR 2026: Annual 36-Hour National Flagship Hackathon',
      date_str: '14 - 16 Nov 2026',
      venue: 'Auditorium & Turing Lab, IIIT-NR',
      category: 'Hackathon',
      description: 'Innovate cutting-edge AI, IoT, and Web3 solutions. Mentors from Google, Microsoft, and leading startups with cash prizes up to INR 3,50,000.',
      badge_color: 'bg-indigo-600',
      banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
      created_by: 'Office of Dean Academics'
    },
    {
      id: 'ev_2',
      title: 'Spardha 2026: Inter-Departmental Annual Sports Meet',
      date_str: '28 - 30 Nov 2026',
      venue: 'Campus Sports Complex & Cricket Ground',
      category: 'Sports',
      description: 'Intense inter-branch tournaments across Football, Cricket, Badminton, Volleyball, and Chess with trophy presentation ceremony.',
      badge_color: 'bg-emerald-600',
      banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
      created_by: 'Sports Council IIIT-NR'
    },
    {
      id: 'ev_3',
      title: 'Aarambh 2026: Annual Cultural & Arts Extravaganza',
      date_str: '12 - 14 Dec 2026',
      venue: 'Open Air Theatre (OAT), IIIT-NR',
      category: 'Cultural',
      description: 'Spectacular musical night, battle of the bands, classical dances, drama, and celebrity guest performer.',
      badge_color: 'bg-rose-600',
      banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      created_by: 'Cultural Committee & Admin'
    }
  ];

  for (const e of initialEvents) {
    await runAsync(`
      INSERT INTO events (id, title, date_str, venue, category, description, badge_color, banner, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [e.id, e.title, e.date_str, e.venue, e.category, e.description, e.badge_color, e.banner, e.created_by]);
  }

  await seedAdditionalModules();
  console.log('✅ SQLite Database successfully seeded!');
}

async function seedAdditionalModules() {
  console.log('🌱 Seeding Exams, Mess Menu, Campus Exchange, and Notifications...');

  // 1. Seed Exams
  const initialExams = [
    {
      id: 'exam_1',
      subject: 'Mathematics-I (Slot A)',
      title: 'Mid-Semester Theory Examination',
      exam_date: '2026-11-20',
      exam_time: '10:00 AM - 01:00 PM',
      room: 'Room 203',
      syllabus: 'Module 1: Differential Calculus & Taylor Series; Module 2: Linear Algebra, Eigenvalues & Eigenvectors; Module 3: Multiple Integrals & Vector Calculus.',
      created_by: 'Office of Academic Affairs'
    },
    {
      id: 'exam_2',
      subject: 'Computer Programming with C & Python (Slot B)',
      title: 'Lab & Practical Evaluation + Theory',
      exam_date: '2026-11-23',
      exam_time: '02:00 PM - 05:00 PM',
      room: 'CC Lab 1 & 2',
      syllabus: 'Memory allocation, Double pointers, Recursion, Structs, File Handlers, Python OOP, NumPy & Pandas fundamentals.',
      created_by: 'Dept of CSE & DSAI'
    },
    {
      id: 'exam_3',
      subject: 'Digital Electronics & Logic Design (Slot C)',
      title: 'Mid-Semester Theory Examination',
      exam_date: '2026-11-25',
      exam_time: '10:00 AM - 01:00 PM',
      room: 'Room 203',
      syllabus: 'Boolean algebra simplification, Karnaugh Maps (K-Maps), Multiplexers, Decoders, Flip-Flops (SR, JK, D, T), Synchronous Counters.',
      created_by: 'Dept of ECE'
    },
    {
      id: 'exam_4',
      subject: 'Engineering Physics (Slot F)',
      title: 'Mid-Semester Theory Examination',
      exam_date: '2026-11-27',
      exam_time: '10:00 AM - 01:00 PM',
      room: 'Room 203',
      syllabus: 'Wave optics (Interference & Diffraction), Quantum mechanics fundamentals (Wave function, Schrodinger equation), Solid-state band theory.',
      created_by: 'Dept of Science & Humanities'
    },
    {
      id: 'exam_5',
      subject: 'Professional Communication (Slot G)',
      title: 'Mid-Semester Theory & Viva',
      exam_date: '2026-11-30',
      exam_time: '10:00 AM - 12:00 PM',
      room: 'Language Lab / Room 203',
      syllabus: 'Technical documentation, Business email etiquette, Research paper formatting, Phonetics, and Group discussion methodology.',
      created_by: 'Academic Cell'
    }
  ];

  for (const ex of initialExams) {
    try {
      await runAsync(`
        INSERT INTO exams (id, subject, title, exam_date, exam_time, room, syllabus, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [ex.id, ex.subject, ex.title, ex.exam_date, ex.exam_time, ex.room, ex.syllabus, ex.created_by]);
    } catch (e) {}
  }

  // 2. Seed Weekly Mess Menu (Monday to Sunday)
  const initialMess = [
    {
      day: 'Monday',
      breakfast: 'Poha with Sev, Boiled Eggs / Boiled Sprouts, Jalebi, Bread-Butter-Jam, Tea & Coffee',
      lunch: 'Rajma Masala, Steamed Basmati Rice, Seasonal Mix Veg, Fresh Phulka, Curd, Green Salad, Papad',
      snacks: 'Aloo Samosa with Sweet & Mint Chutney, Hot Masala Chai',
      dinner: 'Dal Tadka, Shahi Paneer / Chicken Curry, Jeera Rice, Tawa Roti, Gulab Jamun (2 pcs)',
      note: 'Fresh seasonal fruit distributed during lunch.'
    },
    {
      day: 'Tuesday',
      breakfast: 'Idli, Crispy Medu Vada, Hot Sambar, Fresh Coconut Chutney, Banana, Tea & Coffee',
      lunch: 'Chole Bhature, Veg Pulao, Boondi Raita, Onion-Lemon Salad, Mango Pickle',
      snacks: 'Grilled Veg Sandwich with Ketchup, Hot Bournvita / Tea',
      dinner: 'Dal Makhani, Mix Veg Korma, Steamed Rice, Tawa Roti with Butter, Fruit Custard',
      note: 'Special South Indian breakfast spread.'
    },
    {
      day: 'Wednesday',
      breakfast: 'Aloo Paratha with Amul Butter, Fresh Curd, Mixed Pickle, Tea & Coffee',
      lunch: 'Kadhi Pakora, Jeera Rice, Bhindi Do Pyaza, Soft Phulka, Roasted Papad, Salad',
      snacks: 'Pani Puri & Sukha Bhel, Hot Lemon Tea',
      dinner: 'Kadhai Paneer / Egg Curry, Moong Dal Fry, Veg Pulao, Butter Roti, Vanilla Ice Cream',
      note: 'Evening snacks counter opens 5:00 PM.'
    },
    {
      day: 'Thursday',
      breakfast: 'Crispy Masala Dosa, Sambar, Roasted Chana Dal Chutney, Boiled Sprouts, Tea & Coffee',
      lunch: 'Dal Fry, Aloo Gobi Matar, Phulka, Steamed Rice, Sweet Lassi, Cucumber Salad',
      snacks: 'Bread Pakora with Green Chutney, Filter Coffee',
      dinner: 'Dum Aloo Kashmiri, Chana Dal Tadka, Steamed Rice, Roti, Rice Kheer',
      note: 'Pure vegetarian day across all messes.'
    },
    {
      day: 'Friday',
      breakfast: 'Mumbai Pav Bhaji, Chopped Onions & Lemon, Boiled Eggs / Sprouts, Tea & Coffee',
      lunch: 'South Indian Sambar, Aloo Capsicum, Steamed Rice, Soft Phulka, Curd, Appalam',
      snacks: 'Veg Hakka Noodles / White Sauce Pasta, Masala Chai',
      dinner: 'Matar Paneer / Fish Curry, Dal Fry, Jeera Rice, Butter Roti, Sponge Rasgulla',
      note: 'Non-veg alternative available on token request.'
    },
    {
      day: 'Saturday',
      breakfast: 'Poori with Bedmi Aloo Sabzi, Sooji Halwa, Pickle, Tea & Coffee',
      lunch: 'Hyderabadi Veg Dum Biryani, Mirchi Ka Salan, Onion Cucumber Raita, Roasted Papad',
      snacks: 'Sweet Corn Chaat, Green Tea / Hot Coffee',
      dinner: 'Sev Tamatar Ki Sabzi, Dal Tadka, Steamed Rice, Phulka, Moong Dal Halwa',
      note: 'Hostel mess feedback forms accepted today.'
    },
    {
      day: 'Sunday',
      breakfast: 'Amritsari Chole Kulche, Sweet Lassi, Pickled Green Chillies, Tea',
      lunch: '★ Special Sunday Feast: Paneer Butter Masala / Mutton Curry, Veg Biryani, Butter Naan, Gulab Jamun',
      snacks: 'Cream Biscuits, Rusks & Masala Tea',
      dinner: 'Light Moong Dal Khichdi, Gujarati Kadhi, Aloo Chokha, Roasted Papad, Pickle',
      note: '★ Special Sunday Lunch served 12:30 PM - 02:30 PM.'
    }
  ];

  for (const m of initialMess) {
    try {
      await runAsync(`
        INSERT INTO mess_menu (day_of_week, breakfast, lunch, snacks, dinner, special_note)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [m.day, m.breakfast, m.lunch, m.snacks, m.dinner, m.note]);
    } catch (e) {}
  }

  // 3. Seed Campus Exchange (Buy & Sell + Lost & Found)
  const initialListings = [
    {
      id: 'ex_1',
      user_id: 'student_001',
      user_name: 'Sahil Pulipaka',
      user_roll: '24DSAI001',
      type: 'sell',
      title: 'Casio FX-991EX Classwiz Scientific Calculator',
      description: 'Original Casio Classwiz non-programmable calculator allowed in IIIT-NR university exams. High resolution display, dual powered (solar + battery). Barely used for 1 semester, completely scratchless with sliding hard case.',
      category: 'Electronics',
      price: '850',
      location: 'Hostel H1, Room 312',
      image_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'ex_2',
      user_id: 'student_002',
      user_name: 'Aarav Sharma',
      user_roll: '24CSE015',
      type: 'sell',
      title: "Thomas' Calculus (14th Metric Edition, Pearson)",
      description: 'Prescribed standard textbook for B.Tech Maths-1 (Slot A). Excellent condition, all chapters intact, no missing pages. Great reference for tutorial sheets and mid-sem prep.',
      category: 'Textbooks',
      price: '480',
      location: 'Hostel H2, Room 108',
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'ex_3',
      user_id: 'student_001',
      user_name: 'Sahil Pulipaka',
      user_roll: '24DSAI001',
      type: 'lost',
      title: 'Blue Boat Rockerz Earbuds Case in Room 203',
      description: 'Misplaced my matte blue Boat Rockerz earbuds charging case on 08 October during the 3:30 PM Digital Electronics class, likely around 3rd row center bench. Has a small sonic sticker on the back.',
      category: 'Electronics',
      price: '',
      location: 'Academic Block, Room 203',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
      status: 'active'
    },
    {
      id: 'ex_4',
      user_id: 'admin_001',
      user_name: 'Security & Campus Welfare',
      user_roll: 'ADMIN',
      type: 'found',
      title: 'IIIT-NR Student RFID ID Card (Roll: 24CSE015)',
      description: 'Found a student smart ID card on the wooden table outside the Central Library ground floor. Owner can claim it from the Main Gate Security Office after verifying student identity.',
      category: 'Documents',
      price: '',
      location: 'Central Library, Ground Floor',
      image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80',
      status: 'active'
    }
  ];

  for (const l of initialListings) {
    try {
      await runAsync(`
        INSERT INTO marketplace_listings (id, user_id, user_name, user_roll, type, title, description, category, price, location, image_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [l.id, l.user_id, l.user_name, l.user_roll, l.type, l.title, l.description, l.category, l.price, l.location, l.image_url, l.status]);
    } catch (e) {}
  }

  // 4. Seed Centralized Notifications
  const initialNotifications = [
    {
      user_roll: null,
      type: 'assignment',
      title: 'Assignment Deadline Approaching',
      message: 'Maths-1 Tutorial Sheet 4 (Calculus & Series) is due tomorrow by 11:59 PM. Submit before portal locks.',
      link_view: 'assignments',
      is_read: 0
    },
    {
      user_roll: null,
      type: 'announcement',
      title: 'End-Semester Exam Schedule Notified',
      message: 'Dean Academics published tentative dates for B.Tech 1st Semester w.e.f. 20 Nov 2026.',
      link_view: 'announcements',
      is_read: 0
    },
    {
      user_roll: null,
      type: 'event',
      title: 'HackNR 2026 Team Registrations Open',
      message: 'Flagship 36-hour hackathon with cash prizes up to INR 3,50,000. Limited seats remaining.',
      link_view: 'events',
      is_read: 0
    },
    {
      user_roll: null,
      type: 'mess',
      title: 'Hostel Special Sunday Feast Announced',
      message: 'Hostel Mess Committee finalized the Sunday Feast menu with Paneer Tikka Masala, Veg Biryani & Sweets.',
      link_view: 'mess',
      is_read: 1
    }
  ];

  for (const n of initialNotifications) {
    try {
      await runAsync(`
        INSERT INTO notifications (user_roll, type, title, message, link_view, is_read)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [n.user_roll, n.type, n.title, n.message, n.link_view, n.is_read]);
    } catch (e) {}
  }
}

module.exports = {
  db,
  runAsync,
  getAsync,
  allAsync,
  hashPassword,
  verifyPassword,
  initDatabase,
  seedInitialData,
  seedAdditionalModules,
  seedDSAIStudents
};
