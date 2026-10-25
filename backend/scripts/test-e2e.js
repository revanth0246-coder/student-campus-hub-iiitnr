/**
 * IIIT-NR Student Campus Hub - Backend End-to-End Test Suite
 * Validates SQLite Database persistence, authentication, and admin guards.
 */

const BASE_URL = process.env.API_BASE || 'http://localhost:5000/api';

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 IIIT-NR Backend Verification Suite (SQLite Engine)');
  console.log(`📡 Target API: ${BASE_URL}`);
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`⏳ Testing: ${name}... `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  let adminToken = null;
  let studentToken = null;

  // 1. Health check & SQLite database connectivity
  await test('GET /api/health (SQLite Status & Student Counts)', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok' || !data.database) throw new Error('Health check invalid');
  });

  // 2. Admin Authentication (Revanth)
  await test('POST /api/auth/login (Admin Login & Token Generation)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrRoll: 'revanth0246@gmail.com', password: 'revanth0406' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.role !== 'admin' || !data.token) throw new Error('Admin auth failed');
    adminToken = data.token;
  });

  // 3. Student Authentication
  await test('POST /api/auth/login (Student Roll No & Session Creation)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrRoll: '24DSAI001', password: 'student123' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.roll !== '24DSAI001' || !data.token) throw new Error('Student auth failed');
    studentToken = data.token;
  });

  // 4. Timetable Fetch from SQLite (DSAI, CSE, and ECE branches)
  await test('GET /api/timetable (All 3 Branch Schedules: DSAI, CSE, ECE)', async () => {
    const res = await fetch(`${BASE_URL}/timetable`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.timetable) || data.timetable.length !== 5) {
      throw new Error('Default timetable structure invalid');
    }
    if (!data.branches || !data.branches['Data Science & AI'] || !data.branches['Computer Science & Engineering'] || !data.branches['Electronics & Communication']) {
      throw new Error('Branch timetables missing from API response');
    }
    if (data.branches['Computer Science & Engineering'].length !== 5 || data.branches['Electronics & Communication'].length !== 5) {
      throw new Error('CSE or ECE 5-day schedules invalid');
    }
  });

  await test('GET /api/timetable?branch=Computer Science & Engineering (Branch Filter)', async () => {
    const res = await fetch(`${BASE_URL}/timetable?branch=Computer%20Science%20%26%20Engineering`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.branch !== 'Computer Science & Engineering' || data.timetable.length !== 5) {
      throw new Error('Filtered CSE timetable invalid');
    }
  });

  await test('GET /api/timetable?branch=Electronics & Communication (Branch Filter)', async () => {
    const res = await fetch(`${BASE_URL}/timetable?branch=Electronics%20%26%20Communication`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.branch !== 'Electronics & Communication' || data.timetable.length !== 5) {
      throw new Error('Filtered ECE timetable invalid');
    }
  });

  // 5. Admin-Only Timetable Slot Update (Branch-Aware)
  await test('POST /api/timetable/slot (Admin Branch-Specific Slot Update)', async () => {
    const res = await fetch(`${BASE_URL}/timetable/slot`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        branch: 'Computer Science & Engineering',
        day: 'Monday',
        time: '9:00 - 9:55',
        subject: 'Slot A (Advanced Data Structures)',
        room: '201',
        type: 'a'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Branch slot update failed');
  });

  // 5b. ECE Student Authentication
  await test('POST /api/auth/login (ECE Student Roll No & Branch Verification)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrRoll: '24ECE042', password: 'student123' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.roll !== '24ECE042' || data.user.branch !== 'Electronics & Communication') {
      throw new Error('ECE Student auth failed');
    }
  });

  // 6. Resources CRUD in SQLite
  let testResId = null;
  await test('POST & GET /api/resources (Admin-Only Study Material)', async () => {
    const postRes = await fetch(`${BASE_URL}/resources`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        subject: 'Slot A (Mathematics)',
        title: 'Fourier Series & Partial Differential Equations [SQLite Test]',
        type: 'Notes',
        link: 'https://example.com/notes'
      })
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const postData = await postRes.json();
    testResId = postData.resource.id;

    const getRes = await fetch(`${BASE_URL}/resources`);
    const getData = await getRes.json();
    if (!getData.resources.some(r => r.id === testResId)) throw new Error('Resource not found in SQLite list');
  });

  // 7. Delete Resource
  await test('DELETE /api/resources/:id (Admin Clean Up)', async () => {
    const res = await fetch(`${BASE_URL}/resources/${testResId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 8. Assignments & Student Completion Toggle
  let testAsgnId = null;
  await test('POST /api/assignments & Student Completion Relational Check', async () => {
    const postRes = await fetch(`${BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        subject: 'Slot B (Programming)',
        title: 'Dynamic Programming & Graph Algorithms [SQLite Test]',
        dueDate: '2026-10-30'
      })
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const postData = await postRes.json();
    testAsgnId = postData.assignment.id;

    // Toggle completion for student 24DSAI001
    const toggleRes = await fetch(`${BASE_URL}/assignments/${testAsgnId}/toggle-completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '24DSAI001' })
    });
    if (!toggleRes.ok) throw new Error(`HTTP ${toggleRes.status}`);
    const toggleData = await toggleRes.json();
    if (!toggleData.success || !toggleData.isCompleted) throw new Error('Toggle failed');

    // Clean up
    await fetch(`${BASE_URL}/assignments/${testAsgnId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  });

  // 9. Announcements in SQLite
  await test('POST & DELETE /api/announcements (Official Campus Notices)', async () => {
    const postRes = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Academic Council Resolution Circular [SQLite Test]',
        body: 'Circular body content.',
        category: 'Academic'
      })
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const postData = await postRes.json();
    const annId = postData.announcement.id;

    await fetch(`${BASE_URL}/announcements/${annId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  });

  // 10. Events & Student Registration
  await test('GET /api/events & Student Registration Toggle in SQLite', async () => {
    const getRes = await fetch(`${BASE_URL}/events`);
    const getData = await getRes.json();
    if (!getData.events || getData.events.length === 0) throw new Error('No events found');
    const firstEvent = getData.events[0];

    const regRes = await fetch(`${BASE_URL}/events/${firstEvent.id}/toggle-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '24DSAI001' })
    });
    if (!regRes.ok) throw new Error(`HTTP ${regRes.status}`);
    const regData = await regRes.json();
    if (!regData.success) throw new Error('Event registration toggle failed');
  });

  // 11. Profile Update & Gallery Avatar Data
  await test('PUT /api/profile/:id (Update Profile in SQLite)', async () => {
    const res = await fetch(`${BASE_URL}/profile/student_001`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sahil Pulipaka',
        roll: '24DSAI001',
        cgpa: '7.85'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.cgpa !== '7.85') throw new Error('Profile update failed');
  });

  // 12. Disk Upload API
  await test('POST /api/upload/avatar (Physical File Saving to /uploads)', async () => {
    const dummyDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await fetch(`${BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl: dummyDataUrl })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.url.startsWith('/uploads/')) throw new Error('Disk upload failed');
  });

  // 13. Database & SQL Route Protection (Admin-Only Guard, Forbidden for Students)
  await test('Database & SQL APIs Strictly Blocked for Student Login (403 Forbidden)', async () => {
    // Attempt database stats as Student
    const statsRes = await fetch(`${BASE_URL}/database/stats`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    if (statsRes.status !== 403) throw new Error(`Expected 403 Forbidden for student, got ${statsRes.status}`);

    // Attempt SQL query execution as Student
    const queryRes = await fetch(`${BASE_URL}/database/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: 'SELECT * FROM users' })
    });
    if (queryRes.status !== 403) throw new Error(`Expected 403 Forbidden for student query, got ${queryRes.status}`);

    // Verify Admin is allowed
    const adminStatsRes = await fetch(`${BASE_URL}/database/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (!adminStatsRes.ok) throw new Error(`Admin failed to access database stats (HTTP ${adminStatsRes.status})`);
  });

  // 14. Network & Multi-Device Access API
  await test('GET /api/network (Multi-Device & Cross-Network Access URLs)', async () => {
    const netRes = await fetch(`${BASE_URL}/network`);
    if (!netRes.ok) throw new Error(`HTTP ${netRes.status}`);
    const netData = await netRes.json();
    if (!netData.success || !netData.localUrl || !Array.isArray(netData.lanUrls)) {
      throw new Error('Network metadata structure invalid');
    }
  });

  // 15. Semester Exams API
  await test('GET /api/exams (Semester Exams & Syllabus Schedule)', async () => {
    const res = await fetch(`${BASE_URL}/exams`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.exams) || data.exams.length === 0) {
      throw new Error('Exams list invalid');
    }
  });

  // 16. Mess Menu & Today's Dining Schedule
  await test('GET /api/mess & /api/mess/today (Hostel Mess Schedule)', async () => {
    const res = await fetch(`${BASE_URL}/mess`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.menu) || data.menu.length !== 7) {
      throw new Error('7-Day mess schedule invalid');
    }

    const todayRes = await fetch(`${BASE_URL}/mess/today`);
    if (!todayRes.ok) throw new Error(`HTTP ${todayRes.status}`);
    const todayData = await todayRes.json();
    if (!todayData.success || !todayData.breakfast) {
      throw new Error("Today's mess menu invalid");
    }
  });

  // 17. Campus Exchange Listings
  await test('GET /api/exchange (Buy, Sell & Lost-Found Listings)', async () => {
    const res = await fetch(`${BASE_URL}/exchange`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.listings) || data.listings.length === 0) {
      throw new Error('Exchange listings invalid');
    }
  });

  // 18. Notifications System
  await test('GET & PUT /api/notifications (Centralized Notifications & Read Status)', async () => {
    const res = await fetch(`${BASE_URL}/notifications?roll=24DSAI001`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.notifications)) {
      throw new Error('Notifications list invalid');
    }

    const markRes = await fetch(`${BASE_URL}/notifications/1/read`, { method: 'PUT' });
    if (!markRes.ok) throw new Error(`HTTP ${markRes.status}`);
    const markData = await markRes.json();
    if (!markData.success) throw new Error('Mark notification read failed');
  });

  // 19. Global Multi-Entity Search
  await test('GET /api/search (Unified Multi-Entity Search Engine)', async () => {
    const res = await fetch(`${BASE_URL}/search?q=calculus`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.results || data.total === 0) {
      throw new Error('Global search did not return expected matches');
    }
    if (!Array.isArray(data.results.exams) || !Array.isArray(data.results.resources)) {
      throw new Error('Global search categories malformed');
    }
  });

  // 20. Student Assignment Checklist Toggle
  await test('POST /api/assignments/:id/toggle-completion (Student Checklist Toggle)', async () => {
    const toggleRes = await fetch(`${BASE_URL}/assignments/asgn_1/toggle-completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll: '24DSAI001' })
    });
    if (!toggleRes.ok) throw new Error(`HTTP ${toggleRes.status}`);
    const toggleData = await toggleRes.json();
    if (!toggleData.success) throw new Error('Toggle assignment completion failed');
  });

  // 21. Admin Privilege: Right to Make Other Admin
  await test('POST /api/auth/make-admin & Role Delegation (Admin Right to Make Other Admin)', async () => {
    // 21a. Non-admin cannot promote anyone (403 Forbidden)
    const unauthorizedRes = await fetch(`${BASE_URL}/auth/make-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({ roll: '24DSAI001' })
    });
    if (unauthorizedRes.status !== 403) throw new Error(`Expected 403 for non-admin, got ${unauthorizedRes.status}`);

    // 21b. Admin can create new admin account
    const createRes = await fetch(`${BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Co-Admin User',
        email: 'coadmin@iiitnr.ac.in',
        password: 'adminpass123',
        designation: 'Associate Dean'
      })
    });
    if (!createRes.ok) throw new Error(`Create admin failed with HTTP ${createRes.status}`);
    const createData = await createRes.json();
    if (!createData.success) throw new Error('Create admin response unsuccessful');

    // 21c. Admin can list all users including new admin
    const listRes = await fetch(`${BASE_URL}/auth/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (!listRes.ok) throw new Error(`List users failed with HTTP ${listRes.status}`);
    const listData = await listRes.json();
    const hasNewAdmin = listData.users.some(u => u.email === 'coadmin@iiitnr.ac.in' && u.role === 'admin');
    if (!hasNewAdmin) throw new Error('New admin not found in users table');
  });

  // 22. Student Registration Data Persistence & Admin Student Deletion
  await test('POST /api/auth/register & DELETE /api/auth/students/:id (Student Lifecycle & Admin Removal)', async () => {
    const testRoll = '24TEST999';
    const testEmail = 'teststudent999@iiitnr.ac.in';

    // 22a. Register student with full data
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Candidate',
        roll: testRoll,
        email: testEmail,
        password: 'password123',
        branch: 'Computer Science & Engineering',
        year: '2nd Year',
        semester: 'Semester 3',
        cgpa: '9.1'
      })
    });
    if (!regRes.ok) throw new Error(`Registration failed with HTTP ${regRes.status}`);
    const regData = await regRes.json();
    if (!regData.success || !regData.user || regData.user.roll !== testRoll) {
      throw new Error('Registration did not return valid student data');
    }

    // 22b. Verify student exists in students directory & can log in
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrRoll: testRoll, password: 'password123' })
    });
    if (!loginRes.ok) throw new Error(`Newly registered student login failed with HTTP ${loginRes.status}`);
    const loginData = await loginRes.json();
    if (!loginData.success || loginData.user.cgpa !== '9.1' || loginData.user.branch !== 'Computer Science & Engineering') {
      throw new Error('Stored student data fields do not match registration values');
    }

    // 22c. Unauthorized user cannot delete student (403)
    const unauthDelRes = await fetch(`${BASE_URL}/auth/students/${testRoll}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    if (unauthDelRes.status !== 403) {
      throw new Error(`Expected 403 for unauthorized student deletion, got ${unauthDelRes.status}`);
    }

    // 22d. Root Admin cannot be deleted (403)
    const adminDelRes = await fetch(`${BASE_URL}/auth/students/revanth0246@gmail.com`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (adminDelRes.status !== 403) {
      throw new Error(`Expected 403 when trying to delete admin account, got ${adminDelRes.status}`);
    }

    // 22e. Admin successfully removes student account
    const delRes = await fetch(`${BASE_URL}/auth/students/${testRoll}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (!delRes.ok) throw new Error(`Admin removal of student failed with HTTP ${delRes.status}`);
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Deletion response indicated failure');

    // 22f. Verify student account no longer exists
    const checkLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrRoll: testRoll, password: 'password123' })
    });
    if (checkLoginRes.status !== 401) {
      throw new Error(`Expected 401 for deleted student login, got ${checkLoginRes.status}`);
    }
  });

  console.log('\n======================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} ENTERPRISE SQLITE API TESTS PASSED (100%)`);
  } else {
    console.log('⚠️ Some tests failed. Review output above.');
  }
  console.log('======================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch(err => {
  console.error('\n❌ Fatal Test Error:', err);
  process.exit(1);
});
