// routes/business.js
// Phase 3 — Business Hub public routes
// Powers the business directory page — search, filter by category/state/district/city,
// and individual business detail page.
// All routes return only approval_status = 'approved' listings.

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ── Business directory with search + filters ──
// Query params: q (text search), category, state_id, district_id, taluka_id, city, page
router.get('/businesses/search', async (req, res) => {
  try {
    const { q, category, state_id, district_id, taluka_id, city, page = 1 } = req.query;
    const limit = 12;
    const offset = (parseInt(page) - 1) * limit;
    const conditions = [`bp.approval_status = 'approved'`];
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(bp.business_name ILIKE $${params.length} OR bp.description ILIKE $${params.length} OR bp.category ILIKE $${params.length})`);
    }
    if (category) { params.push(category); conditions.push(`bp.category ILIKE $${params.length}`); }
    if (state_id) { params.push(state_id); conditions.push(`bp.state_id = $${params.length}`); }
    if (district_id) { params.push(district_id); conditions.push(`bp.district_id = $${params.length}`); }
    if (taluka_id) { params.push(taluka_id); conditions.push(`bp.taluka_id = $${params.length}`); }
    if (city) { params.push(`%${city}%`); conditions.push(`bp.city ILIKE $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const [results, countResult, categories] = await Promise.all([
      pool.query(`
        SELECT bp.id, bp.business_name, bp.category, bp.description,
               bp.contact_number, bp.city, bp.address, bp.website_url,
               bp.logo_image_url, bp.created_at,
               s.name AS state_name, d.name AS district_name, t.name AS taluka_name
        FROM business_profiles bp
        LEFT JOIN states s ON bp.state_id = s.id
        LEFT JOIN districts d ON bp.district_id = d.id
        LEFT JOIN talukas t ON bp.taluka_id = t.id
        ${where}
        ORDER BY bp.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, params),
      pool.query(`SELECT COUNT(*) FROM business_profiles bp ${where}`, params),
      pool.query(`SELECT DISTINCT category FROM business_profiles WHERE approval_status = 'approved' AND category IS NOT NULL ORDER BY category`)
    ]);

    res.json({
      businesses: results.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      categories: categories.rows.map(r => r.category)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Single business detail ──
router.get('/businesses/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bp.*,
             s.name AS state_name, d.name AS district_name, t.name AS taluka_name,
             u.full_name AS owner_name
      FROM business_profiles bp
      LEFT JOIN states s ON bp.state_id = s.id
      LEFT JOIN districts d ON bp.district_id = d.id
      LEFT JOIN talukas t ON bp.taluka_id = t.id
      LEFT JOIN users u ON bp.user_id = u.id
      WHERE bp.id = $1 AND bp.approval_status = 'approved'
    `, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Business not found.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Related businesses (same category, excluding current) ──
router.get('/businesses/:id/related', async (req, res) => {
  try {
    const biz = await pool.query('SELECT category, state_id FROM business_profiles WHERE id = $1', [req.params.id]);
    if (!biz.rows.length) return res.json([]);
    const { category, state_id } = biz.rows[0];
    const result = await pool.query(`
      SELECT id, business_name, category, city, logo_image_url, description
      FROM business_profiles
      WHERE approval_status = 'approved'
        AND id != $1
        AND (category = $2 OR state_id = $3)
      LIMIT 3
    `, [req.params.id, category, state_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
