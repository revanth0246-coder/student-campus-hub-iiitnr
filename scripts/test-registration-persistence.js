const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function run() {
  console.log('================================================================');
  console.log('🧪 Testing Student Registration & Persistence Verification');
  console.log('================================================================\n');

  let serverStarted = false;
  let testPort = '5000';
  let API_BASE = `http://localhost:${testPort}/api`;

  // 1. Probe if server is running on port 5000; if not, spin up test server on port 5057
  try {
    const probe = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1000) });
    if (!probe.ok) throw new Error('Not ok');
  } catch (e) {
    console.log('📡 Port 5000 not running. Starting in-memory test server on port 5057...');
    testPort = '5057';
    process.env.PORT = testPort;
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test_jwt_secret_persistence_test';
    require('../backend/server');
    await new Promise(resolve => setTimeout(resolve, 800));
    API_BASE = `http://localhost:${testPort}/api`;
    serverStarted = true;
  }

  // 2. Login as Admin
  const adminPassword = process.env.ADMIN_PASSWORD || 'revanth0406';
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrRoll: 'revanth0246@gmail.com', password: adminPassword })
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.success || !adminData.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminData));
  }
  const adminToken = adminData.token;
  console.log('✅ Step 1: Admin successfully logged in with token:', adminToken.slice(0, 16) + '...');

  // 3. Fetch current students before registration
  const beforeRes = await fetch(`${API_BASE}/auth/students`);
  const beforeData = await beforeRes.json();
  const countBefore = beforeData.students ? beforeData.students.length : 0;
  console.log(`✅ Step 2: Current enrolled students in database: ${countBefore}`);

  // 4. Register a new student
  const testRoll = '24DSAI' + Math.floor(100 + Math.random() * 900);
  const testEmail = `student_${testRoll.toLowerCase()}@iiitnr.ac.in`;
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sneha Kulkarni',
      roll: testRoll,
      branch: 'Data Science & AI',
      year: '1st Year',
      semester: 'Semester 2',
      cgpa: '9.1',
      email: testEmail,
      password: 'student123'
    })
  });
  const regData = await regRes.json();
  if (!regData.success || !regData.user) {
    throw new Error('Student registration failed: ' + JSON.stringify(regData));
  }
  console.log(`✅ Step 3: Registered new student: ${regData.user.name} (${regData.user.roll})`);

  // 5. Admin inspects students directory API
  const afterRes = await fetch(`${API_BASE}/auth/students`);
  const afterData = await afterRes.json();
  const foundStudent = afterData.students.find(s => s.roll === testRoll);
  if (!foundStudent) {
    throw new Error('Newly registered student not found in /api/auth/students');
  }
  console.log(`✅ Step 4: Admin verified new student is visible in Students Directory (${afterData.students.length} total)`);

  // 6. Admin inspects Database Table 'users' API
  const dbTableRes = await fetch(`${API_BASE}/database/table/users`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  const dbTableData = await dbTableRes.json();
  const foundInDbTable = dbTableData.rows ? dbTableData.rows.find(r => r.roll === testRoll) : null;
  if (!foundInDbTable) {
    throw new Error('Newly registered student not found in /api/database/table/users');
  }
  console.log(`✅ Step 5: Admin verified new student in database table records (${dbTableData.count} total records)`);

  // 7. Test Admin deletion of student
  const delRes = await fetch(`${API_BASE}/auth/students/${foundStudent.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  const delData = await delRes.json();
  if (!delData.success) {
    throw new Error('Admin student deletion failed: ' + JSON.stringify(delData));
  }
  console.log(`✅ Step 6: Admin successfully removed student ${testRoll}: ${delData.message}`);

  // 8. Verify student is removed
  const finalRes = await fetch(`${API_BASE}/auth/students`);
  const finalData = await finalRes.json();
  const deletedCheck = finalData.students.find(s => s.roll === testRoll);
  if (deletedCheck) {
    throw new Error('Student was not deleted from /api/auth/students');
  }
  console.log(`✅ Step 7: Verified student is no longer present. Final count: ${finalData.students.length}`);

  console.log('\n================================================================');
  console.log('🎉 ALL REGISTRATION PERSISTENCE & ADMIN VISIBILITY TESTS PASSED!');
  console.log('================================================================\n');

  process.exit(0);
}

run().catch(err => {
  console.error('\n❌ Verification failed:', err.message || err);
  process.exit(1);
});
