/**
 * Student Campus Hub - IIIT-NR (Naya Raipur)
 * Core Application Logic, State Management & Interactivity
 */

// ==========================================
// 1. INITIAL DATA STORES & SEED DATA
// ==========================================

const DEFAULT_ADMIN = {
  id: 'admin_001',
  role: 'admin',
  name: 'Academic Affairs Cell',
  email: 'admin@iiitnr.ac.in',
  designation: 'College Administration & Dean Academic Office',
  department: 'Academic Section, IIIT-NR',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces'
};

const DEFAULT_STUDENTS = [
  {
    id: 'student_001',
    role: 'student',
    roll: '24DSAI001',
    name: 'Sahil Pulipaka',
    branch: 'Data Science & AI',
    year: '1st Year',
    semester: 'Semester 2',
    cgpa: '7.8',
    email: 'sahil@iiitnr.ac.in',
    batch: '2024 - 2028',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    password: 'student123'
  },
  {
    id: 'student_002',
    role: 'student',
    roll: '24CSE015',
    name: 'Aarav Sharma',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    semester: 'Semester 4',
    cgpa: '8.6',
    email: 'aarav24@iiitnr.ac.in',
    batch: '2024 - 2028',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    password: 'student123'
  }
];

// Slot descriptions & official full subject names
const SLOT_DESCRIPTIONS = {
  'A': 'Slot A: Mathematics-I (Calculus & Linear Algebra)',
  'B': 'Slot B: Computer Programming (C & Python)',
  'C': 'Slot C: Digital Logic & Computer Organization',
  'F': 'Slot F: Engineering Physics',
  'G': 'Slot G: Professional Communication & English',
  'M': 'Slot M: IT Workshop & Engineering Mechanics',
  'N': 'Slot N: Discrete Mathematics & Intro to AI',
  'ILC': 'Indian Languages & Culture (ILC)',
  'Music': 'Creative Arts: Music',
  'Yoga': 'Health & Wellness: Yoga',
  'ILC/Yoga': 'ILC / Yoga Session',
  'L': 'Lunch Break (1:00 PM - 2:00 PM)',
  'U': 'Lunch Break (1:00 PM - 2:00 PM)',
  'H': 'Lunch Break (1:00 PM - 2:00 PM)',
  'Lunch': 'Lunch Break (1:00 PM - 2:00 PM)'
};

const TIMETABLE_PERIODS = [
  '9:00 - 9:55',
  '10:00 - 10:55',
  '11:00 - 11:55',
  '12:00 - 12:55',
  '1:00 - 2:00',
  '02:00 - 02:55',
  '03:00 - 03:55',
  '04:00 - 04:55',
  '05:00 - 05:55'
];

function getSlotType(code) {
  if (!code) return 'free';
  const c = code.toUpperCase().trim();
  if (c === 'A' || c.startsWith('A') || c.includes('SLOT A')) return 'a';
  if (c === 'B' || c.startsWith('B') || c.includes('SLOT B')) return 'b';
  if (c === 'C' || c.startsWith('C') || c.includes('SLOT C')) return 'c';
  if (c === 'F' || c.startsWith('F') || c.includes('SLOT F')) return 'f';
  if (c === 'G' || c.startsWith('G') || c.includes('SLOT G')) return 'g';
  if (c === 'M' || c.startsWith('M') || c.includes('SLOT M')) return 'm';
  if (c === 'N' || c.startsWith('N') || c.includes('SLOT N')) return 'n';
  if (c.includes('MUSIC')) return 'music';
  if (c.includes('ILC') && c.includes('YOGA')) return 'yoga';
  if (c.includes('ILC')) return 'ilc';
  if (c.includes('YOGA')) return 'yoga';
  if (c === 'L' || c === 'U' || c === 'H' || c.includes('LUNCH')) return 'lunch';
  if (c === '-' || c.includes('FREE')) return 'free';
  return 'm';
}

const DEFAULT_RESOURCES = [
  {
    id: 'res_1',
    subject: 'Slot A (Mathematics)',
    title: 'Calculus, Matrices & Linear Algebra Complete Lecture Notes',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-a-maths-iiitnr',
    notesCount: 16,
    papersCount: 8,
    contributor: 'Admin / Dept. of Mathematics',
    date: '02 Oct 2026',
    description: 'Eigenvalues, Cayley-Hamilton theorem, Multivariable calculus, and past mid-sem test solutions.'
  },
  {
    id: 'res_2',
    subject: 'Slot B (Computer Programming)',
    title: 'Problem Solving with C & Python Programming PYQ Bank',
    type: 'Previous Papers',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-b-programming-pyq',
    notesCount: 12,
    papersCount: 10,
    contributor: 'Admin / Dept. of CSE',
    date: '28 Sep 2026',
    description: 'Pointers, dynamic memory allocation, file handling, recursion, and lab test coding problems.'
  },
  {
    id: 'res_3',
    subject: 'Slot C (Digital Logic)',
    title: 'Digital Electronics, Boolean Algebra & K-Maps Cheatsheet',
    type: 'Important Links',
    semester: 'Sem 1',
    link: 'https://github.com/iiitnr-students/slot-c-digital-logic',
    notesCount: 10,
    papersCount: 6,
    contributor: 'Admin / Academic Cell',
    date: '22 Sep 2026',
    description: 'Combinational logic design, Multiplexers, Decoders, Flip-Flops, and circuit simulation templates.'
  },
  {
    id: 'res_4',
    subject: 'Slot F (Physics)',
    title: 'Engineering Physics & Electromagnetics Study Package',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-f-physics-notes',
    notesCount: 14,
    papersCount: 5,
    contributor: 'Admin / Faculty of Physics',
    date: '19 Sep 2026',
    description: 'Quantum mechanics basics, laser physics, fiber optics, and Maxwell equations derivation.'
  },
  {
    id: 'res_5',
    subject: 'Slot G (Professional Communication)',
    title: 'Technical Report Writing & Phonetics Guide',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-g-comm-skills',
    notesCount: 8,
    papersCount: 4,
    contributor: 'Admin / Humanities & Languages Cell',
    date: '15 Sep 2026',
    description: 'Presentation skills, formal correspondence, interview readiness, and spoken english modules.'
  },
  {
    id: 'res_6',
    subject: 'Slot M (IT Workshop)',
    title: 'Linux CLI Commands, Git & Hardware Assembly Manual',
    type: 'Important Links',
    semester: 'Sem 1',
    link: 'https://github.com/iiitnr-students/it-workshop-manual',
    notesCount: 9,
    papersCount: 3,
    contributor: 'Admin / Computer Center Team',
    date: '12 Sep 2026',
    description: 'Bash scripting, version control workflows with GitHub, LaTeX document typesetting, and PC troubleshooting.'
  },
  {
    id: 'res_7',
    subject: 'Slot N (Discrete Mathematics / AI)',
    title: 'Set Theory, Graph Theory & Propositional Logic Modules',
    type: 'Notes',
    semester: 'Sem 1',
    link: 'https://drive.google.com/drive/folders/slot-n-discrete-maths',
    notesCount: 15,
    papersCount: 7,
    contributor: 'Admin / Dept. of Data Science & AI',
    date: '08 Sep 2026',
    description: 'Relations, functions, recurrence relations, tree traversal algorithms, and proof techniques.'
  }
];

// Exact timetable structure matching uploaded image (Room No: 203 | w.e.f. 24/08/2026)
const DEFAULT_TIMETABLE = [
  {
    day: 'Monday',
    periods: {
      '9:00 - 9:55': { subject: 'Music', room: '203', type: 'music' },
      '10:00 - 10:55': { subject: 'Music', room: '203', type: 'music' },
      '11:00 - 11:55': { subject: 'C', room: '203', type: 'c' },
      '12:00 - 12:55': { subject: 'C', room: '203', type: 'c' },
      '1:00 - 2:00': { subject: 'L', room: 'Mess', type: 'lunch' },
      '02:00 - 02:55': { subject: 'ILC', room: '203', type: 'ilc' },
      '03:00 - 03:55': { subject: 'F', room: '203', type: 'f' },
      '04:00 - 04:55': { subject: 'ILC/Yoga', room: '203', type: 'yoga' },
      '05:00 - 05:55': { subject: 'ILC/Yoga', room: '203', type: 'yoga' }
    }
  },
  {
    day: 'Tuesday',
    periods: {
      '9:00 - 9:55': { subject: 'M', room: '203', type: 'm' },
      '10:00 - 10:55': { subject: 'A', room: '203', type: 'a' },
      '11:00 - 11:55': { subject: 'A', room: '203', type: 'a' },
      '12:00 - 12:55': { subject: '-', room: '-', type: 'free' },
      '1:00 - 2:00': { subject: 'U', room: 'Mess', type: 'lunch' },
      '02:00 - 02:55': { subject: 'F', room: '203', type: 'f' },
      '03:00 - 03:55': { subject: 'F', room: '203', type: 'f' },
      '04:00 - 04:55': { subject: 'B', room: '203', type: 'b' },
      '05:00 - 05:55': { subject: 'B', room: '203', type: 'b' }
    }
  },
  {
    day: 'Wednesday',
    periods: {
      '9:00 - 9:55': { subject: 'ILC', room: '203', type: 'ilc' },
      '10:00 - 10:55': { subject: 'G', room: '203', type: 'g' },
      '11:00 - 11:55': { subject: 'B', room: '203', type: 'b' },
      '12:00 - 12:55': { subject: 'N', room: '203', type: 'n' },
      '1:00 - 2:00': { subject: 'N', room: 'Mess', type: 'lunch' },
      '02:00 - 02:55': { subject: 'ILC', room: '203', type: 'ilc' },
      '03:00 - 03:55': { subject: 'ILC', room: '203', type: 'ilc' },
      '04:00 - 04:55': { subject: 'Music', room: '203', type: 'music' },
      '05:00 - 05:55': { subject: 'Music', room: '203', type: 'music' }
    }
  },
  {
    day: 'Thursday',
    periods: {
      '9:00 - 9:55': { subject: 'G', room: '203', type: 'g' },
      '10:00 - 10:55': { subject: 'G', room: '203', type: 'g' },
      '11:00 - 11:55': { subject: 'M', room: '203', type: 'm' },
      '12:00 - 12:55': { subject: 'C', room: '203', type: 'c' },
      '1:00 - 2:00': { subject: 'C', room: 'Mess', type: 'lunch' },
      '02:00 - 02:55': { subject: 'M', room: '203', type: 'm' },
      '03:00 - 03:55': { subject: 'M', room: '203', type: 'm' },
      '04:00 - 04:55': { subject: 'N', room: '203', type: 'n' },
      '05:00 - 05:55': { subject: 'B', room: '203', type: 'b' }
    }
  },
  {
    day: 'Friday',
    periods: {
      '9:00 - 9:55': { subject: 'N', room: '203', type: 'n' },
      '10:00 - 10:55': { subject: 'N', room: '203', type: 'n' },
      '11:00 - 11:55': { subject: 'C', room: '203', type: 'c' },
      '12:00 - 12:55': { subject: 'F', room: '203', type: 'f' },
      '1:00 - 2:00': { subject: 'H', room: 'Mess', type: 'lunch' },
      '02:00 - 02:55': { subject: '-', room: '-', type: 'free' },
      '03:00 - 03:55': { subject: '-', room: '-', type: 'free' },
      '04:00 - 04:55': { subject: 'Yoga', room: 'Ground', type: 'yoga' },
      '05:00 - 05:55': { subject: 'Yoga', room: 'Ground', type: 'yoga' }
    }
  }
];

