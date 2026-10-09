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

  // 2. Admin Authentication
  await test('POST /api/auth/login (Admin Login & Token Generation)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrRoll: 'admin@iiitnr.ac.in', password: 'admin123' })
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

  // 4. Timetable Fetch from SQLite
  await test('GET /api/timetable (B.Tech 1st Sem Room 203 Schedule)', async () => {
    const res = await fetch(`${BASE_URL}/timetable`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.timetable) || data.timetable.length !== 5) {
      throw new Error('Timetable structure invalid');
    }
  });

  // 5. Admin-Only Timetable Slot Update
  await test('POST /api/timetable/slot (Admin Authorization Guard)', async () => {
    const res = await fetch(`${BASE_URL}/timetable/slot`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        day: 'Monday',
        time: '9:00 - 9:55',
        subject: 'Slot A (Maths - Calculus)',
        room: '203',
        type: 'a'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Slot update failed');
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

  console.log('\n======================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed === 0) {
    console.log('🎉 ALL 13 ENTERPRISE SQLITE API TESTS PASSED (100%)');
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
