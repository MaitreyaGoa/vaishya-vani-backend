// routes/adminAuth.js
// Two routes:
//   POST /api/admin/setup  — one-time creation of your first Master Admin account.
//                             Protected by a secret key (ADMIN_SETUP_KEY env var) so
//                             nobody else can call this. After your first admin exists,
//                             you can disable/remove this route if you want extra safety.
//   POST /api/admin/login  — standard login for Master Admin / Taluka Admin, returns a JWT.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// One-time setup: create the first Master Admin
router.post('/setup', async (req, res) => {
  try {
    const { setup_key, full_name, mobile_number, password } = req.body;

    if (!setup_key || setup_key !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ error: 'Invalid setup key.' });
    }
    if (!full_name || !mobile_number || !password) {
      return res.status(400).json({ error: 'full_name, mobile_number, and password are required.' });
    }

    const roleResult = await pool.query(`SELECT id FROM roles WHERE name = 'master_admin'`);
    const masterAdminRoleId = roleResult.rows[0].id;

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, mobile_number, password_hash, role_id, approval_status)
       VALUES ($1, $2, $3, $4, 'approved')
       RETURNING id, full_name, mobile_number`,
      [full_name, mobile_number, password_hash, masterAdminRoleId]
    );

    res.status(201).json({ message: 'Master Admin account created. You can now log in.', admin: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'This mobile number is already registered.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    if (!mobile_number || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required.' });
    }

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.password_hash, r.name AS role
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.mobile_number = $1`,
      [mobile_number]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    if (user.role !== 'master_admin' && user.role !== 'taluka_admin') {
      return res.status(403).json({ error: 'This account does not have admin access.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, full_name: user.full_name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
