// migrations/run-migrations.js
// Runs all .sql files in /migrations in order against the configured database
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigrations() {
  const dir = __dirname;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`✅ ${file} applied successfully`);
    } catch (err) {
      console.error(`❌ Failed on ${file}:`, err.message);
      process.exit(1);
    }
  }

  console.log('All migrations applied.');
  process.exit(0);
}

runMigrations();
