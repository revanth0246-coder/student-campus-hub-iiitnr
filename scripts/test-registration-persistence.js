const http = require('http');

async function run() {
  console.log('Testing Registration & Admin Visibility Persistence...');

  const API_BASE = 'http://localhost:5000/api';

  // 1. Login as Admin
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrRoll: 'revanth0246@gmail.com', password: 'admin' })
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.success || !adminData.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminData));
  }
  const adminToken = adminData.token;
  console.log('✓ Step 1: Admin successfully logged in with token:', adminToken.slice(0, 16) + '...');

  // 2. Fetch current students before registration
  const beforeRes = await fetch(`${API_BASE}/auth/students`);
  const beforeData = await beforeRes.json();
  const countBefore = beforeData.students.length;
  console.log(`✓ Step 2: Current enrolled students in SQLite: ${countBefore}`);

  // 3. Register a new student
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
  console.log(`✓ Step 3: Registered new student: ${regData.user.name} (${regData.user.roll})`);

  // 4. Admin inspects students directory API
  const afterRes = await fetch(`${API_BASE}/auth/students`);
  const afterData = await afterRes.json();
  const foundStudent = afterData.students.find(s => s.roll === testRoll);
  if (!foundStudent) {
    throw new Error('Newly registered student not found in /api/auth/students');
  }
  console.log(`✓ Step 4: Admin verified new student is visible in Students Directory: ${foundStudent.name} (${foundStudent.roll}), Total count: ${afterData.students.length}`);

  // 5. Admin inspects Database Table 'users' API
  const dbTableRes = await fetch(`${API_BASE}/database/table/users`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'x-user-role': 'admin'
    }
  });
  const dbTableData = await dbTableRes.json();
  const foundInDbTable = dbTableData.rows.find(r => r.roll === testRoll);
  if (!foundInDbTable) {
    throw new Error('Newly registered student not found in /api/database/table/users');
  }
  console.log(`✓ Step 5: Admin verified new student is visible in SQL Console "users" table (${dbTableData.count} total records)`);

  // 6. Test Admin deletion of student
  const delRes = await fetch(`${API_BASE}/auth/students/${foundStudent.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'x-user-role': 'admin'
    }
  });
  const delData = await delRes.json();
  if (!delData.success) {
    throw new Error('Admin student deletion failed: ' + JSON.stringify(delData));
  }
  console.log(`✓ Step 6: Admin successfully removed student ${testRoll}:`, delData.message);

  // 7. Verify student is removed
  const finalRes = await fetch(`${API_BASE}/auth/students`);
  const finalData = await finalRes.json();
  const deletedCheck = finalData.students.find(s => s.roll === testRoll);
  if (deletedCheck) {
    throw new Error('Student was not deleted from /api/auth/students');
  }
  console.log(`✓ Step 7: Verified student is no longer present. Final count: ${finalData.students.length}`);

  console.log('\n🎉 ALL REGISTRATION PERSISTENCE & ADMIN VISIBILITY VERIFICATION PASSED!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