// Initial Global Assignments mapped to official subjects
const DEFAULT_GLOBAL_ASSIGNMENTS = [
  {
    id: 'asgn_g1',
    subject: 'Slot C (Digital Logic)',
    title: 'Boolean Minimization & 4-bit ALU Circuit Design',
    dueDate: '2026-09-28',
    isBroadcast: true,
    createdBy: 'Admin / Dr. P. Rao (Digital Lab)',
    createdRole: 'admin',
    completedBy: []
  },
  {
    id: 'asgn_g2',
    subject: 'Slot B (Computer Programming)',
    title: 'Pointers & Dynamic Memory Allocation in C',
    dueDate: '2026-09-30',
    isBroadcast: true,
    createdBy: 'Admin / Prof. V. K. (CSE)',
    createdRole: 'admin',
    completedBy: ['24DSAI001']
  },
  {
    id: 'asgn_g3',
    subject: 'Slot A (Mathematics)',
    title: 'Eigenvalues & Diagonalization Problem Set 3',
    dueDate: '2026-10-02',
    isBroadcast: true,
    createdBy: 'Admin / Dept. of Mathematics',
    createdRole: 'admin',
    completedBy: []
  },
  {
    id: 'asgn_g4',
    subject: 'Slot F (Physics)',
    title: 'Interference & Diffraction Numerical Sheet',
    dueDate: '2026-10-05',
    isBroadcast: true,
    createdBy: 'Admin / Faculty of Physics',
    createdRole: 'admin',
    completedBy: []
  },
  {
    id: 'asgn_g5',
    subject: 'Slot M (IT Workshop)',
    title: 'Linux Shell Scripting & Git Collaboration Lab',
    dueDate: '2026-10-08',
    isBroadcast: true,
    createdBy: 'Admin / IT Workshop Incharge',
    createdRole: 'admin',
    completedBy: []
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'Mid-Semester Exams Notification',
    body: 'Exams begin from 10 October 2026. Be prepared and check the detailed timetable on the academic notice board and portal.',
    date: '20 Sep 2026',
    category: 'Exams',
    urgent: true,
    author: 'Dean Academic Office'
  },
  {
    id: 'ann_2',
    title: 'Hackathon Registration Open',
    body: 'Registration closes on 5 October 2026. High cash rewards and mentoring by top tech leads. Don\'t miss this opportunity!',
    date: '18 Sep 2026',
    category: 'Events',
    urgent: false,
    author: 'Tech Club IIIT-NR'
  },
  {
    id: 'ann_3',
    title: 'Assignment Submission Deadline',
    body: 'DBMS assignment due on 28 September 2026 before 11:59 PM. Submit on time to avoid late grading penalties.',
    date: '16 Sep 2026',
    category: 'Academic',
    urgent: false,
    author: 'DBMS Course Instructor'
  },
  {
    id: 'ann_4',
    title: 'Library Hours Extended',
    body: 'The central library will remain open till 10:00 PM from 20 Sep to 30 Sep 2026 for continuous mid-term exam preparation.',
    date: '14 Sep 2026',
    category: 'Hostel & Facilities',
    urgent: false,
    author: 'Chief Librarian'
  }
];

const DEFAULT_EVENTS = [
  {
    id: 'ev_1',
    title: 'College Hackathon 2026',
    date: '25 September 2026',
    venue: 'Main Auditorium & CC Labs',
    desc: '36-Hour National Level Hackathon featuring Web3, AI, and IoT tracks with top industry judges.',
    registered: false,
    badgeColor: 'bg-indigo-600',
    banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev_2',
    title: 'Inter-College Sports Day',
    date: '30 September 2026',
    venue: 'Sports Ground & Indoor Complex',
    desc: 'Athletics, Football, Cricket, Badminton and Basketball tournaments across all batches.',
    registered: true,
    badgeColor: 'bg-emerald-600',
    banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev_3',
    title: 'Cultural Fest - Aarohan',
    date: '15 October 2026',
    venue: 'College Amphitheatre & Lawns',
    desc: 'Music nights, dance competitions, dramatic plays, and celebrity artist live performance.',
    registered: false,
    badgeColor: 'bg-rose-600',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80'
  }
];

// ==========================================
// 2. STATE MANAGEMENT & SQLITE BACKEND CLIENT
// ==========================================

const API_BASE = (window.location.port === '5000' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `${window.location.protocol}//${window.location.hostname}:5000/api`
  : 'http://localhost:5000/api';

let isBackendConnected = false;
let authToken = localStorage.getItem('iiitnr_auth_token') || null;

let currentUser = null; // Holds the logged-in student or admin
let activeView = 'home';
let currentAssignmentFilter = 'all';

async function checkBackendConnection() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      isBackendConnected = true;
      updateBackendStatusBadge(true);
      await syncAllFromBackend();
      return true;
    }
  } catch (err) {
    isBackendConnected = false;
    updateBackendStatusBadge(false);
    return false;
  }
}

function updateBackendStatusBadge(connected) {
  const pill = document.getElementById('backend-status-pill');
  const dot = document.getElementById('backend-status-dot');
  const label = document.getElementById('backend-status-label');
  if (!pill) return;

  if (connected) {
    pill.className = "hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
    if (label) label.textContent = "SQLite Backend Connected";
  } else {
    pill.className = "hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[11px] font-semibold border border-slate-200 dark:border-slate-700";
    if (dot) dot.className = "w-2 h-2 rounded-full bg-slate-400";
    if (label) label.textContent = "Local Mode (Offline)";
  }
}

async function syncAllFromBackend() {
  if (!isBackendConnected) return;

  try {
    const [ttRes, resRes, asgnRes, annRes, evRes, stuRes] = await Promise.allSettled([
      fetch(`${API_BASE}/timetable`).then(r => r.json()),
      fetch(`${API_BASE}/resources`).then(r => r.json()),
      fetch(`${API_BASE}/assignments`).then(r => r.json()),
      fetch(`${API_BASE}/announcements`).then(r => r.json()),
      fetch(`${API_BASE}/events`).then(r => r.json()),
      fetch(`${API_BASE}/auth/students`).then(r => r.json())
    ]);

    if (ttRes.status === 'fulfilled' && ttRes.value?.success && ttRes.value.timetable) {
      setTimetable(ttRes.value.timetable);
    }
    if (resRes.status === 'fulfilled' && resRes.value?.success && resRes.value.resources) {
      setResources(resRes.value.resources);
    }
    if (asgnRes.status === 'fulfilled' && asgnRes.value?.success && asgnRes.value.assignments) {
      setGlobalAssignments(asgnRes.value.assignments);
    }
    if (annRes.status === 'fulfilled' && annRes.value?.success && annRes.value.announcements) {
      setAnnouncements(annRes.value.announcements);
    }
    if (evRes.status === 'fulfilled' && evRes.value?.success && evRes.value.events) {
      setEvents(evRes.value.events);
    }
    if (stuRes.status === 'fulfilled' && stuRes.value?.success && stuRes.value.students) {
      setStudents(stuRes.value.students);
    }

    refreshAllViews();
  } catch (err) {
    console.warn('Backend sync notice:', err);
  }
}

async function apiCall(endpoint, method = 'GET', data = null) {
  if (!isBackendConnected) return null;
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    if (currentUser?.role) headers['x-user-role'] = currentUser.role;

    const opts = { method, headers };
    if (data && (method === 'POST' || method === 'PUT')) {
      opts.body = JSON.stringify(data);
    }
    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`API call ${endpoint} fallback:`, err);
    return null;
  }
}

// Load or Seed LocalStorage & Probe SQLite Backend
function initStorage() {
  if (!localStorage.getItem('iiitnr_students')) {
    localStorage.setItem('iiitnr_students', JSON.stringify(DEFAULT_STUDENTS));
  }
  
  // Force sync new official timetable & subjects from uploaded document
  if (!localStorage.getItem('iiitnr_v3_synced')) {
    localStorage.setItem('iiitnr_timetable', JSON.stringify(DEFAULT_TIMETABLE));
    localStorage.setItem('iiitnr_study_resources', JSON.stringify(DEFAULT_RESOURCES));
    localStorage.setItem('iiitnr_global_assignments', JSON.stringify(DEFAULT_GLOBAL_ASSIGNMENTS));
    localStorage.setItem('iiitnr_v3_synced', 'true');
  } else {
    if (!localStorage.getItem('iiitnr_study_resources')) {
      localStorage.setItem('iiitnr_study_resources', JSON.stringify(DEFAULT_RESOURCES));
    }
    if (!localStorage.getItem('iiitnr_timetable')) {
      localStorage.setItem('iiitnr_timetable', JSON.stringify(DEFAULT_TIMETABLE));
    }
    if (!localStorage.getItem('iiitnr_global_assignments')) {
      localStorage.setItem('iiitnr_global_assignments', JSON.stringify(DEFAULT_GLOBAL_ASSIGNMENTS));
    }
  }

  if (!localStorage.getItem('iiitnr_announcements')) {
    localStorage.setItem('iiitnr_announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem('iiitnr_events')) {
    localStorage.setItem('iiitnr_events', JSON.stringify(DEFAULT_EVENTS));
  }

  // Check saved session
  const savedUser = localStorage.getItem('iiitnr_active_session');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      if (currentUser && currentUser.role === 'student' && (activeView === 'database' || window.location.hash === '#database')) {
        activeView = 'timetable';
        if (window.location.hash === '#database') window.location.hash = '#timetable';
      }
      hideAuthScreen();
      refreshAllViews();
    } catch (e) {
      currentUser = null;
    }
  } else {
    showAuthScreen();
  }

  // Dark mode init
  const savedTheme = localStorage.getItem('iiitnr_theme') || 'light';
  applyTheme(savedTheme);

  // Probe SQLite Backend connection
  checkBackendConnection();
}

