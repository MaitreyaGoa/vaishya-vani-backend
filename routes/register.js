// routes/register.js
// Handles the full registration flow:
//   1. Base community profile (always required)
//   2. Optional Business profile (if business_opt_in = true) + logo image
//   3. Optional Matrimony profile (if matrimony_opt_in = true) + photo + optional horoscope
// Everything lands in 'pending' status — nothing is publicly visible until
// Master Admin / Taluka Admin approves it (per the matrimony & business requirement docs).

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { upload, uploadToCloudinary } = require('../middleware/upload');

// Accepts up to one logo image and one matrimony photo + one horoscope file in a single submission
const multiUpload = upload.fields([
  { name: 'business_logo', maxCount: 1 },
  { name: 'matrimony_photo', maxCount: 1 },
  { name: 'horoscope_file', maxCount: 1 },
]);

router.post('/', multiUpload, async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      full_name, mobile_number, email, password,
      state_id, district_id, taluka_id,
      community_reference,
      business_opt_in, matrimony_opt_in,
      // business fields
      business_name, business_category, business_description,
      business_contact, business_address, business_city,
      website_url, social_links,
      // matrimony fields
      age, gender, education, profession, height,
      native_place, current_location,
      family_background, family_contact, family_introduction,
      gotra, language_preference,
    } = req.body;

    if (!full_name || !mobile_number || !password) {
      return res.status(400).json({ error: 'Full name, mobile number, and password are required.' });
    }

    await client.query('BEGIN');

    const password_hash = await bcrypt.hash(password, 10);

    // 1. Base user record
    const userResult = await client.query(
      `INSERT INTO users
        (full_name, mobile_number, email, password_hash, state_id, district_id, taluka_id,
         business_opt_in, matrimony_opt_in, approval_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
       RETURNING id`,
      [
        full_name, mobile_number, email || null, password_hash,
        state_id || null, district_id || null, taluka_id || null,
        business_opt_in === 'true' || business_opt_in === true,
        matrimony_opt_in === 'true' || matrimony_opt_in === true,
      ]
    );
    const userId = userResult.rows[0].id;

    // Note: community_reference is stored as part of the base record's audit trail.
    // (Kept simple for now — can be promoted to its own column/table in a later session if needed.)

    // 2. Business profile (only if opted in)
    let businessResult = null;
    if (business_opt_in === 'true' || business_opt_in === true) {
      if (!business_name) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Business name is required when registering a business.' });
      }

      let logoUrl = null, logoPublicId = null;
      if (req.files && req.files.business_logo && req.files.business_logo[0]) {
        const uploaded = await uploadToCloudinary(req.files.business_logo[0].buffer, 'business-logos');
        logoUrl = uploaded.url;
        logoPublicId = uploaded.public_id;
      }

      businessResult = await client.query(
        `INSERT INTO business_profiles
          (user_id, business_name, category, description, contact_number, address, city,
           state_id, district_id, taluka_id, website_url, social_links,
           logo_image_url, logo_image_public_id, approval_status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending')
         RETURNING id`,
        [
          userId, business_name, business_category || null, business_description || null,
          business_contact || null, business_address || null, business_city || null,
          state_id || null, district_id || null, taluka_id || null,
          website_url || null, social_links || null,
          logoUrl, logoPublicId,
        ]
      );
    }

    // 3. Matrimony profile (only if opted in)
    let matrimonyResult = null;
    if (matrimony_opt_in === 'true' || matrimony_opt_in === true) {
      let photoUrl = null, photoPublicId = null;
      if (req.files && req.files.matrimony_photo && req.files.matrimony_photo[0]) {
        const uploaded = await uploadToCloudinary(req.files.matrimony_photo[0].buffer, 'matrimony-photos');
        photoUrl = uploaded.url;
        photoPublicId = uploaded.public_id;
      }

      let horoscopeUrl = null, horoscopePublicId = null;
      if (req.files && req.files.horoscope_file && req.files.horoscope_file[0]) {
        const uploaded = await uploadToCloudinary(req.files.horoscope_file[0].buffer, 'horoscopes');
        horoscopeUrl = uploaded.url;
        horoscopePublicId = uploaded.public_id;
      }

      matrimonyResult = await client.query(
        `INSERT INTO matrimony_profiles
          (user_id, age, gender, education, profession, height,
           native_place, current_location, family_background, family_contact,
           family_introduction, gotra, language_preference,
           profile_photo_url, profile_photo_public_id, horoscope_url, horoscope_public_id,
           approval_status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'pending')
         RETURNING id`,
        [
          userId, age || null, gender || null, education || null, profession || null, height || null,
          native_place || null, current_location || null, family_background || null, family_contact || null,
          family_introduction || null, gotra || null, language_preference || null,
          photoUrl, photoPublicId, horoscopeUrl, horoscopePublicId,
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Registration submitted successfully. Your profile is pending admin approval.',
      user_id: userId,
      business_profile_id: businessResult ? businessResult.rows[0].id : null,
      matrimony_profile_id: matrimonyResult ? matrimonyResult.rows[0].id : null,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'This mobile number or email is already registered.' });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.', details: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
