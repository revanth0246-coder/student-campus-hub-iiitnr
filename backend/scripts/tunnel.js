/**
 * Cross-Network Public Tunnel for IIIT-NR Campus Hub
 * Exposes http://localhost:5000 to the public internet securely
 * Works on any device connected to ANY network (mobile data, other Wi-Fi, etc.)
 */

const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

const PORT = process.env.PORT || 5000;
const TUNNEL_FILE = path.join(__dirname, '..', 'database', 'network_tunnel.json');

async function startTunnel() {
  console.log('\n======================================================');
  console.log('🌐 IIIT-NR Campus Hub - Cross-Network Tunnel');
  console.log('======================================================');
  console.log(`📡 Connecting local port ${PORT} to secure public tunnel...`);

  try {
    const tunnel = await localtunnel({
      port: PORT,
      subdomain: 'iiitnr-hub-' + Math.random().toString(36).substring(2, 7)
    });

    const info = {
      url: tunnel.url,
      active: true,
      port: PORT,
      startedAt: new Date().toISOString()
    };

    fs.writeFileSync(TUNNEL_FILE, JSON.stringify(info, null, 2));

    console.log('\n🎉 Tunnel is LIVE and accessible worldwide!');
    console.log('------------------------------------------------------');
    console.log(`🌍 PUBLIC INTERNET URL : ${tunnel.url}`);
    console.log('------------------------------------------------------');
    console.log('📱 You can open this link on:');
    console.log('   - Any Mobile Phone (Jio, Airtel, 4G / 5G data)');
    console.log('   - Any Laptop or Tablet connected to ANY different Wi-Fi');
    console.log('   - Any browser outside your home/host network');
    console.log('\n💡 Note: First-time visitors will see a friendly one-time');
    console.log('   verification page. Simply click "Click to Continue" or enter');
    console.log('   your public IP to view the portal.\n');
    console.log('Press Ctrl + C to stop the tunnel.');
    console.log('======================================================\n');

    tunnel.on('close', () => {
      console.log('\n🛑 Tunnel connection closed.');
      cleanup();
    });

    tunnel.on('error', (err) => {
      console.error('\n⚠️ Tunnel error:', err.message);
    });

    process.on('SIGINT', () => {
      console.log('\nStopping tunnel...');
      tunnel.close();
      cleanup();
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Failed to establish public tunnel:', err.message);
    console.log('\nAlternative: For direct local Wi-Fi / hotspot devices, use:');
    console.log(`   http://<YOUR_LAN_IP>:${PORT}/`);
    process.exit(1);
  }
}

function cleanup() {
  try {
    if (fs.existsSync(TUNNEL_FILE)) {
      fs.unlinkSync(TUNNEL_FILE);
    }
  } catch (e) {}
}

startTunnel();
