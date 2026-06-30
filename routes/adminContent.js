// routes/adminContent.js
// Phase 6 Session 2 — Content Management
// Master Admin can add, edit, delete any listing, business, or matrimony profile
// directly from the admin dashboard. No SQL required after this.
// All routes protected by verifyAdminToken middleware.

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyAdminToken } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');

router.use(verifyAdminToken);

const singleImage = upload.single('image');

// ============================================================
// COMMUNITY LISTINGS (events, news, jobs, education, temple, directory)
// ============================================================

// GET all listings (with optional type filter)
router.get('/listings', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = `SELECT * FROM community_listings`;
    const params = [];
    const conditions = [];
    if (type) { params.push(type); conditions.push(`type = $${params.length}`); }
    if (status) { params.push(status); conditions.push(`approval_status = $${params.length}`); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM community_listings WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE listing (with optional image upload)
router.post('/listings', singleImage, async (req, res) => {
  try {
    const { type, title, description, meta_line, approval_status } = req.body;
    if (!type || !title) return res.status(400).json({ error: 'type and title are required.' });

    let image_url = req.body.image_url || null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, `listings/${type}`);
      image_url = uploaded.url;
    }

    const result = await pool.query(
      `INSERT INTO community_listings (type, title, description, image_url, meta_line, approval_status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [type, title, description || null, image_url, meta_line || null,
       approval_status || 'approved', req.admin.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE listing
router.put('/listings/:id', singleImage, async (req, res) => {
  try {
    const { title, description, meta_line, approval_status } = req.body;
    let image_url = req.body.image_url || null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'listings/updated');
      image_url = uploaded.url;
    }

    const existing = await pool.query('SELECT * FROM community_listings WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Not found' });
    const cur = existing.rows[0];

    const result = await pool.query(
      `UPDATE community_listings SET
        title = $1, description = $2, meta_line = $3,
        approval_status = $4, image_url = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [
        title || cur.title,
        description !== undefined ? description : cur.description,
        meta_line !== undefined ? meta_line : cur.meta_line,
        approval_status || cur.approval_status,
        image_url || cur.image_url,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE listing
router.delete('/listings/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM community_listings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Listing deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// BUSINESS PROFILES
// ============================================================

// GET all businesses (admin view — all statuses)
router.get('/businesses', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT bp.*, u.full_name AS owner_name, u.mobile_number AS owner_mobile
                 FROM business_profiles bp JOIN users u ON bp.user_id = u.id`;
    const params = [];
    if (status) { params.push(status); query += ` WHERE bp.approval_status = $1`; }
    query += ' ORDER BY bp.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE business profile (admin edits)
router.put('/businesses/:id', singleImage, async (req, res) => {
  try {
    const { business_name, category, description, contact_number,
            address, city, website_url, approval_status } = req.body;
    const existing = await pool.query('SELECT * FROM business_profiles WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Not found' });
    const cur = existing.rows[0];

    let logo_image_url = cur.logo_image_url;
    let logo_image_public_id = cur.logo_image_public_id;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'business-logos');
      logo_image_url = uploaded.url;
      logo_image_public_id = uploaded.public_id;
    }

    const result = await pool.query(
      `UPDATE business_profiles SET
        business_name=$1, category=$2, description=$3, contact_number=$4,
        address=$5, city=$6, website_url=$7, approval_status=$8,
        logo_image_url=$9, logo_image_public_id=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [
        business_name || cur.business_name,
        category || cur.category,
        description || cur.description,
        contact_number || cur.contact_number,
        address || cur.address,
        city || cur.city,
        website_url || cur.website_url,
        approval_status || cur.approval_status,
        logo_image_url,
        logo_image_public_id,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE business profile
router.delete('/businesses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM business_profiles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Business profile deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// MATRIMONY PROFILES
// ============================================================

// GET all matrimony profiles (admin view)
router.get('/matrimony', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT mp.*, u.full_name AS owner_name, u.mobile_number AS owner_mobile
                 FROM matrimony_profiles mp JOIN users u ON mp.user_id = u.id`;
    const params = [];
    if (status) { params.push(status); query += ` WHERE mp.approval_status = $1`; }
    query += ' ORDER BY mp.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE matrimony profile (admin edits)
router.put('/matrimony/:id', async (req, res) => {
  try {
    const { approval_status, phone_visible, show_to_registered_only } = req.body;
    const existing = await pool.query('SELECT * FROM matrimony_profiles WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Not found' });
    const cur = existing.rows[0];

    const result = await pool.query(
      `UPDATE matrimony_profiles SET
        approval_status=$1, phone_visible=$2, show_to_registered_only=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [
        approval_status || cur.approval_status,
        phone_visible !== undefined ? phone_visible : cur.phone_visible,
        show_to_registered_only !== undefined ? show_to_registered_only : cur.show_to_registered_only,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE matrimony profile
router.delete('/matrimony/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM matrimony_profiles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Matrimony profile deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// USERS MANAGEMENT (admin view all users, delete a user)
// ============================================================

router.get('/users', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT u.id, u.full_name, u.mobile_number, u.email,
                        u.business_opt_in, u.matrimony_opt_in,
                        u.approval_status, r.name AS role,
                        s.name AS state_name, d.name AS district_name, t.name AS taluka_name,
                        u.created_at
                 FROM users u
                 JOIN roles r ON u.role_id = r.id
                 LEFT JOIN states s ON u.state_id = s.id
                 LEFT JOIN districts d ON u.district_id = d.id
                 LEFT JOIN talukas t ON u.taluka_id = t.id`;
    const params = [];
    if (status) { params.push(status); query += ` WHERE u.approval_status = $1`; }
    query += ' ORDER BY u.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const check = await pool.query('SELECT role_id FROM users WHERE id = $1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ error: 'User not found' });
    // Prevent deleting master_admin accounts
    const roleCheck = await pool.query('SELECT name FROM roles WHERE id = $1', [check.rows[0].role_id]);
    if (roleCheck.rows[0]?.name === 'master_admin') {
      return res.status(403).json({ error: 'Cannot delete a master admin account.' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// STATS DASHBOARD (live platform numbers)
// ============================================================

router.get('/stats', async (req, res) => {
  try {
    const [users, pending_users, businesses, pending_biz,
           matrimony, pending_mat, listings] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users WHERE approval_status='approved' AND full_name NOT LIKE '[SAMPLE]%'`),
      pool.query(`SELECT COUNT(*) FROM users WHERE approval_status='pending'`),
      pool.query(`SELECT COUNT(*) FROM business_profiles WHERE approval_status='approved'`),
      pool.query(`SELECT COUNT(*) FROM business_profiles WHERE approval_status='pending'`),
      pool.query(`SELECT COUNT(*) FROM matrimony_profiles WHERE approval_status='approved'`),
      pool.query(`SELECT COUNT(*) FROM matrimony_profiles WHERE approval_status='pending'`),
      pool.query(`SELECT type, COUNT(*) FROM community_listings WHERE approval_status='approved' GROUP BY type`),
    ]);

    const listingCounts = {};
    listings.rows.forEach(r => { listingCounts[r.type] = parseInt(r.count); });

    res.json({
      approved_members: parseInt(users.rows[0].count),
      pending_members: parseInt(pending_users.rows[0].count),
      approved_businesses: parseInt(businesses.rows[0].count),
      pending_businesses: parseInt(pending_biz.rows[0].count),
      approved_matrimony: parseInt(matrimony.rows[0].count),
      pending_matrimony: parseInt(pending_mat.rows[0].count),
      listings: listingCounts
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
