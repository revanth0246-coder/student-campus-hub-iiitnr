const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { pool, query, initSchema } = require('./index');

// Password hash generator (bcrypt with fallback)
async function generatePasswordHash(password) {
  try {
    return await bcrypt.hash(password, 12);
  } catch (e) {
    return crypto.createHash('sha256').update(password + '_iiitnr_salt_2026').digest('hex');
  }
}

// Official Weekly Timetables for All 3 Branches (w.e.f. 24/08/2026 | IIIT Naya Raipur)
const timetableSeedData = [
  // --- Data Science & AI ---
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '9:00 - 9:55', subject: 'Slot A (Maths)', room: '203', slot_type: 'a' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '10:00 - 10:55', subject: 'Slot B (Prog)', room: '203', slot_type: 'b' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '11:00 - 11:55', subject: 'Slot C (Digital)', room: '203', slot_type: 'c' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '12:00 - 12:55', subject: 'Slot M (IT Work)', room: '203', slot_type: 'm' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (L)', room: '-', slot_type: 'lunch' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '02:00 - 02:55', subject: 'Creative Arts: Music', room: 'Auditorium', slot_type: 'music' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '03:00 - 03:55', subject: 'Slot F (Physics)', room: '203', slot_type: 'f' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '04:00 - 04:55', subject: 'Slot G (Comm)', room: '203', slot_type: 'g' },
  { branch: 'Data Science & AI', day: 'Monday', time_slot: '05:00 - 05:55', subject: 'Free / Library', room: '-', slot_type: 'free' },

  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '9:00 - 9:55', subject: 'Slot B (Prog)', room: '203', slot_type: 'b' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '10:00 - 10:55', subject: 'Slot C (Digital)', room: '203', slot_type: 'c' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '11:00 - 11:55', subject: 'Slot A (Maths)', room: '203', slot_type: 'a' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '12:00 - 12:55', subject: 'Slot F (Physics)', room: '203', slot_type: 'f' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (U)', room: '-', slot_type: 'lunch' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '02:00 - 02:55', subject: 'Health & Wellness: Yoga', room: 'Sports Complex', slot_type: 'yoga' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '03:00 - 03:55', subject: 'Slot G (Comm)', room: '203', slot_type: 'g' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '04:00 - 04:55', subject: 'Slot M (IT Work)', room: '203', slot_type: 'm' },
  { branch: 'Data Science & AI', day: 'Tuesday', time_slot: '05:00 - 05:55', subject: 'Free / Mentorship', room: '-', slot_type: 'free' },

  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '9:00 - 9:55', subject: 'Slot C (Digital)', room: '203', slot_type: 'c' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '10:00 - 10:55', subject: 'Slot A (Maths)', room: '203', slot_type: 'a' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '11:00 - 11:55', subject: 'Slot B (Prog)', room: '203', slot_type: 'b' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '12:00 - 12:55', subject: 'Slot G (Comm)', room: '203', slot_type: 'g' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (N)', room: '-', slot_type: 'lunch' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '02:00 - 02:55', subject: 'Slot N (Discrete)', room: '203', slot_type: 'n' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '03:00 - 03:55', subject: 'Slot M (IT Work)', room: '203', slot_type: 'm' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '04:00 - 04:55', subject: 'Slot F (Physics)', room: '203', slot_type: 'f' },
  { branch: 'Data Science & AI', day: 'Wednesday', time_slot: '05:00 - 05:55', subject: 'Free Study Hour', room: '-', slot_type: 'free' },

  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '9:00 - 9:55', subject: 'Slot F (Physics)', room: '203', slot_type: 'f' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '10:00 - 10:55', subject: 'Slot G (Comm)', room: '203', slot_type: 'g' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '11:00 - 11:55', subject: 'Slot M (IT Work)', room: '203', slot_type: 'm' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '12:00 - 12:55', subject: 'Slot N (Discrete)', room: '203', slot_type: 'n' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (C)', room: '-', slot_type: 'lunch' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '02:00 - 02:55', subject: 'Indian Lang & Culture (ILC)', room: '203', slot_type: 'ilc' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '03:00 - 03:55', subject: 'Slot A (Maths)', room: '203', slot_type: 'a' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '04:00 - 04:55', subject: 'Slot B (Prog)', room: '203', slot_type: 'b' },
  { branch: 'Data Science & AI', day: 'Thursday', time_slot: '05:00 - 05:55', subject: 'Slot C (Digital)', room: '203', slot_type: 'c' },

  { branch: 'Data Science & AI', day: 'Friday', time_slot: '9:00 - 9:55', subject: 'Slot G (Comm)', room: '203', slot_type: 'g' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '10:00 - 10:55', subject: 'Slot M (IT Work)', room: '203', slot_type: 'm' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '11:00 - 11:55', subject: 'Slot N (Discrete)', room: '203', slot_type: 'n' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '12:00 - 12:55', subject: 'Slot A (Maths)', room: '203', slot_type: 'a' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (H)', room: '-', slot_type: 'lunch' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '02:00 - 02:55', subject: 'Creative Arts / Yoga', room: 'Campus Hall', slot_type: 'yoga' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '03:00 - 03:55', subject: 'Slot B (Prog)', room: '203', slot_type: 'b' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '04:00 - 04:55', subject: 'Slot C (Digital)', room: '203', slot_type: 'c' },
  { branch: 'Data Science & AI', day: 'Friday', time_slot: '05:00 - 05:55', subject: 'Slot F (Physics)', room: '203', slot_type: 'f' },

  // --- Computer Science & Engineering ---
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '9:00 - 9:55', subject: 'Slot A (Data Structures)', room: '201', slot_type: 'a' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '10:00 - 10:55', subject: 'Slot B (OOP with Java)', room: '201', slot_type: 'b' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '11:00 - 11:55', subject: 'Slot C (Discrete Maths)', room: '201', slot_type: 'c' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '12:00 - 12:55', subject: 'Slot M (Comp Org & Arch)', room: '201', slot_type: 'm' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (L)', room: '-', slot_type: 'lunch' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '02:00 - 02:55', subject: 'Slot F (Operating Systems)', room: '201', slot_type: 'f' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '03:00 - 03:55', subject: 'Slot G (Theory of Comp)', room: '201', slot_type: 'g' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '04:00 - 04:55', subject: 'Slot B (Web Tech Lab)', room: 'CC Lab 1', slot_type: 'b' },
  { branch: 'Computer Science & Engineering', day: 'Monday', time_slot: '05:00 - 05:55', subject: 'Free / Coding Club', room: 'CC Lab 1', slot_type: 'free' },

  // --- Electronics & Communication ---
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '9:00 - 9:55', subject: 'Slot A (Signals & Systems)', room: '205', slot_type: 'a' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '10:00 - 10:55', subject: 'Slot B (Analog Electronics)', room: '205', slot_type: 'b' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '11:00 - 11:55', subject: 'Slot C (Network Theory)', room: '205', slot_type: 'c' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '12:00 - 12:55', subject: 'Slot M (EM Fields & Waves)', room: '205', slot_type: 'm' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '1:00 - 2:00', subject: 'Lunch Break (L)', room: '-', slot_type: 'lunch' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '02:00 - 02:55', subject: 'Slot F (Digital Comm)', room: '205', slot_type: 'f' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '03:00 - 03:55', subject: 'Slot G (Microprocessors)', room: '205', slot_type: 'g' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '04:00 - 04:55', subject: 'Analog Circuits Lab', room: 'Hardware Lab', slot_type: 'b' },
  { branch: 'Electronics & Communication', day: 'Monday', time_slot: '05:00 - 05:55', subject: 'Free / Robotics Club', room: 'Hardware Lab', slot_type: 'free' }
];