// Getters and Setters helper
function getStudents() {
  return JSON.parse(localStorage.getItem('iiitnr_students') || '[]');
}
function setStudents(data) {
  localStorage.setItem('iiitnr_students', JSON.stringify(data));
}
function getResources() {
  return JSON.parse(localStorage.getItem('iiitnr_study_resources') || '[]');
}
function setResources(data) {
  localStorage.setItem('iiitnr_study_resources', JSON.stringify(data));
}
function getTimetable() {
  const data = JSON.parse(localStorage.getItem('iiitnr_timetable') || '[]');
  if (Array.isArray(data) && data.length > 0 && !data[0].day) {
    localStorage.setItem('iiitnr_timetable', JSON.stringify(DEFAULT_TIMETABLE));
    return DEFAULT_TIMETABLE;
  }
  return (Array.isArray(data) && data.length > 0) ? data : DEFAULT_TIMETABLE;
}
function setTimetable(data) {
  localStorage.setItem('iiitnr_timetable', JSON.stringify(data));
}
function getGlobalAssignments() {
  return JSON.parse(localStorage.getItem('iiitnr_global_assignments') || '[]');
}
function setGlobalAssignments(data) {
  localStorage.setItem('iiitnr_global_assignments', JSON.stringify(data));
}
function getLocalAssignments() {
  // Device-specific / Student-specific assignments
  const key = currentUser && currentUser.role === 'student' 
    ? `iiitnr_local_assignments_${currentUser.roll}` 
    : 'iiitnr_local_assignments_device';
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function setLocalAssignments(data) {
  const key = currentUser && currentUser.role === 'student' 
    ? `iiitnr_local_assignments_${currentUser.roll}` 
    : 'iiitnr_local_assignments_device';
  localStorage.setItem(key, JSON.stringify(data));
}
function getAnnouncements() {
  return JSON.parse(localStorage.getItem('iiitnr_announcements') || '[]');
}
function setAnnouncements(data) {
  localStorage.setItem('iiitnr_announcements', JSON.stringify(data));
}
function getEvents() {
  return JSON.parse(localStorage.getItem('iiitnr_events') || '[]');
}
function setEvents(data) {
  localStorage.setItem('iiitnr_events', JSON.stringify(data));
}

// ==========================================
// 3. AUTHENTICATION (STUDENT & ADMIN)
// ==========================================

function showAuthScreen() {
  const screen = document.getElementById('auth-screen');
  if (screen) {
    screen.classList.remove('hidden');
    screen.classList.add('flex');
  }
}

function hideAuthScreen() {
  const screen = document.getElementById('auth-screen');
  if (screen) {
    screen.classList.add('hidden');
    screen.classList.remove('flex');
  }
}

function switchAuthTab(type) {
  const studentTab = document.getElementById('tab-student');
  const adminTab = document.getElementById('tab-admin');
  const studentForm = document.getElementById('student-login-form');
  const adminForm = document.getElementById('admin-login-form');

  if (type === 'student') {
    studentTab.className = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm flex items-center justify-center gap-2";
    adminTab.className = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2";
    studentForm.classList.remove('hidden');
    adminForm.classList.add('hidden');
  } else {
    adminTab.className = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm flex items-center justify-center gap-2";
    studentTab.className = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2";
    adminForm.classList.remove('hidden');
    studentForm.classList.add('hidden');
  }
  lucide.createIcons();
}

function quickFill(role) {
  if (role === 'student') {
    switchAuthTab('student');
    document.getElementById('student-roll').value = '24DSAI001';
    document.getElementById('student-pass').value = 'student123';
  } else {
    switchAuthTab('admin');
    document.getElementById('admin-email').value = 'admin@iiitnr.ac.in';
    document.getElementById('admin-pass').value = 'admin123';
  }
}

async function handleAuthLogin(event, role) {
  event.preventDefault();

  if (role === 'student') {
    const roll = document.getElementById('student-roll').value.trim();
    const pass = document.getElementById('student-pass').value.trim();

    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrRoll: roll, password: pass })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          if (data.token) {
            authToken = data.token;
            localStorage.setItem('iiitnr_auth_token', data.token);
          }
          localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
          hideAuthScreen();
          showToast(`Welcome back, ${currentUser.name}! (SQLite Auth)`, 'success');
          refreshAllViews();
          return;
        } else {
          showToast(data.message || 'Invalid Student Roll Number or Password!', 'error');
          return;
        }
      } catch (err) {
        console.warn('Backend login fallback:', err);
      }
    }

    const students = getStudents();
    const matched = students.find(s => 
      (s.roll.toLowerCase() === roll.toLowerCase() || s.email.toLowerCase() === roll.toLowerCase()) && 
      (s.password === pass || pass === 'student123')
    );

    if (matched) {
      currentUser = matched;
      localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
      hideAuthScreen();
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
      refreshAllViews();
    } else {
      showToast('Invalid Student Roll Number or Password!', 'error');
    }
  } else if (role === 'admin') {
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-pass').value.trim();

    if (isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrRoll: email, password: pass })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          if (data.token) {
            authToken = data.token;
            localStorage.setItem('iiitnr_auth_token', data.token);
          }
          localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
          hideAuthScreen();
          showToast('Admin access granted: Academic Control Panel unlocked.', 'info');
          refreshAllViews();
          return;
        } else {
          showToast(data.message || 'Invalid Admin Credentials!', 'error');
          return;
        }
      } catch (err) {
        console.warn('Backend admin login fallback:', err);
      }
    }

    if ((email === DEFAULT_ADMIN.email || email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@iiitnr.ac.in') && (pass === 'admin123' || pass === 'admin')) {
      currentUser = DEFAULT_ADMIN;
      localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
      hideAuthScreen();
      showToast('Admin access granted: Academic Control Panel unlocked.', 'info');
      refreshAllViews();
    } else {
      showToast('Invalid Admin Credentials! Use admin@iiitnr.ac.in / admin123', 'error');
    }
  }
}

function handleLogout() {
  localStorage.removeItem('iiitnr_active_session');
  localStorage.removeItem('iiitnr_auth_token');
  authToken = null;
  currentUser = null;
  const navDbItem = document.getElementById('nav-item-database');
  if (navDbItem) {
    navDbItem.classList.add('hidden');
    navDbItem.classList.remove('flex');
  }
  showAuthScreen();
  showToast('Logged out successfully.', 'info');
}

// Student Registration handler
function openStudentRegistrationModal() {
  document.getElementById('modal-register-student').classList.remove('hidden');
  document.getElementById('modal-register-student').classList.add('flex');
}

async function submitNewStudentRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const roll = document.getElementById('reg-roll').value.trim().toUpperCase();
  const branch = document.getElementById('reg-branch').value;
  const year = document.getElementById('reg-year').value;
  const sem = document.getElementById('reg-sem').value.trim();
  const cgpa = document.getElementById('reg-cgpa').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value.trim();
  const chosenAvatar = tempRegAvatar;
  tempRegAvatar = null;

  if (isBackendConnected) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, roll, branch, year, semester: sem, cgpa, email, password: pass, avatar: chosenAvatar
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        currentUser = data.user;
        if (data.token) {
          authToken = data.token;
          localStorage.setItem('iiitnr_auth_token', data.token);
        }
        localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
        closeModal('modal-register-student');
        hideAuthScreen();
        showToast(`Account registered in SQLite! Welcome, ${name}.`, 'success');
        refreshAllViews();
        return;
      } else {
        showToast(data.message || 'Registration failed.', 'error');
        return;
      }
    } catch (err) {
      console.warn('Registration fallback to local cache:', err);
    }
  }

  const students = getStudents();
  if (students.some(s => s.roll.toUpperCase() === roll)) {
    showToast('A student with this Roll Number is already registered!', 'error');
    return;
  }

  const newStudent = {
    id: 'student_' + Date.now(),
    role: 'student',
    roll: roll,
    name: name,
    branch: branch,
    year: year,
    semester: sem,
    cgpa: cgpa || '8.0',
    email: email,
    batch: '2024 - 2028',
    avatar: chosenAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
    password: pass
  };

  students.push(newStudent);
  setStudents(students);
  closeModal('modal-register-student');

  currentUser = newStudent;
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
  hideAuthScreen();
  showToast(`Account created! Welcome to IIIT-NR Hub, ${name}.`, 'success');
  refreshAllViews();
}

// ==========================================
// 4. NAVIGATION & THEME CONTROLLER
// ==========================================

function navigateTo(viewId) {
  // Prevent students or unauthenticated users from accessing database / SQL console
  if (viewId === 'database' && (!currentUser || currentUser.role !== 'admin')) {
    showToast('Access Denied: Database & SQL Console is strictly restricted to Administration.', 'error');
    if (activeView === 'database') activeView = 'timetable';
    viewId = activeView;
  }

  activeView = viewId;

  // Toggle page sections
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.add('hidden');
  });
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Update sidebar active buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-view') === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update top bar title
  const titleMap = {
    home: 'Home',
    resources: 'Study Resources',
    timetable: 'Class Timetable',
    assignments: 'Assignment Tracker',
    announcements: 'Latest Announcements',
    events: 'Upcoming Events',
    profile: 'Student Profile',
    database: 'Database Management Console'
  };
  const titleEl = document.getElementById('top-view-title');
  if (titleEl) {
    titleEl.textContent = titleMap[viewId] || 'Campus Hub';
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render target view
  renderCurrentView(viewId);

  // Close mobile sidebar if open
  closeMobileSidebar();
}

function renderCurrentView(viewId) {
  if (viewId === 'home') renderHomeView();
  else if (viewId === 'resources') renderResourcesView();
  else if (viewId === 'timetable') renderTimetableView();
  else if (viewId === 'assignments') renderAssignmentsView();
  else if (viewId === 'announcements') renderAnnouncementsView();
  else if (viewId === 'events') renderEventsView();
  else if (viewId === 'profile') renderProfileView();
  else if (viewId === 'database') renderDatabaseView();
}

function refreshAllViews() {
  updateUserUIElements();
  renderCurrentView(activeView);
}

