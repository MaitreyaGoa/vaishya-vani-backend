// config/db.js
// PostgreSQL connection pool — uses environment variables from .env
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vaishya_vani_connect',
  // Uncomment below if deploying to a host that requires SSL (e.g. Render, Railway, Heroku)
  // ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err);
});

module.exports = pool;