// Curated Study Resources Seed
const resourcesSeedData = [
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

// Campus Events Seed
const eventsSeedData = [
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

// Announcements Seed
const announcementsSeedData = [
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

// Main PostgreSQL Seed Runner
async function runSeed() {
  console.log('======================================================');
  console.log('🌱 Starting PostgreSQL Database Seeding (pg client pool)');
  console.log('📡 Target URL:', process.env.DATABASE_URL ? (process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')) : '(DATABASE_URL not set)');
  console.log('======================================================\n');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please set DATABASE_URL in your environment or .env file before running db/seed.js.');
  }

  // 1. Ensure Schema Exists
  console.log('1. Checking and initializing PostgreSQL schema...');
  await initSchema();

  // 2. Seed Single Admin Account (Parameterized: $1, $2, ...)
  console.log('2. Seeding Primary Administrator Account...');
  const adminId = 'admin_001';
  const adminRoll = 'ADMIN';
  const adminName = process.env.ADMIN_NAME || 'Revanth';
  const adminEmail = (process.env.ADMIN_EMAIL || 'revanth0246@gmail.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'revanth0406';
  const adminDepartment = process.env.ADMIN_DEPARTMENT || 'Office of Academic Affairs';
  const adminDesignation = process.env.ADMIN_DESIGNATION || 'Chief Administrator';
  const adminAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces';
  const adminPasswordHash = await generatePasswordHash(adminPassword);

  const adminSql = `
    INSERT INTO users (id, roll, name, email, password_hash, role, department, designation, avatar)
    VALUES ($1, $2, $3, $4, $5, 'admin', $6, $7, $8)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      password_hash = EXCLUDED.password_hash,
      role = 'admin',
      department = EXCLUDED.department,
      designation = EXCLUDED.designation,
      avatar = EXCLUDED.avatar
  `;
  await query(adminSql, [
    adminId,
    adminRoll,
    adminName,
    adminEmail,
    adminPasswordHash,
    adminDepartment,
    adminDesignation,
    adminAvatar
  ]);
  console.log(`   ✓ Admin account created/updated: ${adminName} (${adminEmail})`);

  // 3. Seed Timetable Slots (Parameterized: $1, $2, ...)
  console.log('3. Seeding Timetable Class Slots for All 3 Branches...');
  const ttSql = `
    INSERT INTO timetable (branch, day, time_slot, subject, room, slot_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (branch, day, time_slot) DO UPDATE SET
      subject = EXCLUDED.subject,
      room = EXCLUDED.room,
      slot_type = EXCLUDED.slot_type,
      updated_at = CURRENT_TIMESTAMP
  `;
  for (const slot of timetableSeedData) {
    await query(ttSql, [slot.branch, slot.day, slot.time_slot, slot.subject, slot.room, slot.slot_type]);
  }
  console.log(`   ✓ Seeded ${timetableSeedData.length} weekly timetable slots.`);

  // 4. Seed Study Resources (Parameterized: $1, $2, ...)
  console.log('4. Seeding Curated Study Resources & Notes...');
  const resSql = `
    INSERT INTO resources (id, subject, title, type, semester, link, description, contributor)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      subject = EXCLUDED.subject,
      title = EXCLUDED.title,
      type = EXCLUDED.type,
      link = EXCLUDED.link,
      description = EXCLUDED.description
  `;
  for (const r of resourcesSeedData) {
    await query(resSql, [r.id, r.subject, r.title, r.type, r.semester, r.link, r.description, r.contributor]);
  }
  console.log(`   ✓ Seeded ${resourcesSeedData.length} curated study resources.`);

  // 5. Seed Campus Events (Parameterized: $1, $2, ...)
  console.log('5. Seeding Campus Events & Hackathons...');
  const evSql = `
    INSERT INTO events (id, title, date_str, venue, category, description, badge_color, banner, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      date_str = EXCLUDED.date_str,
      venue = EXCLUDED.venue,
      description = EXCLUDED.description,
      banner = EXCLUDED.banner
  `;
  for (const ev of eventsSeedData) {
    await query(evSql, [ev.id, ev.title, ev.date_str, ev.venue, ev.category, ev.description, ev.badge_color, ev.banner, ev.created_by]);
  }
  console.log(`   ✓ Seeded ${eventsSeedData.length} campus events.`);

  // 6. Seed Announcements (Parameterized: $1, $2, ...)
  console.log('6. Seeding Official Campus Announcements...');
  const annSql = `
    INSERT INTO announcements (id, title, body, category, urgent, author, date_str)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      category = EXCLUDED.category,
      urgent = EXCLUDED.urgent
  `;
  for (const ann of announcementsSeedData) {
    await query(annSql, [ann.id, ann.title, ann.body, ann.category, ann.urgent, ann.author, ann.date_str]);
  }
  console.log(`   ✓ Seeded ${announcementsSeedData.length} campus announcements.`);

  console.log('\n🎉 PostgreSQL database seeding completed successfully!');
}

// Execute if run directly from CLI
if (require.main === module) {
  runSeed()
    .then(() => pool.end())
    .catch((err) => {
      console.error('❌ Seeding failed with error:', err);
      pool.end().finally(() => process.exit(1));
    });
}

module.exports = { runSeed };
