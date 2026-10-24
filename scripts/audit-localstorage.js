const fs = require('fs');

['app.js', 'index.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`\n================== ${file} ==================`);
  lines.forEach((line, idx) => {
    if (line.includes('localStorage')) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  });
});
