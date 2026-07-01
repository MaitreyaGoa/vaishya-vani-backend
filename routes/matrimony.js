// routes/matrimony.js
// Phase 4 — Matrimony public routes
// Search/filter matrimony profiles and view individual profile details.
// Privacy rules enforced:
//   - show_to_registered_only profiles hidden from public (requires auth in future)
//   - phone/family contact hidden unless phone_visible = true
//   - Photos always shown (privacy is handled by the approval-first system)

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ── Matrimony directory with search + filters ──
// Query params: gender, min_age, max_age, education, profession, gotra,
//               native_place, state_id, district_id, page
router.get('/matrimony/search', async (req, res) => {
  try {
    const {
      gender, min_age, max_age, education, profession,
      gotra, native_place, state_id, district_id, page = 1
    } = req.query;

    const limit = 12;
    const offset = (parseInt(page) - 1) * limit;
    const conditions = [`mp.approval_status = 'approved'`];
    const params = [];

    if (gender) { params.push(gender); conditions.push(`mp.gender = $${params.length}`); }
    if (min_age) { params.push(parseInt(min_age)); conditions.push(`mp.age >= $${params.length}`); }
    if (max_age) { params.push(parseInt(max_age)); conditions.push(`mp.age <= $${params.length}`); }
    if (education) { params.push(`%${education}%`); conditions.push(`mp.education ILIKE $${params.length}`); }
    if (profession) { params.push(`%${profession}%`); conditions.push(`mp.profession ILIKE $${params.length}`); }
    if (gotra) { params.push(`%${gotra}%`); conditions.push(`mp.gotra ILIKE $${params.length}`); }
    if (native_place) { params.push(`%${native_place}%`); conditions.push(`mp.native_place ILIKE $${params.length}`); }
    if (state_id) { params.push(state_id); conditions.push(`u.state_id = $${params.length}`); }
    if (district_id) { params.push(district_id); conditions.push(`u.district_id = $${params.length}`); }

    const where = 'WHERE ' + conditions.join(' AND ');

    const [results, countResult, gotras] = await Promise.all([
      pool.query(`
        SELECT mp.id, mp.age, mp.gender, mp.education, mp.profession, mp.height,
               mp.native_place, mp.current_location, mp.gotra, mp.language_preference,
               mp.profile_photo_url, mp.show_to_registered_only, mp.created_at,
               s.name AS state_name, d.name AS district_name, t.name AS taluka_name
        FROM matrimony_profiles mp
        JOIN users u ON mp.user_id = u.id
        LEFT JOIN states s ON u.state_id = s.id
        LEFT JOIN districts d ON u.district_id = d.id
        LEFT JOIN talukas t ON u.taluka_id = t.id
        ${where}
        ORDER BY mp.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, params),
      pool.query(`
        SELECT COUNT(*) FROM matrimony_profiles mp
        JOIN users u ON mp.user_id = u.id
        ${where}
      `, params),
      pool.query(`
        SELECT DISTINCT gotra FROM matrimony_profiles
        WHERE approval_status = 'approved' AND gotra IS NOT NULL
        ORDER BY gotra
      `)
    ]);

    res.json({
      profiles: results.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      gotras: gotras.rows.map(r => r.gotra)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Single matrimony profile detail ──
router.get('/matrimony/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mp.id, mp.age, mp.gender, mp.education, mp.profession, mp.height,
             mp.native_place, mp.current_location, mp.gotra, mp.language_preference,
             mp.family_background, mp.family_introduction,
             mp.profile_photo_url, mp.horoscope_url,
             mp.show_to_registered_only, mp.phone_visible,
             CASE WHEN mp.phone_visible THEN mp.family_contact ELSE NULL END AS family_contact,
             mp.created_at,
             s.name AS state_name, d.name AS district_name, t.name AS taluka_name
      FROM matrimony_profiles mp
      JOIN users u ON mp.user_id = u.id
      LEFT JOIN states s ON u.state_id = s.id
      LEFT JOIN districts d ON u.district_id = d.id
      LEFT JOIN talukas t ON u.taluka_id = t.id
      WHERE mp.id = $1 AND mp.approval_status = 'approved'
    `, [req.params.id]);

    if (!result.rows.length) return res.status(404).json({ error: 'Profile not found.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Summary stats for matrimony section ──
router.get('/matrimony-stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE gender = 'Male') AS male_count,
        COUNT(*) FILTER (WHERE gender = 'Female') AS female_count
      FROM matrimony_profiles WHERE approval_status = 'approved'
    `);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