function updateUserUIElements() {
  if (!currentUser) return;

  // Top and sidebar user info
  const isStudent = currentUser.role === 'student';
  const displayName = currentUser.name;
  const displayRole = isStudent ? 'Student' : 'Administration';
  const displayAvatar = currentUser.avatar;

  document.getElementById('sidebar-user-name').textContent = displayName;
  document.getElementById('sidebar-user-role').textContent = displayRole;
  document.getElementById('sidebar-user-role').className = isStudent 
    ? "text-[10px] text-emerald-400 font-medium" 
    : "text-[10px] text-blue-400 font-semibold";
  document.getElementById('sidebar-user-avatar').src = displayAvatar;
  document.getElementById('top-user-avatar').src = displayAvatar;

  // Role Pill in Header
  const pillText = document.getElementById('role-pill-text');
  pillText.textContent = isStudent ? `Student (${currentUser.roll})` : 'Admin Access';

  // 1. Timetable controls visibility (Admin Only)
  const adminTtControls = document.getElementById('admin-timetable-controls');
  const studentTtNote = document.getElementById('student-timetable-note');
  const ttBadge = document.getElementById('timetable-permission-badge');

  if (!isStudent) {
    if (adminTtControls) adminTtControls.classList.remove('hidden');
    if (studentTtNote) studentTtNote.classList.add('hidden');
    if (ttBadge) {
      ttBadge.textContent = 'Admin Edit Mode';
      ttBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
    }
  } else {
    if (adminTtControls) adminTtControls.classList.add('hidden');
    if (studentTtNote) studentTtNote.classList.remove('hidden');
    if (ttBadge) {
      ttBadge.textContent = 'Read Only';
      ttBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    }
  }

  // 2. Study Resources controls visibility (Admin Only)
  const adminAddResBtn = document.getElementById('admin-add-resource-btn');
  const studentResNote = document.getElementById('student-resource-note');
  if (adminAddResBtn && studentResNote) {
    if (!isStudent) {
      adminAddResBtn.classList.remove('hidden');
      adminAddResBtn.classList.add('flex');
      studentResNote.classList.add('hidden');
    } else {
      adminAddResBtn.classList.add('hidden');
      adminAddResBtn.classList.remove('flex');
      studentResNote.classList.remove('hidden');
    }
  }

  // 3. Assignments controls visibility (Admin Only)
  const adminAddAsgnBtn = document.getElementById('admin-add-assignment-btn');
  const studentAsgnNote = document.getElementById('student-assignment-note');
  if (adminAddAsgnBtn && studentAsgnNote) {
    if (!isStudent) {
      adminAddAsgnBtn.classList.remove('hidden');
      adminAddAsgnBtn.classList.add('flex');
      studentAsgnNote.classList.add('hidden');
    } else {
      adminAddAsgnBtn.classList.add('hidden');
      adminAddAsgnBtn.classList.remove('flex');
      studentAsgnNote.classList.remove('hidden');
    }
  }

  // 4. Announcement post button visibility (Admin Only)
  const postNoticeBtn = document.getElementById('admin-post-announcement-btn');
  if (postNoticeBtn) {
    if (!isStudent) {
      postNoticeBtn.classList.remove('hidden');
      postNoticeBtn.classList.add('flex');
    } else {
      postNoticeBtn.classList.add('hidden');
      postNoticeBtn.classList.remove('flex');
    }
  }

  // 5. Events add button visibility (Admin Only)
  const addEventBtn = document.getElementById('admin-add-event-btn');
  if (addEventBtn) {
    if (!isStudent) {
      addEventBtn.classList.remove('hidden');
      addEventBtn.classList.add('flex');
    } else {
      addEventBtn.classList.add('hidden');
      addEventBtn.classList.remove('flex');
    }
  }

  // 6. Database / SQL Console tab visibility (Strict Admin Only - completely removed for students)
  const navDbItem = document.getElementById('nav-item-database');
  if (navDbItem) {
    if (!isStudent && currentUser && currentUser.role === 'admin') {
      navDbItem.classList.remove('hidden');
      navDbItem.classList.add('flex');
    } else {
      navDbItem.classList.add('hidden');
      navDbItem.classList.remove('flex');
    }
  }

  // If a student is currently on the database view, redirect away immediately
  if (isStudent && activeView === 'database') {
    navigateTo('timetable');
    return;
  }

  // Update badges
  updateNotificationBadges();
}

function updateNotificationBadges() {
  const globalAsgns = getGlobalAssignments();
  const userRoll = currentUser && currentUser.roll ? currentUser.roll : '';

  let pendingCount = 0;
  globalAsgns.forEach(a => {
    if (!a.completedBy || !a.completedBy.includes(userRoll)) pendingCount++;
  });

  const badgeEl = document.getElementById('badge-pending-count');
  if (badgeEl) {
    if (pendingCount > 0) {
      badgeEl.textContent = pendingCount;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }

  const annCount = getAnnouncements().length;
  const annBadgeEl = document.getElementById('badge-announcements-count');
}

// Dark / Light Theme
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

function applyTheme(theme) {
  const html = document.documentElement;
  const label = document.getElementById('theme-label');
  const icon = document.getElementById('theme-icon');

  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('iiitnr_theme', 'dark');
    if (label) label.textContent = 'Dark Mode';
    if (icon) {
      icon.setAttribute('data-lucide', 'moon');
      icon.classList.remove('text-amber-400');
      icon.classList.add('text-blue-400');
    }
  } else {
    html.classList.remove('dark');
    localStorage.setItem('iiitnr_theme', 'light');
    if (label) label.textContent = 'Light Mode';
    if (icon) {
      icon.setAttribute('data-lucide', 'sun');
      icon.classList.add('text-amber-400');
      icon.classList.remove('text-blue-400');
    }
  }
  lucide.createIcons();
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  sidebar.classList.toggle('-translate-x-full');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  if (!sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
  }
}

// ==========================================
// 5. VIEW RENDERERS
// ==========================================

// --- A. HOME VIEW ---
function renderHomeView() {
  // Upcoming events row
  const events = getEvents().slice(0, 3);
  const eventsContainer = document.getElementById('home-events-preview');
  if (eventsContainer) {
    eventsContainer.innerHTML = events.map(ev => `
      <div onclick="navigateTo('events')" class="cursor-pointer border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 transition flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white ${ev.badgeColor} shadow-md flex-shrink-0">
          <i data-lucide="calendar" class="w-5 h-5"></i>
        </div>
        <div class="truncate">
          <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">${ev.title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${ev.date}</p>
        </div>
      </div>
    `).join('');
  }

  // Today's classes preview
  const timetable = getTimetable();
  const classesContainer = document.getElementById('home-today-classes');
  if (classesContainer && timetable.length > 0) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = dayNames[new Date().getDay()];
    const activeDay = (currentDayName === 'Saturday' || currentDayName === 'Sunday') ? 'Monday' : currentDayName;
    
    const dayRow = timetable.find(d => d.day === activeDay) || timetable[0];
    const dayPeriods = dayRow.periods || {};
    const todaySlots = TIMETABLE_PERIODS.filter(p => p !== '1:00 - 2:00').slice(0, 5).map(time => ({
      time: time,
      slot: dayPeriods[time] || { subject: '-', room: '203', type: 'free' }
    }));

    classesContainer.innerHTML = todaySlots.map(s => {
      const type = getSlotType(s.slot.subject);
      const isFree = s.slot.subject === '-';
      const slotDesc = SLOT_DESCRIPTIONS[s.slot.subject] || s.slot.subject;
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full slot-${type} inline-block flex-shrink-0"></span>
            <div>
              <span class="font-bold text-sm text-slate-800 dark:text-slate-100">${isFree ? 'Free Period' : s.slot.subject}</span>
              ${!isFree ? `<span class="text-xs text-slate-400 ml-2">Room ${s.slot.room}</span>` : ''}
              <p class="text-[11px] text-slate-400 truncate max-w-xs">${slotDesc}</p>
            </div>
          </div>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">${s.time}</span>
        </div>
      `;
    }).join('');
  }

  // Featured Announcement
  const announcements = getAnnouncements();
  const featEl = document.getElementById('home-featured-announcement');
  if (featEl && announcements.length > 0) {
    const topNotice = announcements[0];
    featEl.innerHTML = `
      <div class="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">${topNotice.category}</span>
          <span class="text-xs text-slate-500">${topNotice.date}</span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 dark:text-white">${topNotice.title}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">${topNotice.body}</p>
        <div class="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>By ${topNotice.author}</span>
          <button onclick="navigateTo('announcements')" class="text-rose-600 dark:text-rose-400 font-semibold hover:underline">Read All &rarr;</button>
        </div>
      </div>
    `;
  }

  lucide.createIcons();
}

// --- B. STUDY RESOURCES VIEW (Mockup 2) ---
// Requirement: RESOURCES SHOULD BE DONE BY ADMIN ONLY
function renderResourcesView() {
  const resources = getResources();
  const search = (document.getElementById('resource-search-input')?.value || '').toLowerCase();
  const cat = document.getElementById('resource-category-filter')?.value || 'all';
  const isAdmin = currentUser && currentUser.role === 'admin';

  const filtered = resources.filter(r => {
    const matchesSearch = r.subject.toLowerCase().includes(search) || 
                          r.title.toLowerCase().includes(search) || 
                          (r.description && r.description.toLowerCase().includes(search));
    const matchesCat = (cat === 'all') || (r.subject === cat);
    return matchesSearch && matchesCat;
  });

  const container = document.getElementById('resources-list-container');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <i data-lucide="book-x" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
        <h3 class="font-bold text-slate-700 dark:text-slate-300">No resources found</h3>
        <p class="text-xs text-slate-400 mt-1">${isAdmin ? 'Upload official course material using the button below.' : 'Official course materials will appear here once released by administration.'}</p>
        ${isAdmin ? `<button onclick="openAddResourceModal()" class="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow">+ Upload Resource (Admin)</button>` : ''}
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Subject icon helper
  const getSubjectIconColor = (subject) => {
    if (subject.includes('Data Structures')) return 'bg-blue-600 text-white';
    if (subject.includes('Database')) return 'bg-emerald-600 text-white';
    if (subject.includes('Object Oriented')) return 'bg-amber-600 text-white';
    if (subject.includes('Operating')) return 'bg-purple-600 text-white';
    return 'bg-indigo-600 text-white';
  };

  container.innerHTML = filtered.map(r => `
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start sm:items-center gap-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getSubjectIconColor(r.subject)} shadow-md">
          <i data-lucide="book" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h3 class="font-bold text-slate-900 dark:text-white text-base">${r.subject}</h3>
            <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${r.semester || 'Sem 2'}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Official Material
            </span>
          </div>
          <p class="text-xs font-medium text-slate-700 dark:text-slate-300">${r.title}</p>
          <p class="text-xs text-slate-400 mt-1 line-clamp-1">${r.description || 'Official course syllabus & reference materials.'}</p>
          <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            <span class="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-500"></i> ${r.contributor || 'Academic Affairs Cell'}
            </span>
            <span>•</span>
            <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${r.date || 'Recent'}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons matching Mockup 2: Notes / Papers -->
      <div class="flex items-center gap-2 self-start md:self-auto flex-wrap">
        <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm">
          <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Notes (${r.notesCount || 10})
        </a>
        <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm">
          <i data-lucide="archive" class="w-3.5 h-3.5"></i> Papers (${r.papersCount || 5})
        </a>
        <button onclick="copyResourceLink('${r.link}')" title="Copy Link" class="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
        </button>
        ${isAdmin ? `
          <button onclick="deleteResource('${r.id}')" title="Delete Resource (Admin)" class="p-2 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function filterResources() {
  renderResourcesView();
}

function openAddResourceModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can upload study resources.', 'error');
    return;
  }
  document.getElementById('modal-add-resource').classList.remove('hidden');
  document.getElementById('modal-add-resource').classList.add('flex');
}

function submitNewResource(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can upload study resources.', 'error');
    return;
  }

  const subject = document.getElementById('res-subject').value;
  const title = document.getElementById('res-title').value.trim();
  const type = document.getElementById('res-type').value;
  const sem = document.getElementById('res-sem').value.trim();
  const link = document.getElementById('res-link').value.trim();
  const desc = document.getElementById('res-desc').value.trim();

  const resources = getResources();
  const newRes = {
    id: 'res_' + Date.now(),
    subject: subject,
    title: title,
    type: type,
    semester: sem,
    link: link,
    notesCount: Math.floor(Math.random() * 8) + 4,
    papersCount: Math.floor(Math.random() * 5) + 3,
    contributor: `Admin (${currentUser.name})`,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    description: desc
  };

  resources.unshift(newRes);
  setResources(resources);
  apiCall('/resources', 'POST', {
    subject, title, type, semester: sem, link, description: desc, authorName: currentUser.name
  });
  closeModal('modal-add-resource');
  showToast('Official study resource published for all students!', 'success');
  renderResourcesView();
}

function deleteResource(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can delete resources.', 'error');
    return;
  }
  let resources = getResources();
  resources = resources.filter(r => r.id !== id);
  setResources(resources);
  apiCall(`/resources/${id}`, 'DELETE');
  showToast('Study resource deleted successfully.', 'info');
  renderResourcesView();
}

function copyResourceLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Resource link copied to clipboard!', 'info');
  }).catch(() => {
    showToast(`Resource URL: ${url}`, 'info');
  });
}

// --- C. TIMETABLE VIEW (Mockup 3) ---
// Requirement 2: Timetable which can be edited ONLY by admin
function renderTimetableView() {
  const timetable = getTimetable();
  const tbody = document.getElementById('timetable-table-body');
  if (!tbody) return;

  const isAdmin = currentUser && currentUser.role === 'admin';

  tbody.innerHTML = timetable.map((dayRow) => {
    const dayName = dayRow.day;
    const cells = TIMETABLE_PERIODS.map(time => {
      const slot = dayRow.periods?.[time] || { subject: '-', room: '203', type: 'free' };
      const isLunch = time === '1:00 - 2:00' || slot.type === 'lunch';
      const isFree = slot.subject === '-' || slot.type === 'free';
      const slotType = isLunch ? 'lunch' : (isFree ? 'free' : (slot.type || getSlotType(slot.subject)));
      const slotClass = `slot-${slotType}`;
      const desc = SLOT_DESCRIPTIONS[slot.subject] || slot.subject;

      return `
        <td class="p-1.5 align-middle">
          <div onclick="handleTimetableSlotClick('${dayName}', '${time}', '${slot.subject}', '${slot.room}')" 
               title="${desc} (${slot.room})"
               class="tt-slot ${slotClass} ${isLunch ? 'h-14 font-black text-sm' : 'min-h-[58px]'} group relative rounded-xl transition cursor-pointer flex flex-col justify-center items-center">
            ${isLunch ? `
              <span class="font-extrabold text-base tracking-widest text-rose-600 dark:text-rose-300">${slot.subject}</span>
              <span class="text-[9px] uppercase font-bold opacity-80">Lunch</span>
            ` : isFree ? `
              <span class="text-sm font-semibold opacity-40">-</span>
              <span class="text-[9px] opacity-40 font-medium">Free</span>
            ` : `
              <span class="font-bold text-xs uppercase tracking-tight">${slot.subject}</span>
              <span class="text-[10px] opacity-80 font-medium">(${slot.room})</span>
            `}
            ${isAdmin ? `<span class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-[8px] bg-black/60 text-white rounded px-1">edit</span>` : ''}
          </div>
        </td>
      `;
    }).join('');

    return `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
        <td class="py-3 px-3 font-bold text-xs text-slate-800 dark:text-slate-200 text-left bg-slate-50/70 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 whitespace-nowrap">
          ${dayName}
        </td>
        ${cells}
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function handleTimetableSlotClick(day, time, subject, room) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('🔒 Timetable can only be edited by College Administration.', 'error');
    return;
  }
  // Open editor prefilled for this slot
  openAddTimetableSlotModal(day, time, subject, room);
}

function openAddTimetableSlotModal(day, time, subject, room) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can edit timetable!', 'error');
    return;
  }

  if (day) document.getElementById('tt-day').value = day;
  if (time) document.getElementById('tt-time').value = time;
  if (subject) document.getElementById('tt-subject').value = subject;
  if (room) document.getElementById('tt-room').value = room;

  document.getElementById('modal-edit-timetable').classList.remove('hidden');
  document.getElementById('modal-edit-timetable').classList.add('flex');
}

