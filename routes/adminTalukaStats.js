// routes/adminTalukaStats.js
// Phase 6 Session 3
// Two responsibilities:
//   1. Taluka Admin management — assign/remove regional admins
//   2. Registration stats — per state/district/taluka breakdown
//      (powers the "90% registration goal" tracking dashboard)

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyAdminToken } = require('../middleware/auth');

router.use(verifyAdminToken);

// ============================================================
// TALUKA ADMIN MANAGEMENT
// ============================================================

// List all current taluka admins with their assignment details
router.get('/taluka-admins', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id, u.full_name, u.mobile_number, u.email,
        u.approval_status, u.created_at,
        aa.id AS assignment_id,
        aa.taluka_id, aa.district_id,
        t.name AS taluka_name,
        d.name AS district_name,
        s.name AS state_name,
        assigner.full_name AS assigned_by_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN admin_assignments aa ON aa.user_id = u.id
      LEFT JOIN talukas t ON aa.taluka_id = t.id
      LEFT JOIN districts d ON COALESCE(t.district_id, aa.district_id) = d.id
      LEFT JOIN states s ON d.state_id = s.id
      LEFT JOIN users assigner ON aa.assigned_by = assigner.id
      WHERE r.name = 'taluka_admin'
      ORDER BY s.name, d.name, t.name
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Assign a registered member as a Taluka Admin
// Body: { user_id, taluka_id OR district_id }
// taluka_id → for priority states (Goa/MH/KA/KL)
// district_id → for "Rest of India" (no taluka level)
router.post('/taluka-admins/assign', async (req, res) => {
  try {
    const { user_id, taluka_id, district_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required.' });
    if (!taluka_id && !district_id) return res.status(400).json({ error: 'Either taluka_id or district_id is required.' });

    // Upgrade the user's role to taluka_admin
    const roleResult = await pool.query(`SELECT id FROM roles WHERE name = 'taluka_admin'`);
    const talukaAdminRoleId = roleResult.rows[0].id;

    await pool.query(
      `UPDATE users SET role_id = $1 WHERE id = $2`,
      [talukaAdminRoleId, user_id]
    );

    // Create or update the admin assignment
    await pool.query(
      `INSERT INTO admin_assignments (user_id, taluka_id, district_id, assigned_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
         SET taluka_id = $2, district_id = $3, assigned_by = $4`,
      [user_id, taluka_id || null, district_id || null, req.admin.id]
    );

    res.json({ message: 'Taluka Admin assigned successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Remove a Taluka Admin (reverts them to regular member)
router.delete('/taluka-admins/:userId', async (req, res) => {
  try {
    const roleResult = await pool.query(`SELECT id FROM roles WHERE name = 'member'`);
    const memberRoleId = roleResult.rows[0].id;

    await pool.query(`UPDATE users SET role_id = $1 WHERE id = $2`, [memberRoleId, req.params.userId]);
    await pool.query(`DELETE FROM admin_assignments WHERE user_id = $1`, [req.params.userId]);

    res.json({ message: 'Taluka Admin removed. User reverted to regular member.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Search approved members (to find someone to assign as Taluka Admin)
router.get('/members/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const result = await pool.query(`
      SELECT u.id, u.full_name, u.mobile_number,
             s.name AS state_name, d.name AS district_name, t.name AS taluka_name,
             r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN states s ON u.state_id = s.id
      LEFT JOIN districts d ON u.district_id = d.id
      LEFT JOIN talukas t ON u.taluka_id = t.id
      WHERE u.approval_status = 'approved'
        AND r.name NOT IN ('master_admin')
        AND (u.full_name ILIKE $1 OR u.mobile_number ILIKE $1)
      LIMIT 10
    `, [`%${q}%`]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================================
// REGISTRATION STATS (90% goal tracking)
// ============================================================

// Overall summary
router.get('/reg-stats/summary', async (req, res) => {
  try {
    const [total, byState] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users WHERE approval_status = 'approved' AND full_name NOT LIKE '[SAMPLE]%'`),
      pool.query(`
        SELECT s.id AS state_id, s.name AS state_name, s.is_priority_state,
               COUNT(u.id) AS member_count
        FROM states s
        LEFT JOIN users u ON u.state_id = s.id
          AND u.approval_status = 'approved'
          AND u.full_name NOT LIKE '[SAMPLE]%'
        GROUP BY s.id, s.name, s.is_priority_state
        ORDER BY member_count DESC
      `)
    ]);
    res.json({
      total_approved: parseInt(total.rows[0].count),
      by_state: byState.rows
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// District-level breakdown for a specific state
router.get('/reg-stats/state/:stateId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id AS district_id, d.name AS district_name,
             COUNT(u.id) AS member_count
      FROM districts d
      LEFT JOIN users u ON u.district_id = d.id
        AND u.approval_status = 'approved'
        AND u.full_name NOT LIKE '[SAMPLE]%'
      WHERE d.state_id = $1
      GROUP BY d.id, d.name
      ORDER BY member_count DESC
    `, [req.params.stateId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Taluka-level breakdown for a specific district
router.get('/reg-stats/district/:districtId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id AS taluka_id, t.name AS taluka_name,
             COUNT(u.id) AS member_count,
             EXISTS(
               SELECT 1 FROM admin_assignments aa WHERE aa.taluka_id = t.id
             ) AS has_admin
      FROM talukas t
      LEFT JOIN users u ON u.taluka_id = t.id
        AND u.approval_status = 'approved'
        AND u.full_name NOT LIKE '[SAMPLE]%'
      WHERE t.district_id = $1
      GROUP BY t.id, t.name
      ORDER BY member_count DESC
    `, [req.params.districtId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
