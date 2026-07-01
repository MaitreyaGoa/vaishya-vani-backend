// routes/interests.js
// Phase 4 Session 2 — Interest and Match system
// All routes require a valid member JWT token.

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Middleware — verify any logged-in member (not admin-only)
function verifyMember(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Please log in to continue.' });
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

router.use(verifyMember);

// ── SEND INTEREST ──
// Body: { receiver_profile_id, message (optional) }
router.post('/interests/send', async (req, res) => {
  try {
    const { receiver_profile_id, message } = req.body;
    if (!receiver_profile_id) return res.status(400).json({ error: 'receiver_profile_id is required.' });

    // Get sender's matrimony profile
    const senderProfile = await pool.query(
      `SELECT id FROM matrimony_profiles WHERE user_id = $1 AND approval_status = 'approved'`,
      [req.user.id]
    );
    if (!senderProfile.rows.length) {
      return res.status(403).json({ error: 'You need an approved matrimony profile to send interest.' });
    }
    const senderProfileId = senderProfile.rows[0].id;

    // Get receiver's user_id from their profile
    const receiverProfile = await pool.query(
      `SELECT user_id FROM matrimony_profiles WHERE id = $1 AND approval_status = 'approved'`,
      [receiver_profile_id]
    );
    if (!receiverProfile.rows.length) return res.status(404).json({ error: 'Profile not found.' });
    const receiverId = receiverProfile.rows[0].user_id;

    if (receiverId === req.user.id) {
      return res.status(400).json({ error: 'You cannot send interest to your own profile.' });
    }

    // Insert interest (ignore if already sent)
    const result = await pool.query(
      `INSERT INTO interests (sender_id, receiver_id, sender_profile_id, receiver_profile_id, message)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (sender_id, receiver_id) DO UPDATE SET updated_at = NOW()
       RETURNING *`,
      [req.user.id, receiverId, senderProfileId, receiver_profile_id, message || null]
    );

    // Check if it's now a mutual match
    const mutualCheck = await pool.query(
      `SELECT id FROM interests WHERE sender_id = $1 AND receiver_id = $2 AND status = 'accepted'`,
      [receiverId, req.user.id]
    );
    const isMatch = mutualCheck.rows.length > 0;

    res.status(201).json({
      message: 'Interest sent successfully.',
      interest: result.rows[0],
      is_match: isMatch
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── RESPOND TO INTEREST (accept / decline) ──
router.post('/interests/:id/respond', async (req, res) => {
  try {
    const { action } = req.body; // 'accepted' or 'declined'
    if (!['accepted', 'declined'].includes(action)) {
      return res.status(400).json({ error: 'action must be "accepted" or "declined".' });
    }

    const result = await pool.query(
      `UPDATE interests SET status = $1, updated_at = NOW()
       WHERE id = $2 AND receiver_id = $3
       RETURNING *`,
      [action, req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Interest not found or you are not the receiver.' });
    }

    res.json({ message: `Interest ${action}.`, interest: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── VIEW RECEIVED INTERESTS ──
router.get('/interests/received', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.id, i.status, i.message, i.created_at,
              mp.id AS profile_id, mp.age, mp.gender, mp.education, mp.profession,
              mp.native_place, mp.profile_photo_url, mp.gotra
       FROM interests i
       JOIN matrimony_profiles mp ON i.sender_profile_id = mp.id
       WHERE i.receiver_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── VIEW SENT INTERESTS ──
router.get('/interests/sent', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.id, i.status, i.message, i.created_at,
              mp.id AS profile_id, mp.age, mp.gender, mp.education, mp.profession,
              mp.native_place, mp.profile_photo_url, mp.gotra
       FROM interests i
       JOIN matrimony_profiles mp ON i.receiver_profile_id = mp.id
       WHERE i.sender_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── VIEW MATCHES (mutual accepted interests) ──
router.get('/interests/matches', async (req, res) => {
  try {
    // A match = I accepted their interest AND they accepted mine
    // OR both sent interest and at least one accepted
    const result = await pool.query(
      `SELECT DISTINCT
         mp.id AS profile_id, mp.age, mp.gender, mp.education, mp.profession,
         mp.native_place, mp.current_location, mp.profile_photo_url, mp.gotra,
         CASE WHEN mp.phone_visible THEN mp.family_contact ELSE NULL END AS family_contact,
         i_them.created_at AS matched_at
       FROM interests i_me
       JOIN interests i_them
         ON i_them.sender_id = i_me.receiver_id AND i_them.receiver_id = i_me.sender_id
       JOIN matrimony_profiles mp ON mp.user_id = i_me.receiver_id
       WHERE i_me.sender_id = $1
         AND i_me.status = 'accepted'
         AND i_them.status = 'accepted'
         AND mp.approval_status = 'approved'
       ORDER BY i_them.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── CHECK INTEREST STATUS with a specific profile ──
// Useful for the profile detail page to show current state
router.get('/interests/status/:profileId', async (req, res) => {
  try {
    const profileId = parseInt(req.params.profileId);

    // Get the user_id of that profile's owner
    const profileOwner = await pool.query(
      `SELECT user_id FROM matrimony_profiles WHERE id = $1`,
      [profileId]
    );
    if (!profileOwner.rows.length) return res.json({ sent: null, received: null });
    const ownerId = profileOwner.rows[0].user_id;

    const [sent, received] = await Promise.all([
      pool.query(`SELECT status FROM interests WHERE sender_id = $1 AND receiver_id = $2`, [req.user.id, ownerId]),
      pool.query(`SELECT id, status FROM interests WHERE sender_id = $1 AND receiver_id = $2`, [ownerId, req.user.id])
    ]);

    res.json({
      sent: sent.rows[0] || null,
      received: received.rows[0] || null,
      is_match: sent.rows[0]?.status === 'accepted' && received.rows[0]?.status === 'accepted'
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