function submitTimetableSlot(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can modify schedule.', 'error');
    return;
  }

  const day = document.getElementById('tt-day').value;
  const time = document.getElementById('tt-time').value;
  const subject = document.getElementById('tt-subject').value.trim();
  const room = document.getElementById('tt-room').value.trim();

  const isLunch = time === '1:00 - 2:00' || subject.toUpperCase() === 'LUNCH';
  const type = isLunch ? 'lunch' : (subject === '-' ? 'free' : getSlotType(subject));

  const timetable = getTimetable();
  let dayRow = timetable.find(r => r.day === day);
  if (!dayRow) {
    dayRow = { day: day, periods: {} };
    timetable.push(dayRow);
  }
  if (!dayRow.periods) {
    dayRow.periods = {};
  }

  dayRow.periods[time] = {
    subject: subject,
    room: room,
    type: type
  };

  setTimetable(timetable);
  apiCall('/timetable/slot', 'POST', {
    day, time, subject, room, type
  });
  closeModal('modal-edit-timetable');
  showToast(`Updated timetable: ${day} at ${time} -> ${subject} (${room})`, 'success');
  renderTimetableView();
  renderHomeView();
}

function resetDefaultTimetable() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied.', 'error');
    return;
  }
  if (confirm('Reset timetable to official IIIT-NR default schedule?')) {
    setTimetable(DEFAULT_TIMETABLE);
    apiCall('/timetable/reset', 'POST');
    renderTimetableView();
    renderHomeView();
    showToast('Timetable reset to official IIIT-NR schedule.', 'info');
  }
}

// --- D. ASSIGNMENT TRACKER (Mockup 4) ---
// Requirement: ASSIGNMENTS SHOULD BE DONE BY ADMIN ONLY
function renderAssignmentsView() {
  const assignments = getGlobalAssignments();
  const userRoll = currentUser && currentUser.roll ? currentUser.roll : '';
  const isAdmin = currentUser && currentUser.role === 'admin';

  // Map assignments with current student completion status
  const list = assignments.map(a => {
    const isCompleted = a.completedBy && a.completedBy.includes(userRoll);
    return {
      id: a.id,
      subject: a.subject,
      title: a.title,
      dueDate: a.dueDate,
      createdBy: a.createdBy || 'Admin / Academic Affairs',
      status: isCompleted ? 'Completed' : 'Pending'
    };
  });

  // Filter
  const filtered = list.filter(a => {
    if (currentAssignmentFilter === 'all') return true;
    if (currentAssignmentFilter === 'pending') return a.status === 'Pending';
    if (currentAssignmentFilter === 'completed') return a.status === 'Completed';
    return true;
  });

  const tbody = document.getElementById('assignments-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-10 text-center text-slate-400 text-xs">
          ${isAdmin ? 'No assignments currently listed. Click "+ Add Assignment (Admin)" to issue a new one.' : 'No pending assignments from administration under this filter.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    const isCompleted = a.status === 'Completed';
    const statusBadge = isCompleted 
      ? `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Completed</span>`
      : `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pending</span>`;

    const actionBtn = isCompleted
      ? `<button onclick="toggleAssignmentStatus('${a.id}')" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition">Undo</button>`
      : `<button onclick="toggleAssignmentStatus('${a.id}')" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-sm">Mark Done</button>`;

    return `
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
        <td class="py-4 px-5 font-bold text-slate-900 dark:text-white">${a.subject}</td>
        <td class="py-4 px-5">
          <span class="font-medium text-slate-800 dark:text-slate-200 block">${a.title}</span>
        </td>
        <td class="py-4 px-5 text-slate-500 dark:text-slate-400 font-medium text-xs whitespace-nowrap">${formatDate(a.dueDate)}</td>
        <td class="py-4 px-5">
          <span class="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-500"></i> ${a.createdBy}
          </span>
        </td>
        <td class="py-4 px-5">${statusBadge}</td>
        <td class="py-4 px-5 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-2">
            ${actionBtn}
            ${isAdmin ? `
              <button onclick="deleteAssignment('${a.id}')" title="Delete Assignment (Admin)" class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Update profile quick stats
  updateProfileAssignmentStats(list);
  updateNotificationBadges();
  lucide.createIcons();
}

function filterAssignmentStatus(status) {
  currentAssignmentFilter = status;

  ['all', 'pending', 'completed'].forEach(s => {
    const btn = document.getElementById(`filter-assign-${s}`);
    if (btn) {
      if (s === status) {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white transition";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition";
      }
    }
  });

  renderAssignmentsView();
}

function toggleAssignmentStatus(id) {
  const userRoll = currentUser && currentUser.roll ? currentUser.roll : 'admin_preview';
  const assignments = getGlobalAssignments();
  const item = assignments.find(g => g.id === id);

  if (item) {
    if (!item.completedBy) item.completedBy = [];
    if (item.completedBy.includes(userRoll)) {
      item.completedBy = item.completedBy.filter(r => r !== userRoll);
      showToast('Assignment marked as Pending.', 'info');
    } else {
      item.completedBy.push(userRoll);
      showToast('Assignment marked as Completed!', 'success');
    }
    setGlobalAssignments(assignments);
    apiCall(`/assignments/${id}/toggle-completion`, 'POST', { roll: userRoll });
  }

  renderAssignmentsView();
}

function openAddAssignmentModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can create assignments.', 'error');
    return;
  }
  const modal = document.getElementById('modal-add-assignment');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  lucide.createIcons();
}

