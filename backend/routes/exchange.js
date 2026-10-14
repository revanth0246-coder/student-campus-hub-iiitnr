const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../config/database');
const { authenticate } = require('../middleware/auth');

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
      // Default to active unless specified
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

    // Get counts for dashboard and tabs
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

// POST /api/exchange (Create Listing)
router.post('/', authenticate, async (req, res) => {
  const { type, title, description, category, price, location, imageUrl, contactPref } = req.body;

  if (!type || !title || !description) {
    return res.status(400).json({ success: false, message: 'Listing type, title, and description are required.' });
  }

  const validTypes = ['sell', 'lost', 'found'];
  if (!validTypes.includes(type.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Invalid listing type. Must be sell, lost, or found.' });
  }

  const id = 'ex_' + Date.now();
  const userName = req.user?.name || req.body.userName || 'Campus Student';
  const userRoll = (req.user?.roll || req.body.userRoll || '24DSAI001').toUpperCase();
  const userId = req.user?.id || req.body.userId || 'student_001';

  try {
    await runAsync(`
      INSERT INTO marketplace_listings (
        id, user_id, user_name, user_roll, type, title, description,
        category, price, location, image_url, status, contact_pref
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `, [
      id,
      userId,
      userName,
      userRoll,
      type.toLowerCase(),
      title.trim(),
      description.trim(),
      category || 'General',
      price ? price.trim() : '',
      location ? location.trim() : 'Campus',
      imageUrl || '',
      contactPref || 'In-App Message'
    ]);

    const created = {
      id,
      userId,
      userName,
      userRoll,
      type: type.toLowerCase(),
      title: title.trim(),
      description: description.trim(),
      category: category || 'General',
      price: price ? price.trim() : '',
      location: location ? location.trim() : 'Campus',
      imageUrl: imageUrl || '',
      status: 'active',
      contactPref: contactPref || 'In-App Message',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    res.status(201).json({ success: true, message: 'Listing posted successfully to Campus Exchange!', item: created });
  } catch (err) {
    console.error('Error creating exchange listing:', err);
    res.status(500).json({ success: false, message: 'Database error posting listing.' });
  }
});

// PUT /api/exchange/:id/status (Mark Sold or Resolved)
router.put('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const listingId = req.params.id;

  if (!['active', 'sold', 'resolved'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be active, sold, or resolved.' });
  }

  try {
    const existing = await getAsync(`SELECT * FROM marketplace_listings WHERE id = ?`, [listingId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    // Role check: Only author or admin can update status
    const isOwner = req.user && (req.user.id === existing.user_id || req.user.roll === existing.user_roll);
    const isAdmin = req.user && req.user.role === 'admin';
    const fallbackRoll = req.headers['x-user-roll'] || req.body.userRoll;
    const isOwnerFallback = fallbackRoll && fallbackRoll.toUpperCase() === existing.user_roll.toUpperCase();

    if (!isOwner && !isAdmin && !isOwnerFallback) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only update your own listings.' });
    }

    await runAsync(`UPDATE marketplace_listings SET status = ? WHERE id = ?`, [status, listingId]);

    res.json({ success: true, message: `Listing marked as ${status}.` });
  } catch (err) {
    console.error('Error updating listing status:', err);
    res.status(500).json({ success: false, message: 'Database error updating listing status.' });
  }
});

// DELETE /api/exchange/:id (Delete listing)
router.delete('/:id', authenticate, async (req, res) => {
  const listingId = req.params.id;

  try {
    const existing = await getAsync(`SELECT * FROM marketplace_listings WHERE id = ?`, [listingId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const isOwner = req.user && (req.user.id === existing.user_id || req.user.roll === existing.user_roll);
    const isAdmin = req.user && req.user.role === 'admin';
    const fallbackRoll = req.headers['x-user-roll'] || req.query.userRoll;
    const isOwnerFallback = fallbackRoll && fallbackRoll.toUpperCase() === existing.user_roll.toUpperCase();

    if (!isOwner && !isAdmin && !isOwnerFallback) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own listings.' });
    }

    await runAsync(`DELETE FROM marketplace_listings WHERE id = ?`, [listingId]);
    res.json({ success: true, message: 'Listing removed from Campus Exchange.' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ success: false, message: 'Database error deleting listing.' });
  }
});

// POST /api/exchange/:id/inquiry (Send message to seller/finder)
router.post('/:id/inquiry', async (req, res) => {
  const listingId = req.params.id;
  const { senderRoll, senderName, message, contactInfo } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
  }

  try {
    const listing = await getAsync(`SELECT * FROM marketplace_listings WHERE id = ?`, [listingId]);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const cleanSenderRoll = (senderRoll || '24DSAI001').toUpperCase();
    const cleanSenderName = senderName || 'Campus Student';

    await runAsync(`
      INSERT INTO marketplace_inquiries (listing_id, sender_roll, sender_name, message, contact_info)
      VALUES (?, ?, ?, ?, ?)
    `, [
      listingId,
      cleanSenderRoll,
      cleanSenderName,
      message.trim(),
      contactInfo ? contactInfo.trim() : cleanSenderRoll
    ]);

    // Create an in-app notification for the listing owner
    try {
      await runAsync(`
        INSERT INTO notifications (user_roll, type, title, message, link_view)
        VALUES (?, 'exchange', ?, ?, 'exchange')
      `, [
        listing.user_roll,
        `New Inquiry on "${listing.title}"`,
        `${cleanSenderName} (${cleanSenderRoll}) sent you a message: "${message.trim().substring(0, 80)}${message.length > 80 ? '...' : ''}"`
      ]);
    } catch (ne) {}

    res.status(201).json({
      success: true,
      message: 'Inquiry sent securely to the listing owner!'
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ success: false, message: 'Database error saving inquiry.' });
  }
});

module.exports = router;
