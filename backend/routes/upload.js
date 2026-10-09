const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// POST /api/upload/avatar (Saves gallery photo to disk)
router.post('/avatar', (req, res) => {
  const { dataUrl, filename } = req.body;

  if (!dataUrl || !dataUrl.includes(',')) {
    return res.status(400).json({ success: false, message: 'Invalid image Data URL.' });
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'Unsupported image format.' });
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const randomName = 'avatar_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex') + '.' + extension;
    const filePath = path.join(UPLOADS_DIR, randomName);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${randomName}`;
    res.json({
      success: true,
      message: 'Photo uploaded and saved to server storage.',
      url: relativeUrl
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, message: 'Server error saving image file.' });
  }
});

module.exports = router;