function submitNewAssignment(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only College Admin can issue assignments.', 'error');
    return;
  }

  const subject = document.getElementById('asgn-subject').value.trim();
  const title = document.getElementById('asgn-title').value.trim();
  const due = document.getElementById('asgn-due').value;
  const faculty = document.getElementById('asgn-faculty')?.value.trim() || `Admin (${currentUser.name})`;

  const assignments = getGlobalAssignments();
  const newAssignment = {
    id: 'asgn_g_' + Date.now(),
    subject: subject,
    title: title,
    dueDate: due,
    isBroadcast: true,
    createdBy: faculty,
    createdRole: 'admin',
    completedBy: []
  };

  assignments.unshift(newAssignment);
  setGlobalAssignments(assignments);
  apiCall('/assignments', 'POST', {
    subject, title, dueDate: due, faculty
  });
  closeModal('modal-add-assignment');
  showToast('Official assignment issued to all students!', 'success');
  renderAssignmentsView();
}

function deleteAssignment(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can delete assignments.', 'error');
    return;
  }
  let assignments = getGlobalAssignments();
  assignments = assignments.filter(a => a.id !== id);
  setGlobalAssignments(assignments);
  apiCall(`/assignments/${id}`, 'DELETE');
  showToast('Assignment removed.', 'info');
  renderAssignmentsView();
}

function updateProfileAssignmentStats(assignments) {
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'Completed').length;
  const pending = total - completed;

  const totalEl = document.getElementById('stat-total-assign');
  const compEl = document.getElementById('stat-completed-assign');
  const pendEl = document.getElementById('stat-pending-assign');

  if (totalEl) totalEl.textContent = total;
  if (compEl) compEl.textContent = completed;
  if (pendEl) pendEl.textContent = pending;
}

// --- E. ANNOUNCEMENTS VIEW (Mockup 5) ---
// Requirement 4: Important announcements officially announced by admin
function renderAnnouncementsView() {
  const announcements = getAnnouncements();
  const container = document.getElementById('announcements-list-container');
  if (!container) return;

  const getNoticeCategoryBadge = (cat) => {
    switch (cat) {
      case 'Exams': return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
      case 'Events': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Academic': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    }
  };

  const getNoticeIcon = (cat) => {
    switch (cat) {
      case 'Exams': return 'calendar-check';
      case 'Events': return 'sparkles';
      case 'Academic': return 'graduation-cap';
      default: return 'book-open';
    }
  };

  container.innerHTML = announcements.map(ann => `
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
      <div class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shadow-sm">
        <i data-lucide="${getNoticeIcon(ann.category)}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-900 dark:text-white text-base">${ann.title}</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${getNoticeCategoryBadge(ann.category)}">${ann.category}</span>
          </div>
          <span class="text-xs text-slate-400 font-medium">${ann.date}</span>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${ann.body}</p>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span class="flex items-center gap-1.5"><i data-lucide="check-check" class="w-3.5 h-3.5 text-blue-500"></i> Official Notice by <strong>${ann.author || 'College Admin'}</strong></span>
          ${currentUser && currentUser.role === 'admin' ? `
            <button onclick="deleteAnnouncement('${ann.id}')" class="text-xs text-red-500 hover:underline">Delete Notice</button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function openAddAnnouncementModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can post announcements.', 'error');
    return;
  }
  document.getElementById('ann-date').value = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('modal-add-announcement').classList.remove('hidden');
  document.getElementById('modal-add-announcement').classList.add('flex');
}

function submitNewAnnouncement(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can post notices.', 'error');
    return;
  }

  const title = document.getElementById('ann-title').value.trim();
  const category = document.getElementById('ann-category').value;
  const date = document.getElementById('ann-date').value.trim();
  const desc = document.getElementById('ann-desc').value.trim();

  const announcements = getAnnouncements();
  const newAnn = {
    id: 'ann_' + Date.now(),
    title: title,
    body: desc,
    date: date,
    category: category,
    urgent: category === 'Exams',
    author: currentUser.name
  };

  announcements.unshift(newAnn);
  setAnnouncements(announcements);
  apiCall('/announcements', 'POST', {
    title, body: desc, category, date, urgent: category === 'Exams', author: currentUser.name
  });
  closeModal('modal-add-announcement');
  showToast('Official announcement published to all campus portals!', 'success');
  renderAnnouncementsView();
  renderHomeView();
}

function deleteAnnouncement(id) {
  if (!currentUser || currentUser.role !== 'admin') return;
  let announcements = getAnnouncements();
  announcements = announcements.filter(a => a.id !== id);
  setAnnouncements(announcements);
  apiCall(`/announcements/${id}`, 'DELETE');
  showToast('Announcement removed.', 'info');
  renderAnnouncementsView();
  renderHomeView();
}

// --- F. EVENTS CONTROLLER (ADMIN CAN ADD & MANAGE EVENTS) ---

const EVENT_THEME_PRESETS = {
  hackathon: {
    banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-indigo-600'
  },
  sports: {
    banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-emerald-600'
  },
  cultural: {
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-rose-600'
  },
  workshop: {
    banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-amber-600'
  },
  seminar: {
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    badgeColor: 'bg-blue-600'
  }
};

let tempEventBanner = null;

