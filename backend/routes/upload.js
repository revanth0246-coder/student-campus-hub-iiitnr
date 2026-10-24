const express = require('express');
const router = express.Router();
const { uploadImage, isCloudinaryConfigured } = require('../config/cloudinary');

// POST /api/upload (General Image Upload to Cloudinary)
router.post('/', async (req, res) => {
  const fileSource = req.body.dataUrl || req.body.image || req.body.photo;
  const folder = req.body.folder || 'iiitnr-campus-hub/general';

  if (!fileSource) {
    return res.status(400).json({ success: false, message: 'Missing image data (dataUrl or image parameter required).' });
  }

  try {
    const result = await uploadImage(fileSource, { folder });
    if (!result.success && !result.url) {
      return res.status(500).json({ success: false, message: result.error || 'Failed to upload image.' });
    }

    res.json({
      success: true,
      message: result.provider === 'cloudinary' 
        ? 'Image successfully stored in Cloudinary cloud storage.' 
        : 'Image saved successfully.',
      url: result.url,
      provider: result.provider,
      cloudinary: isCloudinaryConfigured()
    });
  } catch (err) {
    console.error('API image upload error:', err);
    res.status(500).json({ success: false, message: 'Server error processing image upload: ' + err.message });
  }
});

// POST /api/upload/avatar (Profile Picture Upload)
router.post('/avatar', async (req, res) => {
  const fileSource = req.body.dataUrl || req.body.avatar || req.body.image;

  if (!fileSource) {
    return res.status(400).json({ success: false, message: 'Missing avatar image data.' });
  }

  try {
    const result = await uploadImage(fileSource, { folder: 'iiitnr-campus-hub/avatars' });
    res.json({
      success: true,
      message: 'Avatar uploaded successfully.',
      url: result.url,
      provider: result.provider
    });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ success: false, message: 'Server error uploading avatar: ' + err.message });
  }
});

// POST /api/upload/banner (Campus Event Banner Upload)
router.post('/banner', async (req, res) => {
  const fileSource = req.body.dataUrl || req.body.banner || req.body.image;

  if (!fileSource) {
    return res.status(400).json({ success: false, message: 'Missing event banner image data.' });
  }

  try {
    const result = await uploadImage(fileSource, { folder: 'iiitnr-campus-hub/events' });
    res.json({
      success: true,
      message: 'Event banner uploaded successfully.',
      url: result.url,
      provider: result.provider
    });
  } catch (err) {
    console.error('Banner upload error:', err);
    res.status(500).json({ success: false, message: 'Server error uploading banner: ' + err.message });
  }
});

// POST /api/upload/exchange (Marketplace Item Photo Upload)
router.post('/exchange', async (req, res) => {
  const fileSource = req.body.dataUrl || req.body.image || req.body.photo;

  if (!fileSource) {
    return res.status(400).json({ success: false, message: 'Missing item photo data.' });
  }

  try {
    const result = await uploadImage(fileSource, { folder: 'iiitnr-campus-hub/exchange' });
    res.json({
      success: true,
      message: 'Item photo uploaded successfully.',
      url: result.url,
      provider: result.provider
    });
  } catch (err) {
    console.error('Exchange photo upload error:', err);
    res.status(500).json({ success: false, message: 'Server error uploading exchange photo: ' + err.message });
  }
});

module.exports = router;
