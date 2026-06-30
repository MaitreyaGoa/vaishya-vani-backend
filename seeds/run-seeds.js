// seeds/run-seeds.js
// Runs all .sql files in /seeds in order against the configured database
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runSeeds() {
  const dir = __dirname;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    console.log(`Running seed: ${file}`);
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`✅ ${file} applied successfully`);
    } catch (err) {
      console.error(`❌ Failed on ${file}:`, err.message);
      process.exit(1);
    }
  }

  console.log('All seeds applied.');
  process.exit(0);
}

runSeeds();
