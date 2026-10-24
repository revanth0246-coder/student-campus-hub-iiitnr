const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const express = require('express');

// We can start our actual server module or run an in-process supertest-style test
console.log('================================================================');
console.log('🧪 IIIT-NR Enterprise REST API & Security Verification Suite');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

async function runTests() {
  // 1. Start backend server on test port 5055
  process.env.PORT = '5055';
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_iiitnr_2026';
  
  // Clear any DATABASE_URL to verify SQLite fallback in self-contained mode
  const originalDbUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  const serverApp = require('../server');
  // Wait for server to bind
  await new Promise(resolve => setTimeout(resolve, 800));

  const BASE_URL = 'http://localhost:5055/api';

  async function api(path, options = {}) {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    const headers = options.headers || {};
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
      headers['Content-Type'] = 'application/json';
    }
    options.headers = headers;

    const res = await fetch(url, options);
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    return { status: res.status, headers: res.headers, data };
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Health Check Route
    // -------------------------------------------------------------
    console.log('\n--- 1. Health Route & Helmet Headers ---');
    const health = await api('/health');
    assert(health.status === 200, 'GET /api/health returns 200 OK');
    assert(health.data?.status === 'ok', 'Health status is "ok"');
    assert(typeof health.data?.uptime === 'number', 'Health includes uptime');

    // Helmet security headers check
    const xContentType = health.headers.get('x-content-type-options');
    assert(xContentType === 'nosniff', 'Helmet active: X-Content-Type-Options is nosniff');

    // -------------------------------------------------------------
    // Test 2: Auth Validation & Registration with bcrypt & JWT
    // -------------------------------------------------------------
    console.log('\n--- 2. Auth: Registration with Zod Validation & bcrypt ---');
    
    // Invalid registration (short password, invalid email)
    const invalidReg = await api('/auth/register', {
      method: 'POST',
      body: { name: 'A', roll: '24', email: 'notanemail', password: '12' }
    });
    assert(invalidReg.status === 400, 'POST /api/auth/register rejects invalid input (400 Bad Request)');
    assert(invalidReg.data?.success === false, 'Validation error response has success: false');

    // Valid student registration
    const testRoll = '24TEST' + Math.floor(Math.random() * 10000);
    const testEmail = `student_${testRoll.toLowerCase()}@iiitnr.ac.in`;
    const validReg = await api('/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Student',
        roll: testRoll,
        email: testEmail,
        password: 'secureStudentPass123',
        branch: 'Computer Science & Engineering',
        year: '1st Year',
        semester: 'Semester 2',
        cgpa: '8.5'
      }
    });

    assert(validReg.status === 201, 'POST /api/auth/register returns 201 Created for valid student');
    assert(Boolean(validReg.data?.token), 'Registration returns signed JWT token');
    assert(validReg.data?.user?.role === 'student', 'Registered user has role "student"');
    assert(validReg.data?.user?.password_hash === undefined, 'password_hash is stripped from response');
    const studentToken = validReg.data?.token;

    // -------------------------------------------------------------
    // Test 3: Auth Login & Admin Login
    // -------------------------------------------------------------
    console.log('\n--- 3. Auth: Login & Admin Login with JWT ---');

    // Wrong password login
    const wrongPass = await api('/auth/login', {
      method: 'POST',
      body: { emailOrRoll: testRoll, password: 'wrongPassword999' }
    });
    assert(wrongPass.status === 401, 'POST /api/auth/login with wrong password returns 401 Unauthorized');

    // Correct student login
    const studentLogin = await api('/auth/login', {
      method: 'POST',
      body: { emailOrRoll: testRoll, password: 'secureStudentPass123' }
    });
    assert(studentLogin.status === 200, 'POST /api/auth/login returns 200 OK with correct password');
    assert(Boolean(studentLogin.data?.token), 'Login issues valid JWT token');

    // Admin login via POST /api/auth/admin-login
    const adminLogin = await api('/auth/admin-login', {
      method: 'POST',
      body: { email: 'revanth0246@gmail.com', password: 'revanth0406' }
    });
    assert(adminLogin.status === 200, 'POST /api/auth/admin-login returns 200 OK for valid admin');
    assert(adminLogin.data?.user?.role === 'admin', 'Admin login user role is "admin"');
    assert(Boolean(adminLogin.data?.token), 'Admin login issues admin JWT token');
    const adminToken = adminLogin.data?.token;

    // Student attempting admin-login
    const studentAsAdmin = await api('/auth/admin-login', {
      method: 'POST',
      body: { email: testEmail, password: 'secureStudentPass123' }
    });
    assert(studentAsAdmin.status === 403, 'POST /api/auth/admin-login rejects student account with 403 Forbidden');

    // -------------------------------------------------------------
    // Test 4: Protected GET /api/auth/me
    // -------------------------------------------------------------
    console.log('\n--- 4. Auth: GET /api/auth/me ---');
    const noAuthMe = await api('/auth/me');
    assert(noAuthMe.status === 401, 'GET /api/auth/me without token returns 401 Unauthorized');

    const authedMe = await api('/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(authedMe.status === 200, 'GET /api/auth/me with Bearer token returns 200 OK');
    assert(authedMe.data?.user?.roll === testRoll, 'GET /api/auth/me returns authenticated student details');

    // -------------------------------------------------------------
    // Test 5: Server-Enforced Role Checks (Students Blocked from Admin Actions)
    // -------------------------------------------------------------
    console.log('\n--- 5. Server-Enforced Role Checks: Students Blocked from Admin Actions ---');

    // Student trying to post announcement
    const studentNotice = await api('/announcements', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { title: 'Hack Notice', body: 'Fake notice posted by student' }
    });
    assert(studentNotice.status === 403, 'POST /api/announcements strictly blocked for student (403 Forbidden)');

    // Student trying to update timetable
    const studentTimetable = await api('/timetable/slot', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: { branch: 'Data Science & AI', day: 'Monday', time: '9:00 - 9:55', subject: 'Cancelled' }
    });
    assert(studentTimetable.status === 403, 'POST /api/timetable/slot strictly blocked for student (403 Forbidden)');

    // Student trying to access /api/users
    const studentUsers = await api('/users', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(studentUsers.status === 403, 'GET /api/users strictly blocked for student (403 Forbidden)');

    // Client spoofing attempt: header x-user-role: admin without admin token
    const spoofAttempt = await api('/announcements', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'x-user-role': 'admin'
      },
      body: { title: 'Spoofed Notice', body: 'Attempting spoof via x-user-role' }
    });
    assert(spoofAttempt.status === 403, 'Header spoofing (x-user-role: admin) strictly ignored & blocked (403 Forbidden)');

    // -------------------------------------------------------------
    // Test 6: Admin Operations with Admin JWT
    // -------------------------------------------------------------
    console.log('\n--- 6. Admin Actions (Verified with Admin JWT) ---');

    // Admin creates announcement
    const adminNotice = await api('/announcements', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Mid-Sem Exam Timetable Released',
        body: 'Examinations will commence next week in Room 203.',
        category: 'Academic',
        urgent: true
      }
    });
    assert(adminNotice.status === 201, 'POST /api/announcements allowed for Admin (201 Created)');
    const noticeId = adminNotice.data?.announcement?.id;

    // Public gets announcements
    const getNotices = await api('/announcements');
    assert(getNotices.status === 200, 'GET /api/announcements returns 200 OK');
    assert(Array.isArray(getNotices.data?.announcements), 'Announcements list is array');

    // Admin deletes announcement
    if (noticeId) {
      const delNotice = await api(`/announcements/${noticeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(delNotice.status === 200, 'DELETE /api/announcements/:id allowed for Admin (200 OK)');
    }

    // Admin timetable slot update
    const updateSlot = await api('/timetable/slot', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        branch: 'Data Science & AI',
        day: 'Monday',
        time: '9:00 - 9:55',
        subject: 'Slot A (Advanced AI)',
        room: '203'
      }
    });
    assert(updateSlot.status === 200, 'POST /api/timetable/slot allowed for Admin (200 OK)');

    // Timetable GET
    const getTT = await api('/timetable?branch=Data Science & AI');
    assert(getTT.status === 200, 'GET /api/timetable returns 200 OK');
    assert(getTT.data?.branch === 'Data Science & AI', 'Timetable returns requested branch');

    // Admin creates study resource
    const addResource = await api('/resources', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        subject: 'Slot A (Maths)',
        title: 'Unit 1 Multivariable Calculus Notes',
        type: 'Notes',
        link: 'https://example.com/maths-notes.pdf',
        description: 'Complete lecture notes'
      }
    });
    assert(addResource.status === 201, 'POST /api/resources allowed for Admin (201 Created)');
    const resId = addResource.data?.resource?.id;

    // Student bookmarks resource
    if (resId) {
      const bkmk = await api(`/resources/${resId}/bookmark`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: { studentRoll: testRoll }
      });
      assert(bkmk.status === 200, 'POST /api/resources/:id/bookmark allowed for authenticated student (200 OK)');
      assert(bkmk.data?.bookmarked === true, 'Bookmark toggled to true');

      // Admin deletes resource
      const delRes = await api(`/resources/${resId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(delRes.status === 200, 'DELETE /api/resources/:id allowed for Admin (200 OK)');
    }

    // -------------------------------------------------------------
    // Test 7: Assignments & Student Completion Toggle
    // -------------------------------------------------------------
    console.log('\n--- 7. Assignments & Student Checklist ---');
    const addAsgn = await api('/assignments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        subject: 'Slot B (Programming)',
        title: 'Binary Search Tree Implementation',
        dueDate: '2026-11-20',
        priority: 'High',
        description: 'Implement AVL tree rebalancing algorithms in C++'
      }
    });
    assert(addAsgn.status === 201, 'POST /api/assignments allowed for Admin (201 Created)');
    const asgnId = addAsgn.data?.assignment?.id;

    if (asgnId) {
      const toggle = await api(`/assignments/${asgnId}/toggle-completion`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: { studentRoll: testRoll }
      });
      assert(toggle.status === 200, 'POST /api/assignments/:id/toggle-completion works for student (200 OK)');
      assert(toggle.data?.completed === true, 'Assignment marked completed');

      // Admin cleans up assignment
      await api(`/assignments/${asgnId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }

    // -------------------------------------------------------------
    // Test 8: Mess Menu & Reviews
    // -------------------------------------------------------------
    console.log('\n--- 8. Mess Menu & Reviews ---');
    const messGet = await api('/mess');
    assert(messGet.status === 200, 'GET /api/mess returns 200 OK');
    assert(Array.isArray(messGet.data?.menu), 'Mess menu is array');

    const messToday = await api('/mess/today');
    assert(messToday.status === 200, 'GET /api/mess/today returns 200 OK');

    // Admin updates mess menu
    const updateMenu = await api('/mess/Monday', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { breakfast: 'Poha, Jalebi, Tea', lunch: 'Paneer Butter Masala, Roti, Rice, Dal' }
    });
    assert(updateMenu.status === 200, 'PUT /api/mess/:day allowed for Admin (200 OK)');

    // Student submits mess feedback
    const feedback = await api('/mess/feedback', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        studentRoll: testRoll,
        mealType: 'Lunch',
        rating: 5,
        comment: 'Excellent lunch today!'
      }
    });
    assert(feedback.status === 201, 'POST /api/mess/feedback returns 201 Created');

    // Get feedback / reviews
    const getFeedback = await api('/mess/feedback');
    assert(getFeedback.status === 200, 'GET /api/mess/feedback returns 200 OK');
    const getReviews = await api('/mess/reviews');
    assert(getReviews.status === 200, 'GET /api/mess/reviews alias returns 200 OK');

    // -------------------------------------------------------------
    // Test 9: Users Route (Admin Only)
    // -------------------------------------------------------------
    console.log('\n--- 9. Users Route (/api/users - Admin Only) ---');
    const getUsers = await api('/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(getUsers.status === 200, 'GET /api/users allowed for Admin (200 OK)');
    assert(Array.isArray(getUsers.data?.users), 'Users response contains array');

    // Admin creates new user via /api/users
    const newStudentRoll = '24ADM' + Math.floor(Math.random() * 10000);
    const createUser = await api('/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'Admin Created Student',
        email: `adm_student_${newStudentRoll.toLowerCase()}@iiitnr.ac.in`,
        password: 'password123',
        role: 'student',
        roll: newStudentRoll,
        branch: 'Electronics & Communication'
      }
    });
    assert(createUser.status === 201, 'POST /api/users creates user (201 Created)');
    const createdUserId = createUser.data?.user?.id;

    if (createdUserId) {
      // Admin deletes created user
      const delUser = await api(`/users/${createdUserId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(delUser.status === 200, 'DELETE /api/users/:id deletes user (200 OK)');
    }

    // -------------------------------------------------------------
    // Test 10: Verify Removed Features (SQL Console & Re-seed/Export)
    // -------------------------------------------------------------
    console.log('\n--- 10. Removed Features Verification (404 Not Found) ---');
    const queryConsole = await api('/database/query', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { sql: 'SELECT * FROM users' }
    });
    assert(queryConsole.status === 404, 'POST /api/database/query removed (404 Not Found)');

    const exportDump = await api('/database/export', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(exportDump.status === 404, 'GET /api/database/export removed (404 Not Found)');

    const resetDb = await api('/database/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(resetDb.status === 404, 'POST /api/database/reset removed (404 Not Found)');

    // Clean up test student
    await api(`/users/${testRoll}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`📊 API Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================');

  if (failed === 0) {
    console.log('🎉 All Express REST API security & route tests passed successfully!');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed. Review log above.');
    process.exit(1);
  }
}

runTests();
