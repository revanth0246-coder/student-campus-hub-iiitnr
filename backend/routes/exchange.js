const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate, requireAuth } = require('../middleware/auth');
const { validate, exchangeListingSchema } = require('../middleware/validation');
const { broadcastSync } = require('../services/realtime');
const { uploadImage } = require('../config/cloudinary');

// GET /api/exchange (Listings with filters)
router.get('/', async (req, res) => {
  const { type, category, status, search } = req.query;

  try {
    let sql = `
      SELECT 
        id, user_id as userId, user_name as userName, user_roll as userRoll,
        type, title, description, category, price, location,
        image_url as imageUrl, status, contact_pref as contactPref,
        strftime('%d %b %Y', created_at) as date,
        created_at as createdAt
      FROM marketplace_listings
      WHERE 1=1
    `;
    const params = [];

    if (type && type !== 'all') {
      sql += ` AND type = ?`;
      params.push(type.toLowerCase());
    }

    if (status && status !== 'all') {
      sql += ` AND status = ?`;
      params.push(status.toLowerCase());
    } else if (!status) {
      sql += ` AND status = 'active'`;
    }

    if (category && category !== 'all' && category !== 'All Categories') {
      sql += ` AND category = ?`;
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR location LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY created_at DESC`;

    const listings = await allAsync(sql, params);

    const counts = {
      sell: (await getAsync(`SELECT COUNT(*) as c FROM marketplace_listings WHERE type='sell' AND status='active'`))?.c || 0,
      lost: (await getAsync(`SELECT COUNT(*) as c FROM marketplace_listings WHERE type='lost' AND status='active'`))?.c || 0,
      found: (await getAsync(`SELECT COUNT(*) as c FROM marketplace_listings WHERE type='found' AND status='active'`))?.c || 0,
    };

    res.json({ success: true, listings, counts });
  } catch (err) {
    console.error('Error fetching exchange listings:', err);
    res.status(500).json({ success: false, message: 'Database error fetching exchange listings.' });
  }
});

// GET /api/exchange/:id (Single listing details)
router.get('/:id', async (req, res) => {
  try {
    const item = await getAsync(`
      SELECT 
        id, user_id as userId, user_name as userName, user_roll as userRoll,
        type, title, description, category, price, location,
        image_url as imageUrl, status, contact_pref as contactPref,
        strftime('%d %b %Y', created_at) as date,
        created_at as createdAt
      FROM marketplace_listings
      WHERE id = ?
    `, [req.params.id]);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const inquiries = await allAsync(`
      SELECT 
        id, sender_roll as senderRoll, sender_name as senderName,
        message, contact_info as contactInfo,
        strftime('%d %b %H:%M', created_at) as timestamp
      FROM marketplace_inquiries
      WHERE listing_id = ?
      ORDER BY id DESC
    `, [item.id]);

    res.json({ success: true, item, inquiries });
  } catch (err) {
    console.error('Error fetching exchange item:', err);
    res.status(500).json({ success: false, message: 'Database error fetching listing details.' });
  }
});

// POST /api/exchange (Create Listing - Authenticated User)
router.post('/', authenticate, requireAuth, validate(exchangeListingSchema), async (req, res) => {
  const { type, title, description, category, price, location, image_url, contact_pref } = req.body;
  const id = 'exch_' + Date.now();
  const userId = req.user.id;
  const userName = req.user.name || 'Campus Student';
  const userRoll = (req.user.roll || 'STUDENT').toUpperCase();

  try {
    let finalImageUrl = image_url || null;
    if (finalImageUrl && finalImageUrl.startsWith('data:image')) {
      const uploadRes = await uploadImage(finalImageUrl, { folder: 'iiitnr-campus-hub/exchange' });
      if (uploadRes?.url) finalImageUrl = uploadRes.url;
    }

    await runAsync(`
      INSERT INTO marketplace_listings 
        (id, user_id, user_name, user_roll, type, title, description, category, price, location, image_url, status, contact_pref)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `, [
      id,
      userId,
      userName,
      userRoll,
      type.toLowerCase(),
      title.trim(),
      description.trim(),
      category || 'General',
      price || null,
      location || null,
      finalImageUrl,
      contact_pref || 'In-App Message'
    ]);

    const created = await getAsync(`SELECT * FROM marketplace_listings WHERE id = ?`, [id]);
    try { broadcastSync('exchange_updated', { listing: created }); } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Listing posted successfully.',
      listing: created
    });
  } catch (err) {
    console.error('Error creating exchange listing:', err);
    res.status(500).json({ success: false, message: 'Database error creating listing.' });
  }
});

// PUT /api/exchange/:id/status (Update status: active, sold, resolved)
router.put('/:id/status', authenticate, requireAuth, async (req, res) => {
  const { status } = req.body;
  const listingId = req.params.id;

  if (!status || !['active', 'sold', 'resolved'].includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, message: "Valid status required ('active', 'sold', 'resolved')." });
  }

  try {
    const existing = await getAsync(`SELECT * FROM marketplace_listings WHERE id = ?`, [listingId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    // Must be listing owner or admin
    if (existing.user_id !== req.user.id && existing.user_roll !== req.user.roll && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only update your own listings.' });
    }

    await runAsync(`UPDATE marketplace_listings SET status = ? WHERE id = ?`, [status.toLowerCase(), listingId]);
    try { broadcastSync('exchange_updated', { id: listingId, status }); } catch (e) {}

    res.json({ success: true, message: `Listing marked as ${status}.` });
  } catch (err) {
    console.error('Error updating listing status:', err);
    res.status(500).json({ success: false, message: 'Database error updating status.' });
  }
});

// DELETE /api/exchange/:id (Delete Listing - Owner or Admin)
router.delete('/:id', authenticate, requireAuth, async (req, res) => {
  const listingId = req.params.id;

  try {
    const existing = await getAsync(`SELECT * FROM marketplace_listings WHERE id = ?`, [listingId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    // Must be owner or admin
    if (existing.user_id !== req.user.id && existing.user_roll !== req.user.roll && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own listings.' });
    }

    await runAsync(`DELETE FROM marketplace_inquiries WHERE listing_id = ?`, [listingId]);
    await runAsync(`DELETE FROM marketplace_listings WHERE id = ?`, [listingId]);
    try { broadcastSync('exchange_updated', { id: listingId, removed: true }); } catch (e) {}

    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ success: false, message: 'Database error deleting listing.' });
  }
});

// POST /api/exchange/:id/inquiry (Send Inquiry Message - Authenticated)
router.post('/:id/inquiry', authenticate, requireAuth, async (req, res) => {
  const listingId = req.params.id;
  const { message, contactInfo } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message text is required.' });
  }

  const senderRoll = (req.user.roll || 'STUDENT').toUpperCase();
  const senderName = req.user.name || 'Campus Student';

  try {
    const listing = await getAsync(`SELECT title, user_roll FROM marketplace_listings WHERE id = ?`, [listingId]);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    await runAsync(`
      INSERT INTO marketplace_inquiries (listing_id, sender_roll, sender_name, message, contact_info)
      VALUES (?, ?, ?, ?, ?)
    `, [listingId, senderRoll, senderName, message.trim(), contactInfo ? contactInfo.trim() : null]);

    // Send notification to listing owner
    if (listing.user_roll) {
      try {
        await runAsync(`
          INSERT INTO notifications (user_roll, type, title, message, link_view)
          VALUES (?, 'exchange', ?, ?, 'exchange')
        `, [
          listing.user_roll,
          `New inquiry on: ${listing.title}`,
          `${senderName} sent you a message: "${message.trim().substring(0, 80)}..."`
        ]);
      } catch (ne) {}
    }

    res.status(201).json({ success: true, message: 'Inquiry message sent successfully.' });
  } catch (err) {
    console.error('Error sending inquiry:', err);
    res.status(500).json({ success: false, message: 'Database error sending inquiry.' });
  }
});

module.exports = router;