function renderEventsView() {
  const events = getEvents();
  const container = document.getElementById('events-full-list');
  if (!container) return;

  const isAdmin = currentUser && currentUser.role === 'admin';

  if (events.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
          <i data-lucide="calendar-x" class="w-7 h-7"></i>
        </div>
        <h4 class="font-bold text-base text-slate-800 dark:text-slate-200">No Events Scheduled</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">There are currently no upcoming campus events. College administration can publish new events anytime.</p>
        ${isAdmin ? `
          <button onclick="openAddEventModal()" class="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition">
            + Add First Event (Admin)
          </button>
        ` : ''}
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = events.map(ev => `
    <div class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row hover-lift transition">
      <div class="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
        <img src="${ev.banner}" alt="${ev.title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span class="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-lg ${ev.badgeColor || 'bg-indigo-600'}">
          ${ev.category || ev.title.split(' ')[0]}
        </span>
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">${ev.title}</h3>
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${ev.date}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500"></i> ${ev.venue}
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">${ev.desc}</p>
        </div>

        <div class="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div class="text-xs text-slate-400">
            ${ev.createdBy ? `<span class="text-[11px] text-slate-400">Published by: <strong class="text-slate-600 dark:text-slate-300">${ev.createdBy}</strong></span>` : ''}
          </div>
          <div class="flex items-center gap-2">
            ${isAdmin ? `
              <button onclick="deleteEvent('${ev.id}')" class="px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition flex items-center gap-1">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
              </button>
            ` : ''}
            <button onclick="toggleEventRegistration('${ev.id}')" class="px-5 py-2.5 rounded-xl text-xs font-semibold shadow transition ${ev.registered ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} flex items-center gap-1.5">
              ${ev.registered ? '<i data-lucide="check" class="w-3.5 h-3.5"></i> Registered' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function openAddEventModal() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can add campus events.', 'error');
    return;
  }

  document.getElementById('ev-title').value = '';
  document.getElementById('ev-date').value = '';
  document.getElementById('ev-venue').value = '';
  document.getElementById('ev-desc').value = '';
  document.getElementById('ev-category').value = 'Hackathon';
  
  tempEventBanner = EVENT_THEME_PRESETS.hackathon.banner;
  const bannerPreview = document.getElementById('ev-banner-preview');
  if (bannerPreview) bannerPreview.src = tempEventBanner;

  document.getElementById('modal-add-event').classList.remove('hidden');
  document.getElementById('modal-add-event').classList.add('flex');
}

function triggerEventBannerUpload() {
  const input = document.getElementById('ev-banner-file-input');
  if (input) input.click();
}

function handleEventBannerFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressBannerToDataUrl(file, 800, 450, 0.85, function(dataUrl) {
    tempEventBanner = dataUrl;
    const bannerPreview = document.getElementById('ev-banner-preview');
    if (bannerPreview) bannerPreview.src = dataUrl;
    showToast('Event banner uploaded from gallery!', 'info');
  });
  event.target.value = '';
}

function setEventBannerPreset(themeKey) {
  const preset = EVENT_THEME_PRESETS[themeKey];
  if (preset) {
    tempEventBanner = preset.banner;
    const bannerPreview = document.getElementById('ev-banner-preview');
    if (bannerPreview) bannerPreview.src = preset.banner;
    showToast(`Preset "${themeKey}" banner selected.`, 'info');
  }
}

function handleEventCategoryChange() {
  const cat = document.getElementById('ev-category').value.toLowerCase();
  if (cat.includes('hackathon')) setEventBannerPreset('hackathon');
  else if (cat.includes('sports')) setEventBannerPreset('sports');
  else if (cat.includes('cultural')) setEventBannerPreset('cultural');
  else if (cat.includes('workshop')) setEventBannerPreset('workshop');
  else if (cat.includes('seminar') || cat.includes('lecture')) setEventBannerPreset('seminar');
}

function submitNewEvent(event) {
  event.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can add events.', 'error');
    return;
  }

  const title = document.getElementById('ev-title').value.trim();
  const date = document.getElementById('ev-date').value.trim();
  const category = document.getElementById('ev-category').value;
  const venue = document.getElementById('ev-venue').value.trim();
  const desc = document.getElementById('ev-desc').value.trim();

  let badgeColor = 'bg-indigo-600';
  const catLower = category.toLowerCase();
  if (catLower.includes('sports')) badgeColor = 'bg-emerald-600';
  else if (catLower.includes('cultural')) badgeColor = 'bg-rose-600';
  else if (catLower.includes('workshop')) badgeColor = 'bg-amber-600';
  else if (catLower.includes('seminar')) badgeColor = 'bg-blue-600';
  else if (catLower.includes('club')) badgeColor = 'bg-purple-600';

  const banner = tempEventBanner || EVENT_THEME_PRESETS.hackathon.banner;

  const events = getEvents();
  const newEvent = {
    id: 'ev_' + Date.now(),
    title: title,
    date: date,
    venue: venue,
    category: category,
    desc: desc,
    registered: false,
    badgeColor: badgeColor,
    banner: banner,
    createdBy: currentUser.name,
    createdAt: new Date().toISOString()
  };

  events.unshift(newEvent);
  setEvents(events);
  apiCall('/events', 'POST', {
    title, date, venue, category, desc, badgeColor, banner, author: currentUser.name
  });
  closeModal('modal-add-event');
  showToast(`Campus Event "${title}" published successfully!`, 'success');
  renderEventsView();
  renderHomeView();
}

function deleteEvent(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Permission Denied: Only Admin can delete events.', 'error');
    return;
  }
  if (!confirm('Are you sure you want to delete this campus event?')) return;

  let events = getEvents();
  events = events.filter(e => e.id !== id);
  setEvents(events);
  apiCall(`/events/${id}`, 'DELETE');
  showToast('Event removed successfully.', 'info');
  renderEventsView();
  renderHomeView();
}

function toggleEventRegistration(id) {
  const events = getEvents();
  const ev = events.find(e => e.id === id);
  if (ev) {
    ev.registered = !ev.registered;
    setEvents(events);
    apiCall(`/events/${id}/toggle-register`, 'POST', { roll: currentUser.roll });
    showToast(ev.registered ? `Successfully registered for ${ev.title}!` : `Cancelled registration for ${ev.title}.`, 'info');
    renderEventsView();
  }
}

// --- G. STUDENT PROFILE VIEW & GALLERY PHOTO CONTROLLER ---
// Requirement: Profile photo should be changed using photo in gallery instead of link

let tempEditAvatar = null;
let tempRegAvatar = null;

// Photo Gallery compression helpers
function compressImageToDataUrl(file, maxDim, quality, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file from your gallery.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const width = img.width;
      const height = img.height;
      
      // Center-crop to square for profile avatars
      const size = Math.min(width, height);
      const startX = (width - size) / 2;
      const startY = (height - size) / 2;
      
      canvas.width = maxDim;
      canvas.height = maxDim;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, startX, startY, size, size, 0, 0, maxDim, maxDim);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.onerror = function() {
      showToast('Could not decode the chosen image file.', 'error');
    };
    img.src = e.target.result;
  };
  reader.onerror = function() {
    showToast('Failed to read file from your device.', 'error');
  };
  reader.readAsDataURL(file);
}

function compressBannerToDataUrl(file, maxW, maxH, quality, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file from your gallery.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxW) {
        height = Math.round((height * maxW) / width);
        width = maxW;
      }
      if (height > maxH) {
        width = Math.round((width * maxH) / height);
        height = maxH;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.onerror = function() {
      showToast('Could not load the chosen banner image.', 'error');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 1. Direct avatar change from Profile Page card
function triggerProfileAvatarUpload() {
  const input = document.getElementById('profile-avatar-file-input');
  if (input) input.click();
}

function handleProfileAvatarFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 400, 0.85, function(dataUrl) {
    saveNewAvatar(dataUrl);
    showToast('Profile photo updated successfully from gallery!', 'success');
  });
  event.target.value = '';
}

async function saveNewAvatar(dataUrl) {
  if (!currentUser) return;
  currentUser.avatar = dataUrl;
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
  
  if (currentUser.role === 'student') {
    const students = getStudents();
    const idx = students.findIndex(s => s.id === currentUser.id);
    if (idx !== -1) {
      students[idx].avatar = dataUrl;
      setStudents(students);
    }
  }
  
  // Update all avatar nodes immediately across UI
  const profileAvatar = document.getElementById('profile-detail-avatar');
  if (profileAvatar) profileAvatar.src = dataUrl;
  const topAvatar = document.getElementById('top-user-avatar');
  if (topAvatar) topAvatar.src = dataUrl;
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) sidebarAvatar.src = dataUrl;
  const editPreview = document.getElementById('edit-avatar-preview');
  if (editPreview) editPreview.src = dataUrl;

  // Persist to server disk & SQLite database
  if (isBackendConnected) {
    try {
      const uploadRes = await apiCall('/upload/avatar', 'POST', { dataUrl });
      const finalAvatar = uploadRes?.url || dataUrl;
      apiCall(`/profile/${currentUser.id}`, 'PUT', { avatar: finalAvatar });
    } catch (e) {
      apiCall(`/profile/${currentUser.id}`, 'PUT', { avatar: dataUrl });
    }
  }
}

// Alias for any existing call to promptChangeAvatar
function promptChangeAvatar() {
  triggerProfileAvatarUpload();
}

// 2. Avatar change inside Edit Profile Modal
function triggerEditAvatarUpload() {
  const input = document.getElementById('edit-avatar-file-input');
  if (input) input.click();
}

function handleEditAvatarFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 400, 0.85, function(dataUrl) {
    tempEditAvatar = dataUrl;
    const preview = document.getElementById('edit-avatar-preview');
    if (preview) preview.src = dataUrl;
    showToast('Photo selected from gallery! Click "Save Profile" to apply.', 'info');
  });
  event.target.value = '';
}

// 3. Avatar change in Registration Modal
function triggerRegAvatarUpload() {
  const input = document.getElementById('reg-avatar-file-input');
  if (input) input.click();
}

function handleRegAvatarFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  compressImageToDataUrl(file, 400, 0.85, function(dataUrl) {
    tempRegAvatar = dataUrl;
    const preview = document.getElementById('reg-avatar-preview');
    if (preview) preview.src = dataUrl;
    showToast('Custom photo selected from gallery!', 'info');
  });
  event.target.value = '';
}

function renderProfileView() {
  if (!currentUser) return;

  const isStudent = currentUser.role === 'student';
  const nameEl = document.getElementById('profile-detail-name');
  const rollEl = document.getElementById('profile-detail-roll');
  const branchEl = document.getElementById('profile-detail-branch');
  const yearEl = document.getElementById('profile-detail-year');
  const semEl = document.getElementById('profile-detail-semester');
  const cgpaEl = document.getElementById('profile-detail-cgpa');
  const emailEl = document.getElementById('profile-detail-email');
  const avatarEl = document.getElementById('profile-detail-avatar');
  const taglineEl = document.getElementById('profile-detail-tagline');
  const badgeRoleEl = document.getElementById('profile-badge-role');

  if (isStudent) {
    nameEl.textContent = currentUser.name;
    rollEl.textContent = currentUser.roll;
    branchEl.textContent = currentUser.branch;
    yearEl.textContent = currentUser.year;
    semEl.textContent = currentUser.semester;
    cgpaEl.textContent = currentUser.cgpa;
    emailEl.textContent = currentUser.email;
    avatarEl.src = currentUser.avatar;
    taglineEl.textContent = `B.Tech - ${currentUser.branch}`;
    badgeRoleEl.textContent = 'Active Student';
    badgeRoleEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
  } else {
    // Admin profile view
    nameEl.textContent = currentUser.name;
    rollEl.textContent = 'ADMIN-IIITNR';
    branchEl.textContent = currentUser.department;
    yearEl.textContent = 'Academic Cell';
    semEl.textContent = 'Administration';
    cgpaEl.textContent = 'N/A';
    emailEl.textContent = currentUser.email;
    avatarEl.src = currentUser.avatar;
    taglineEl.textContent = currentUser.designation;
    badgeRoleEl.textContent = 'System Administrator';
    badgeRoleEl.className = "px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300";
  }

  lucide.createIcons();
}

function openEditProfileModal() {
  if (!currentUser) return;
  tempEditAvatar = currentUser.avatar;
  const preview = document.getElementById('edit-avatar-preview');
  if (preview) preview.src = currentUser.avatar;

  document.getElementById('edit-name').value = currentUser.name;
  document.getElementById('edit-roll').value = currentUser.roll || 'ADMIN';
  document.getElementById('edit-branch').value = currentUser.branch || 'Data Science & AI';
  document.getElementById('edit-year').value = currentUser.year || '1st Year';
  document.getElementById('edit-sem').value = currentUser.semester || 'Semester 2';
  document.getElementById('edit-cgpa').value = currentUser.cgpa || '8.0';
  document.getElementById('edit-email').value = currentUser.email;

  document.getElementById('modal-edit-profile').classList.remove('hidden');
  document.getElementById('modal-edit-profile').classList.add('flex');
}

function submitEditProfile(event) {
  event.preventDefault();
  if (!currentUser) return;

  currentUser.name = document.getElementById('edit-name').value.trim();
  currentUser.roll = document.getElementById('edit-roll').value.trim();
  currentUser.branch = document.getElementById('edit-branch').value;
  currentUser.year = document.getElementById('edit-year').value;
  currentUser.semester = document.getElementById('edit-sem').value.trim();
  currentUser.cgpa = document.getElementById('edit-cgpa').value.trim();
  currentUser.email = document.getElementById('edit-email').value.trim();

  if (tempEditAvatar) {
    currentUser.avatar = tempEditAvatar;
  }

  // Save session and update list
  localStorage.setItem('iiitnr_active_session', JSON.stringify(currentUser));
  if (currentUser.role === 'student') {
    const students = getStudents();
    const idx = students.findIndex(s => s.id === currentUser.id);
    if (idx !== -1) {
      students[idx] = currentUser;
      setStudents(students);
    }
  }

  apiCall(`/profile/${currentUser.id}`, 'PUT', {
    name: currentUser.name,
    roll: currentUser.roll,
    branch: currentUser.branch,
    year: currentUser.year,
    semester: currentUser.semester,
    cgpa: currentUser.cgpa,
    email: currentUser.email,
    avatar: currentUser.avatar
  });

  closeModal('modal-edit-profile');
  showToast('Profile information and photo updated successfully!', 'success');
  renderProfileView();
}

// ==========================================
// 6. GLOBAL UTILITY FUNCTIONS
// ==========================================

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
  };

  toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 pointer-events-auto transform transition duration-300 translate-y-3 opacity-0`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-3');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function handleGlobalSearch(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return;

  if (q.includes('resource') || q.includes('note') || q.includes('paper') || q.includes('dsa') || q.includes('dbms')) {
    navigateTo('resources');
    const input = document.getElementById('resource-search-input');
    if (input) {
      input.value = q;
      filterResources();
    }
  } else if (q.includes('time') || q.includes('sched') || q.includes('class')) {
    navigateTo('timetable');
  } else if (q.includes('assign') || q.includes('homework') || q.includes('due')) {
    navigateTo('assignments');
  } else if (q.includes('notice') || q.includes('announc') || q.includes('exam')) {
    navigateTo('announcements');
  } else if (q.includes('event') || q.includes('hackathon') || q.includes('fest')) {
    navigateTo('events');
  }
}

function toggleNotificationDropdown() {
  const dd = document.getElementById('notification-dropdown');
  if (dd) {
    dd.classList.toggle('hidden');
    if (!dd.classList.contains('hidden')) {
      const list = document.getElementById('quick-notifications-list');
      const announcements = getAnnouncements().slice(0, 3);
      list.innerHTML = announcements.map(a => `
        <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          <p class="font-bold text-slate-800 dark:text-slate-100 truncate">${a.title}</p>
          <span class="text-[10px] text-slate-400">${a.date}</span>
        </div>
      `).join('');
    }
  }
}

// ==========================================
// 7. DATABASE MANAGEMENT CONSOLE CONTROLLER
// ==========================================

let currentActiveDbTable = 'users';
let currentDbRows = [];

async function renderDatabaseView() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Database & SQL Console is strictly restricted to Administration.', 'error');
    navigateTo('timetable');
    return;
  }

  updateUserUIElements();
  lucide.createIcons();

  // 1. Fetch DB Stats
  if (isBackendConnected) {
    try {
      const statsRes = await apiCall('/database/stats');
      if (statsRes?.success) {
        const sizeEl = document.getElementById('db-file-size-label');
        if (sizeEl) sizeEl.textContent = `File Size: ~${statsRes.fileSizeKB || '96 KB'}`;

        const counts = statsRes.tableCounts || {};
        for (const [tName, count] of Object.entries(counts)) {
          const badge = document.getElementById(`pill-count-${tName}`);
          if (badge) badge.textContent = `(${count})`;
        }
      }
    } catch (e) {
      console.warn('DB stats fetch error:', e);
    }
  } else {
    // Local fallback counts
    const students = getStudents();
    const resources = getResources();
    const timetable = getTimetable();
    const assignments = getGlobalAssignments();
    const announcements = getAnnouncements();
    const events = getEvents();

    const uBadge = document.getElementById('pill-count-users');
    if (uBadge) uBadge.textContent = `(${students.length + 1})`;
    const rBadge = document.getElementById('pill-count-resources');
    if (rBadge) rBadge.textContent = `(${resources.length})`;
    const tBadge = document.getElementById('pill-count-timetable');
    if (tBadge) tBadge.textContent = `(45)`;
    const aBadge = document.getElementById('pill-count-assignments');
    if (aBadge) aBadge.textContent = `(${assignments.length})`;
    const anBadge = document.getElementById('pill-count-announcements');
    if (anBadge) anBadge.textContent = `(${announcements.length})`;
    const evBadge = document.getElementById('pill-count-events');
    if (evBadge) evBadge.textContent = `(${events.length})`;
  }

  // 2. Load current selected table
  switchDbTable(currentActiveDbTable);
}

