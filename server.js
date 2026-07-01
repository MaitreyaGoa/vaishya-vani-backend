// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', message: 'Vaishya Vani Connect API is running, DB connected.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Location hierarchy routes (Phase 0 deliverable)
app.get('/api/states', async (req, res) => {
  const result = await pool.query('SELECT * FROM states ORDER BY name');
  res.json(result.rows);
});

app.get('/api/districts/:stateId', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM districts WHERE state_id = $1 ORDER BY name',
    [req.params.stateId]
  );
  res.json(result.rows);
});

app.get('/api/talukas/:districtId', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM talukas WHERE district_id = $1 ORDER BY name',
    [req.params.districtId]
  );
  res.json(result.rows);
});

// Admin routes — manage states/districts/talukas (Master Admin corrections)
const adminLocationsRouter = require('./routes/adminLocations');
app.use('/api/admin', adminLocationsRouter);

// Registration route — base profile + conditional Business/Matrimony branches
const registerRouter = require('./routes/register');
app.use('/api/register', registerRouter);

// Public listings — Events/News/Jobs/Education/Temples/Directory + Business + Matrimony
const listingsRouter = require('./routes/listings');
app.use('/api', listingsRouter);

// Admin authentication (login + one-time setup)
const adminAuthRouter = require('./routes/adminAuth');
app.use('/api/admin', adminAuthRouter);

// Admin approval queue (protected — requires admin login)
const adminApprovalsRouter = require('./routes/adminApprovals');
app.use('/api/admin', adminApprovalsRouter);

// Admin content management (add/edit/delete listings, businesses, matrimony, users)
const adminContentRouter = require('./routes/adminContent');
app.use('/api/admin', adminContentRouter);

// Admin taluka management + registration stats
const adminTalukaStatsRouter = require('./routes/adminTalukaStats');
app.use('/api/admin', adminTalukaStatsRouter);

// Business Hub public routes
const businessRouter = require('./routes/business');
app.use('/api', businessRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
