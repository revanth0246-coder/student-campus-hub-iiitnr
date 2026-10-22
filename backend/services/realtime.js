// ======================================================
// ⚡ Real-Time SSE (Server-Sent Events) Broadcast Engine
// Broadcasts sub-second sync updates to all connected devices
// ======================================================

const clients = new Set();

function initRealtime(app) {
  // GET /api/realtime/stream
  app.get('/api/realtime/stream', (req, res) => {
    // SSE Protocol Headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    });

    // Send immediate connection handshake
    res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString(), totalClients: clients.size + 1 })}\n\n`);

    clients.add(res);

    // Heartbeat every 15s to keep cellular & Wi-Fi connections alive
    const heartbeatTimer = setInterval(() => {
      try {
        res.write(`: heartbeat ${new Date().toISOString()}\n\n`);
      } catch (err) {
        clearInterval(heartbeatTimer);
        clients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeatTimer);
      clients.delete(res);
    });
  });

  // GET /api/realtime/status
  app.get('/api/realtime/status', (req, res) => {
    res.json({
      success: true,
      protocol: 'Server-Sent Events (SSE)',
      activeConnections: clients.size,
      timestamp: new Date().toISOString()
    });
  });
}

function broadcastSync(eventType, data = {}) {
  const payload = JSON.stringify({
    type: eventType,
    data,
    time: new Date().toISOString()
  });
  const message = `data: ${payload}\n\n`;

  for (const client of clients) {
    try {
      client.write(message);
    } catch (err) {
      clients.delete(client);
    }
  }
}

function getConnectedClientsCount() {
  return clients.size;
}

module.exports = {
  initRealtime,
  broadcastSync,
  getConnectedClientsCount
};
