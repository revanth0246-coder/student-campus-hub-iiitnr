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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

  // 3. Timetable Table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      subject TEXT NOT NULL,
      room TEXT DEFAULT '203',
      slot_type TEXT DEFAULT 'm',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(day, time_slot)
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
      link TEXT NOT NULL,
      description TEXT,
      contributor TEXT DEFAULT 'Admin / Academic Affairs',
      notes_count INTEGER DEFAULT 12,
      papers_count INTEGER DEFAULT 6,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Assignments Table (Admin Only Creation)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      faculty TEXT DEFAULT 'Admin / Academic Affairs',
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

  // Check if initial seeding is needed
  const adminCount = await getAsync(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
  if (!adminCount || adminCount.count === 0) {
    await seedInitialData();
  }
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
    'Dr. Anurag Sharma',
    'admin@iiitnr.ac.in',
    hashPassword('admin123'),
    'admin',
    'Office of Academic Affairs',
    'Dean of Academics & Student Welfare',
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
    'Semester 2',
    '7.8',
    '2024 - 2028',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop&crop=faces'
  ]);

  // 3. Seed Second Student
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

  // 4. Seed Official Timetable (Section 1 - Room 203 w.e.f. 24/08/2026)
  const defaultTimetableData = [
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
  ];

  for (const dayItem of defaultTimetableData) {
    for (const [timeSlot, slotInfo] of Object.entries(dayItem.slots)) {
      await runAsync(`
        INSERT OR REPLACE INTO timetable (day, time_slot, subject, room, slot_type)
        VALUES (?, ?, ?, ?, ?)
      `, [dayItem.day, timeSlot, slotInfo.s, slotInfo.r, slotInfo.t]);
    }
  }

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

  console.log('✅ SQLite Database successfully seeded!');
}

module.exports = {
  db,
  runAsync,
  getAsync,
  allAsync,
  hashPassword,
  verifyPassword,
  initDatabase,
  seedInitialData
};
