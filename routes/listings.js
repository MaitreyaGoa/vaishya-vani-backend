// routes/listings.js
// Public read-only routes that power the homepage category pages.
// Only returns approval_status = 'approved' rows — pending/rejected items
// never show up publicly, per the platform's approval-first rule.

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Generic listings: events, news, jobs, education, temple, directory
router.get('/listings/:type', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, type, title, description, image_url, meta_line, created_at
       FROM community_listings
       WHERE type = $1 AND approval_status = 'approved'
       ORDER BY created_at DESC`,
      [req.params.type]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Business Hub — approved businesses only
router.get('/businesses', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, business_name, category, description, contact_number, city,
              website_url, logo_image_url, created_at
       FROM business_profiles
       WHERE approval_status = 'approved'
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Matrimony Portal — approved profiles only, phone hidden unless phone_visible = true
router.get('/matrimony', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, age, gender, education, profession, native_place, current_location,
              height, gotra, language_preference, profile_photo_url,
              CASE WHEN phone_visible THEN family_contact ELSE NULL END AS family_contact,
              created_at
       FROM matrimony_profiles
       WHERE approval_status = 'approved'
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
