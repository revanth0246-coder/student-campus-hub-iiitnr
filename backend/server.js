const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { initDatabase, getAsync, allAsync } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve physical uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Health Check API
app.get('/api/health', async (req, res) => {
  try {
    const studentCount = await getAsync(`SELECT COUNT(*) as count FROM users WHERE role = 'student'`);
    const slotCount = await getAsync(`SELECT COUNT(*) as count FROM timetable`);
    res.json({
      status: 'ok',
      engine: 'SQLite 3 (Enterprise Relational Backend)',
      service: 'IIIT-NR Student Campus Hub Full-Stack API',
      database: 'backend/database/campus_hub.sqlite',
      activeStudents: studentCount?.count || 0,
      timetableSlots: slotCount?.count || 0,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/mess', require('./routes/mess'));
app.use('/api/exchange', require('./routes/exchange'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/search', require('./routes/search'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/database', require('./routes/database'));

function getNetworkAddresses() {
  const nets = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ interface: name, address: net.address, url: `http://${net.address}:${PORT}` });
      }
    }
  }
  return addresses;
}

// Network & Multi-Device Access API
app.get('/api/network', (req, res) => {
  const lanAddresses = getNetworkAddresses();
  let tunnelInfo = null;
  const tunnelFile = path.join(__dirname, 'database', 'network_tunnel.json');
  if (fs.existsSync(tunnelFile)) {
    try {
      tunnelInfo = JSON.parse(fs.readFileSync(tunnelFile, 'utf8'));
    } catch (e) {}
  }

  res.json({
    success: true,
    port: PORT,
    localUrl: `http://localhost:${PORT}`,
    lanUrls: lanAddresses,
    primaryLanUrl: lanAddresses.length > 0 ? lanAddresses[0].url : `http://localhost:${PORT}`,
    tunnelUrl: tunnelInfo?.url || null,
    tunnelActive: !!(tunnelInfo?.url && tunnelInfo?.active),
    instructions: {
      sameWifi: lanAddresses.length > 0 ? lanAddresses[0].url : `http://localhost:${PORT}`,
      crossNetworkCmd: 'npm run tunnel'
    }
  });
});

// Direct /db route redirects to app with database view
app.get('/db', (req, res) => {
  res.redirect('/#database');
});

// Interactive REST API Explorer Dashboard
app.get(['/api', '/api/docs'], async (req, res) => {
  try {
    const userCount = await getAsync(`SELECT COUNT(*) as c FROM users WHERE role = 'student'`);
    const ttCount = await getAsync(`SELECT COUNT(*) as c FROM timetable`);
    const resCount = await getAsync(`SELECT COUNT(*) as c FROM resources`);
    const asgnCount = await getAsync(`SELECT COUNT(*) as c FROM assignments`);
    const annCount = await getAsync(`SELECT COUNT(*) as c FROM announcements`);
    const evCount = await getAsync(`SELECT COUNT(*) as c FROM events`);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IIIT-NR Campus Hub - SQLite Backend API Explorer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    pre { background: #0b1120; color: #38bdf8; padding: 1rem; border-radius: 0.5rem; max-height: 380px; overflow-y: auto; font-size: 0.82rem; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 md:p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">NR</div>
          <h1 class="text-2xl font-bold text-white">IIIT-NR Enterprise SQLite Backend</h1>
        </div>
        <p class="text-sm text-slate-400 mt-1">Full-Stack RESTful API • SQLite Relational Engine • Role-Based Security</p>
      </div>
      <div class="flex items-center gap-3">
        <a href="/" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition shadow flex items-center gap-2">
          <i class="fa-solid fa-graduation-cap"></i> Launch Campus Web App
        </a>
      </div>
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 shadow-sm">
        <div class="text-xs text-slate-400 uppercase font-semibold">Engine & Server</div>
        <div class="text-base font-bold text-emerald-400 mt-1 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> SQLite3 + Express (Port 5000)
        </div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 shadow-sm">
        <div class="text-xs text-slate-400 uppercase font-semibold">Database File</div>
        <div class="text-sm font-mono text-cyan-300 mt-1 truncate">campus_hub.sqlite</div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 shadow-sm">
        <div class="text-xs text-slate-400 uppercase font-semibold">Database Tables</div>
        <div class="text-lg font-bold text-white mt-1">9 Relational Tables</div>
      </div>
      <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 shadow-sm">
        <div class="text-xs text-slate-400 uppercase font-semibold">Enrolled Students</div>
        <div class="text-lg font-bold text-white mt-1">${userCount?.c || 0} Students</div>
      </div>
    </div>

    <!-- Live Tester Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-6 space-y-3">
        <h2 class="text-base font-semibold text-slate-200 flex items-center gap-2">
          <i class="fa-solid fa-terminal text-amber-400"></i> Interactive Endpoint Testers
        </h2>
        
        <div class="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/health</span>
              <p class="text-xs text-slate-400">Server health & SQLite statistics</p>
            </div>
            <button onclick="testApi('/api/health')" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition">Execute</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/timetable</span>
              <p class="text-xs text-slate-400">Section-1 Mon-Fri Schedule (${ttCount?.c || 0} slots)</p>
            </div>
            <button onclick="testApi('/api/timetable')" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition">Execute</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/resources</span>
              <p class="text-xs text-slate-400">Verified course materials (${resCount?.c || 0} items)</p>
            </div>
            <button onclick="testApi('/api/resources')" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition">Execute</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/assignments</span>
              <p class="text-xs text-slate-400">Academic assignments (${asgnCount?.c || 0} items)</p>
            </div>
            <button onclick="testApi('/api/assignments')" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition">Execute</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/announcements</span>
              <p class="text-xs text-slate-400">Official circulars (${annCount?.c || 0} notices)</p>
            </div>
            <button onclick="testApi('/api/announcements')" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition">Execute</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/events</span>
              <p class="text-xs text-slate-400">Campus events & fests (${evCount?.c || 0} events)</p>
            </div>
            <button onclick="testApi('/api/events')" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition">Execute</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800 rounded">POST</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/auth/login</span>
              <p class="text-xs text-slate-400">Test Admin Auth (revanth0246@gmail.com)</p>
            </div>
            <button onclick="testLogin('admin')" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white transition">Test Admin</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/database/stats</span>
              <p class="text-xs text-slate-400">SQLite file size, 9 tables & record counts</p>
            </div>
            <button onclick="testApi('/api/database/stats')" class="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-xs font-semibold rounded text-white transition">Inspect DB</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">GET</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/database/tables</span>
              <p class="text-xs text-slate-400">Schema metadata & column types for all 9 tables</p>
            </div>
            <button onclick="testApi('/api/database/tables')" class="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-xs font-semibold rounded text-white transition">Get Schema</button>
          </div>

          <div class="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
            <div>
              <span class="px-2 py-0.5 text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800 rounded">POST</span>
              <span class="text-sm font-mono ml-2 text-slate-200">/api/auth/login</span>
              <p class="text-xs text-slate-400">Test Student Auth (24DSAI001)</p>
            </div>
            <button onclick="testLogin('student')" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded text-white transition">Test Student</button>
          </div>
        </div>
      </div>

      <!-- Live Response Viewer -->
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-200 flex items-center gap-2">
            <i class="fa-solid fa-code text-cyan-400"></i> Live SQLite Query Output
          </h2>
          <span id="responseStatus" class="text-xs font-mono text-slate-400">Ready</span>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
          <div class="text-xs font-mono text-slate-400 mb-2 truncate" id="requestUrl">Select an endpoint on the left to execute live HTTP test.</div>
          <pre id="jsonViewer">// Live JSON response will appear here...</pre>
        </div>
        <div class="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs text-slate-300 space-y-1.5">
          <div class="font-semibold text-white flex items-center gap-1.5">
            <i class="fa-solid fa-database text-cyan-400"></i> SQLite Architecture Highlights:
          </div>
          <p>• <strong>Strict Authorization:</strong> Timetable modification, resource posting, assignments broadcasting, and announcements can only be performed by Administrators.</p>
          <p>• <strong>Relational Tracking:</strong> Student assignment checkboxes and event registrations are stored in dedicated relational tables (&lt;code&gt;assignment_completions&lt;/code&gt;, &lt;code&gt;event_registrations&lt;/code&gt;).</p>
          <p>• <strong>Gallery Photo Storage:</strong> Images uploaded from device gallery are written to physical disk in /uploads.</p>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function testApi(url) {
      document.getElementById('requestUrl').textContent = 'GET ' + window.location.origin + url;
      document.getElementById('responseStatus').textContent = 'Querying SQLite...';
      try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById('responseStatus').innerHTML = '<span class="text-emerald-400 font-bold">Status: ' + res.status + ' OK</span>';
        document.getElementById('jsonViewer').textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        document.getElementById('responseStatus').innerHTML = '<span class="text-rose-400 font-bold">Error</span>';
        document.getElementById('jsonViewer').textContent = String(err);
      }
    }

    async function testLogin(role) {
      const url = '/api/auth/login';
      const body = role === 'admin' 
        ? { emailOrRoll: 'revanth0246@gmail.com', password: 'revanth0406' }
        : { emailOrRoll: '24DSAI001', password: 'student123' };

      document.getElementById('requestUrl').textContent = 'POST ' + window.location.origin + url + ' (' + role + ')';
      document.getElementById('responseStatus').textContent = 'Authenticating...';
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        document.getElementById('responseStatus').innerHTML = '<span class="text-emerald-400 font-bold">Status: ' + res.status + ' OK</span>';
        document.getElementById('jsonViewer').textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        document.getElementById('responseStatus').innerHTML = '<span class="text-rose-400 font-bold">Error</span>';
        document.getElementById('jsonViewer').textContent = String(err);
      }
    }

    // Run initial health check on load
    testApi('/api/health');
  </script>
</body>
</html>`;
    res.send(html);
  } catch (err) {
    res.status(500).send('Explorer error: ' + err.message);
  }
});

// Serve frontend static files
const frontendDir = path.join(__dirname, '..');
app.use(express.static(frontendDir));

// Fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// SPA fallback for any unmatched route
app.use((req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Start Server and initialize SQLite database
initDatabase().then(() => {
  app.listen(PORT, HOST, () => {
    const lan = getNetworkAddresses();
    console.log('\n======================================================');
    console.log('🎓 IIIT-NR Student Campus Hub - Enterprise Backend');
    console.log('======================================================');
    console.log(`🚀 Local Machine URL     : http://localhost:${PORT}/`);
    lan.forEach(l => {
      console.log(`📱 Same Wi-Fi / Hotspot  : ${l.url}/ (${l.interface})`);
    });
    console.log(`🌐 Cross-Network Tunnel  : Run "npm run tunnel" for internet access`);
    console.log(`💾 SQLite Database Engine: backend/database/campus_hub.sqlite`);
    console.log(`📡 REST API Base URL     : http://localhost:${PORT}/api`);
    console.log('======================================================\n');
  });
}).catch(err => {
  console.error('❌ Fatal error initializing SQLite database:', err);
  process.exit(1);
});
