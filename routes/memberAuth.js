// routes/memberAuth.js
// Phase 4 Session 2 — Member authentication
// Regular members (not admin) can log in to:
//   - Send/receive interests
//   - View their own profile and matches
// Uses the same JWT system as admin but with a 'member' role token.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Member login
router.post('/member/login', async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    if (!mobile_number || !password) {
      return res.status(400).json({ error: 'Mobile number and password are required.' });
    }

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.mobile_number, u.password_hash,
              u.approval_status, r.name AS role
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.mobile_number = $1`,
      [mobile_number]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid mobile number or password.' });
    }

    const user = result.rows[0];

    if (user.approval_status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending admin approval. You will be notified once approved.' });
    }
    if (user.approval_status === 'rejected') {
      return res.status(403).json({ error: 'Your account registration was not approved. Please contact the community admin.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid mobile number or password.' });
    }

    // Get their matrimony profile ID if they have one
    const matResult = await pool.query(
      `SELECT id FROM matrimony_profiles WHERE user_id = $1 AND approval_status = 'approved'`,
      [user.id]
    );
    const matrimonyProfileId = matResult.rows[0]?.id || null;

    const token = jwt.sign(
      { id: user.id, role: user.role, full_name: user.full_name, matrimony_profile_id: matrimonyProfileId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        mobile_number: user.mobile_number,
        role: user.role,
        matrimony_profile_id: matrimonyProfileId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get own profile (requires member token)
router.get('/member/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Not logged in.' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.mobile_number, u.email,
              u.business_opt_in, u.matrimony_opt_in, u.approval_status,
              s.name AS state_name, d.name AS district_name, t.name AS taluka_name
       FROM users u
       LEFT JOIN states s ON u.state_id = s.id
       LEFT JOIN districts d ON u.district_id = d.id
       LEFT JOIN talukas t ON u.taluka_id = t.id
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'User not found.' });

    const matResult = await pool.query(
      `SELECT id FROM matrimony_profiles WHERE user_id = $1 AND approval_status = 'approved'`,
      [decoded.id]
    );

    res.json({
      ...result.rows[0],
      matrimony_profile_id: matResult.rows[0]?.id || null
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
});

module.exports = router;
