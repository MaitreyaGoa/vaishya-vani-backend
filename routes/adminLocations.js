// routes/adminLocations.js
// Master Admin-only routes to manage the location hierarchy (states/districts/talukas).
// This exists specifically so inaccuracies in the seeded government data can be corrected
// directly from the admin panel, without needing a code deployment.
//
// NOTE: Auth middleware (verifying role = 'master_admin') will be wired in during the
// Authentication session (Phase 1) — for now these routes are functionally complete
// and ready to be protected once auth middleware exists.

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ========== STATES ==========

// Add a new state
router.post('/states', async (req, res) => {
  const { name, is_priority_state } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO states (name, is_priority_state) VALUES ($1, $2) RETURNING *',
      [name, is_priority_state || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a state (e.g. rename, toggle priority status)
router.put('/states/:id', async (req, res) => {
  const { name, is_priority_state } = req.body;
  try {
    const result = await pool.query(
      'UPDATE states SET name = COALESCE($1, name), is_priority_state = COALESCE($2, is_priority_state) WHERE id = $3 RETURNING *',
      [name, is_priority_state, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'State not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========== DISTRICTS ==========

// Add a new district under a state
router.post('/districts', async (req, res) => {
  const { state_id, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO districts (state_id, name) VALUES ($1, $2) RETURNING *',
      [state_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit/rename a district
router.put('/districts/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE districts SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'District not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a district (only if no talukas/users reference it — DB foreign keys will protect against orphaning)
router.delete('/districts/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM districts WHERE id = $1', [req.params.id]);
    res.json({ message: 'District deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Cannot delete — district may still have talukas or registered users linked to it.' });
  }
});

// ========== TALUKAS ==========
// This is the core fix for inaccurate/incomplete government data —
// Master Admin (or in future, a Taluka Admin for their own area) can correct entries here.

// Add a new taluka under a district
router.post('/talukas', async (req, res) => {
  const { district_id, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO talukas (district_id, name) VALUES ($1, $2) RETURNING *',
      [district_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit/rename a taluka
router.put('/talukas/:id', async (req, res) => {
  const { name, district_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE talukas SET name = COALESCE($1, name), district_id = COALESCE($2, district_id) WHERE id = $3 RETURNING *',
      [name, district_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Taluka not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a taluka (only if no users are registered under it)
router.delete('/talukas/:id', async (req, res) => {
  try {
    const usersCheck = await pool.query('SELECT COUNT(*) FROM users WHERE taluka_id = $1', [req.params.id]);
    if (parseInt(usersCheck.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete — users are already registered under this taluka. Reassign them first.' });
    }
    await pool.query('DELETE FROM talukas WHERE id = $1', [req.params.id]);
    res.json({ message: 'Taluka deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk view: full hierarchy for a state (useful for an admin "review & correct" screen)
router.get('/hierarchy/:stateId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id AS district_id, d.name AS district_name,
             t.id AS taluka_id, t.name AS taluka_name
      FROM districts d
      LEFT JOIN talukas t ON t.district_id = d.id
      WHERE d.state_id = $1
      ORDER BY d.name, t.name
    `, [req.params.stateId]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