async function switchDbTable(tableName) {
  currentActiveDbTable = tableName;

  // Update pills styling
  document.querySelectorAll('.db-pill-btn').forEach(btn => {
    if (btn.getAttribute('data-table') === tableName) {
      btn.className = "db-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm flex items-center gap-1.5 transition";
    } else {
      btn.className = "db-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition";
    }
  });

  const titleEl = document.getElementById('current-table-title');
  if (titleEl) titleEl.textContent = `TABLE: ${tableName}`;

  // Fetch rows
  if (isBackendConnected) {
    try {
      const res = await apiCall(`/database/table/${tableName}`);
      if (res?.success && Array.isArray(res.rows)) {
        currentDbRows = res.rows;
      } else {
        currentDbRows = getLocalTableRows(tableName);
      }
    } catch (err) {
      currentDbRows = getLocalTableRows(tableName);
    }
  } else {
    currentDbRows = getLocalTableRows(tableName);
  }

  const badgeEl = document.getElementById('current-table-badge');
  if (badgeEl) badgeEl.textContent = `${currentDbRows.length} Records`;

  renderDbTableGrid(currentDbRows);
}

function getLocalTableRows(tableName) {
  if (tableName === 'users') {
    const students = getStudents();
    return [DEFAULT_ADMIN, ...students];
  }
  if (tableName === 'resources') return getResources();
  if (tableName === 'timetable') {
    const tt = getTimetable();
    const rows = [];
    tt.forEach(dayRow => {
      Object.entries(dayRow.periods || {}).forEach(([time, info]) => {
        rows.push({ day: dayRow.day, time_slot: time, subject: info.subject, room: info.room, slot_type: info.type });
      });
    });
    return rows;
  }
  if (tableName === 'assignments') return getGlobalAssignments();
  if (tableName === 'announcements') return getAnnouncements();
  if (tableName === 'events') return getEvents();
  return [];
}

function renderDbTableGrid(rows) {
  const headersEl = document.getElementById('db-table-headers');
  const rowsEl = document.getElementById('db-table-rows');
  if (!headersEl || !rowsEl) return;

  if (!rows || rows.length === 0) {
    headersEl.innerHTML = `<tr><th class="p-4 text-center">Column</th></tr>`;
    rowsEl.innerHTML = `<tr><td class="p-6 text-center text-slate-400">No records found in table "${currentActiveDbTable}".</td></tr>`;
    return;
  }

  // Get keys from first row
  const keys = Object.keys(rows[0]);
  headersEl.innerHTML = `
    <tr>
      <th class="px-4 py-3 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">#</th>
      ${keys.map(k => `<th class="px-4 py-3 font-bold border-b border-slate-200 dark:border-slate-800">${k}</th>`).join('')}
    </tr>
  `;

  rowsEl.innerHTML = rows.map((r, idx) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition font-mono text-[11px]">
      <td class="px-4 py-3 text-slate-400 font-sans">${idx + 1}</td>
      ${keys.map(k => {
        let val = r[k];
        if (typeof val === 'object') val = JSON.stringify(val);
        if (String(val).startsWith('http') || String(val).startsWith('data:image')) {
          return `<td class="px-4 py-3 max-w-[180px] truncate"><span class="text-blue-500 underline truncate block" title="${val}">[Media / Link]</span></td>`;
        }
        return `<td class="px-4 py-3 max-w-[220px] truncate text-slate-800 dark:text-slate-200" title="${String(val || '')}">${val !== undefined && val !== null ? String(val) : '<span class="text-slate-400 italic">NULL</span>'}</td>`;
      }).join('')}
    </tr>
  `).join('');
}

function filterDbTableRows() {
  const q = (document.getElementById('db-search-input')?.value || '').toLowerCase().trim();
  if (!q) {
    renderDbTableGrid(currentDbRows);
    return;
  }
  const filtered = currentDbRows.filter(row => {
    return Object.values(row).some(v => String(v || '').toLowerCase().includes(q));
  });
  renderDbTableGrid(filtered);
}

function setSqlQuery(sql) {
  const input = document.getElementById('db-sql-query-input');
  if (input) {
    input.value = sql;
    input.focus();
  }
}

async function runCustomSqlQuery() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: SQL Terminal is restricted to Administration.', 'error');
    return;
  }

  const sql = document.getElementById('db-sql-query-input')?.value.trim();
  if (!sql) {
    showToast('Please type an SQL query to execute.', 'error');
    return;
  }

  const outputBox = document.getElementById('db-query-output-box');
  const headersEl = document.getElementById('db-query-headers');
  const rowsEl = document.getElementById('db-query-rows');
  const badgeEl = document.getElementById('db-query-status-badge');

  if (outputBox) outputBox.classList.remove('hidden');

  if (!isBackendConnected) {
    showToast('SQL Query Runner requires active SQLite backend.', 'info');
    if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-amber-500">Notice: Connect to SQLite backend at http://localhost:5000 to execute live SQL queries.</td></tr>`;
    return;
  }

  try {
    const res = await apiCall('/database/query', 'POST', { sql });
    if (!res || !res.success) {
      showToast(res?.message || 'SQL query failed.', 'error');
      if (badgeEl) badgeEl.textContent = 'Error';
      if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-rose-500 font-mono text-xs">${res?.message || 'SQL Execution Error'}</td></tr>`;
      return;
    }

    if (res.type === 'SELECT' && Array.isArray(res.rows)) {
      if (badgeEl) badgeEl.textContent = `${res.rowCount} row(s) returned`;
      if (res.rows.length === 0) {
        if (headersEl) headersEl.innerHTML = `<tr><th class="p-3">Status</th></tr>`;
        if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-slate-400">Query executed successfully. 0 rows returned.</td></tr>`;
        return;
      }
      const keys = Object.keys(res.rows[0]);
      if (headersEl) {
        headersEl.innerHTML = `<tr>${keys.map(k => `<th class="px-4 py-2 font-bold">${k}</th>`).join('')}</tr>`;
      }
      if (rowsEl) {
        rowsEl.innerHTML = res.rows.map(r => `
          <tr class="hover:bg-slate-800/40 font-mono text-[11px]">
            ${keys.map(k => `<td class="px-4 py-2.5 max-w-[200px] truncate">${String(r[k] !== null && r[k] !== undefined ? r[k] : 'NULL')}</td>`).join('')}
          </tr>
        `).join('');
      }
      showToast(`Query executed: ${res.rowCount} row(s) returned.`, 'success');
    } else {
      if (badgeEl) badgeEl.textContent = `${res.changes || 0} change(s) applied`;
      if (headersEl) headersEl.innerHTML = `<tr><th class="p-3">Execution Status</th></tr>`;
      if (rowsEl) rowsEl.innerHTML = `<tr><td class="p-4 text-emerald-400 font-mono">Mutation successful. Changes: ${res.changes || 0}, Last ID: ${res.lastID || 'N/A'}.</td></tr>`;
      showToast('Mutation executed successfully.', 'success');
      renderDatabaseView();
    }
  } catch (err) {
    showToast('SQL Execution Error: ' + err.message, 'error');
  }
}

async function exportDatabaseDump() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Database export is restricted to Administration.', 'error');
    return;
  }

  if (isBackendConnected) {
    try {
      const headers = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      if (currentUser?.role) headers['x-user-role'] = currentUser.role;
      const res = await fetch(`${API_BASE}/database/export`, { headers });
      if (!res.ok) {
        showToast('Export failed: Administration access required.', 'error');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iiitnr_campus_hub_db_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Database JSON exported successfully!', 'success');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
  } else {
    // Generate local JSON export
    const localDump = {
      timestamp: new Date().toISOString(),
      engine: 'LocalStorage Cache',
      tables: {
        users: [DEFAULT_ADMIN, ...getStudents()],
        timetable: getTimetable(),
        resources: getResources(),
        assignments: getGlobalAssignments(),
        announcements: getAnnouncements(),
        events: getEvents()
      }
    };
    const blob = new Blob([JSON.stringify(localDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iiitnr_campus_hub_db_export.json';
    a.click();
    showToast('Database JSON exported successfully!', 'success');
  }
}

async function resetDatabaseFromUI() {
  if (!currentUser || currentUser.role !== 'admin') {
    showToast('Access Denied: Database reset is restricted to Administration.', 'error');
    return;
  }

  if (!confirm('Are you sure you want to re-seed the SQLite database to clean defaults?')) return;
  if (isBackendConnected) {
    const res = await apiCall('/database/reset', 'POST');
    if (res?.success) {
      showToast('SQLite database re-seeded successfully!', 'success');
      await syncAllFromBackend();
      renderDatabaseView();
    } else {
      showToast('Failed to reset database.', 'error');
    }
  } else {
    localStorage.removeItem('iiitnr_v3_synced');
    initStorage();
    showToast('Local database reset to official defaults.', 'success');
    renderDatabaseView();
  }
}

// Initial Boot
window.addEventListener('DOMContentLoaded', () => {
  initStorage();
  lucide.createIcons();
});
