// routes/adminApprovals.js
// All routes here require a valid admin JWT (verifyAdminToken middleware).
// Lets Master Admin (or Taluka Admin) review and approve/reject pending
// registrations, business profiles, and matrimony profiles.

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyAdminToken } = require('../middleware/auth');

router.use(verifyAdminToken);

// ---------- VIEW PENDING ITEMS ----------

router.get('/pending/users', async (req, res) => {
  const result = await pool.query(
    `SELECT id, full_name, mobile_number, email, business_opt_in, matrimony_opt_in, created_at
     FROM users WHERE approval_status = 'pending' ORDER BY created_at DESC`
  );
  res.json(result.rows);
});

router.get('/pending/business', async (req, res) => {
  const result = await pool.query(
    `SELECT bp.id, bp.business_name, bp.category, bp.description, bp.city,
            bp.contact_number, bp.logo_image_url, bp.created_at, u.full_name AS owner_name
     FROM business_profiles bp JOIN users u ON bp.user_id = u.id
     WHERE bp.approval_status = 'pending' ORDER BY bp.created_at DESC`
  );
  res.json(result.rows);
});

router.get('/pending/matrimony', async (req, res) => {
  const result = await pool.query(
    `SELECT mp.id, mp.age, mp.gender, mp.education, mp.profession, mp.native_place,
            mp.profile_photo_url, mp.created_at, u.full_name AS owner_name
     FROM matrimony_profiles mp JOIN users u ON mp.user_id = u.id
     WHERE mp.approval_status = 'pending' ORDER BY mp.created_at DESC`
  );
  res.json(result.rows);
});

// ---------- APPROVE / REJECT ----------

router.post('/approve/user/:id', async (req, res) => {
  await pool.query(
    `UPDATE users SET approval_status = 'approved', approved_by = $1, approved_at = NOW() WHERE id = $2`,
    [req.admin.id, req.params.id]
  );
  res.json({ message: 'User approved.' });
});

router.post('/reject/user/:id', async (req, res) => {
  await pool.query(`UPDATE users SET approval_status = 'rejected' WHERE id = $1`, [req.params.id]);
  res.json({ message: 'User rejected.' });
});

router.post('/approve/business/:id', async (req, res) => {
  await pool.query(
    `UPDATE business_profiles SET approval_status = 'approved', approved_by = $1, approved_at = NOW() WHERE id = $2`,
    [req.admin.id, req.params.id]
  );
  res.json({ message: 'Business profile approved.' });
});

router.post('/reject/business/:id', async (req, res) => {
  await pool.query(`UPDATE business_profiles SET approval_status = 'rejected' WHERE id = $1`, [req.params.id]);
  res.json({ message: 'Business profile rejected.' });
});

router.post('/approve/matrimony/:id', async (req, res) => {
  await pool.query(
    `UPDATE matrimony_profiles SET approval_status = 'approved', approved_by = $1, approved_at = NOW() WHERE id = $2`,
    [req.admin.id, req.params.id]
  );
  res.json({ message: 'Matrimony profile approved.' });
});

router.post('/reject/matrimony/:id', async (req, res) => {
  await pool.query(`UPDATE matrimony_profiles SET approval_status = 'rejected' WHERE id = $1`, [req.params.id]);
  res.json({ message: 'Matrimony profile rejected.' });
});

module.exports = router;
