// server/scripts/seedAdmin.js
// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME SETUP SCRIPT — run this once to:
//   1. Create the `admins` table in your PostgreSQL database
//   2. Insert a single admin user with a bcrypt-hashed password
//
// Usage (from the server/ directory):
//   node scripts/seedAdmin.js
//
// After it succeeds you will NOT need to run it again.
// The plaintext password is never stored — only the bcrypt hash is saved.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config()            // reads server/.env for DATABASE_URL
const bcrypt = require('bcrypt')
const pool = require('../config/db')

// ── Configuration ─────────────────────────────────────────────────────────────
// Change these before running the script the first time.
// After the hash is stored you can delete/forget the plaintext password here.
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'changeme123'   // ← replace with something strong
const SALT_ROUNDS = 12              // bcrypt work factor (10–14 is typical)

async function seed() {
    try {
        // ── Step 1: Create the admins table if it doesn't exist ──────────────────
        // Only one row will ever live here, but using a proper table keeps things
        // consistent with the rest of the database-driven project.
        await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id         SERIAL PRIMARY KEY,
        username   VARCHAR(50) UNIQUE NOT NULL,
        password   TEXT        NOT NULL,   -- bcrypt hash, never plaintext
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
        console.log('✅ admins table ready')

        // ── Step 2: Check if the admin user already exists ────────────────────────
        // Prevents accidental duplicate inserts if the script is re-run.
        const existing = await pool.query(
            'SELECT id FROM admins WHERE username = $1',
            [ADMIN_USERNAME]
        )

        if (existing.rows.length > 0) {
            console.log(`ℹ️  Admin user "${ADMIN_USERNAME}" already exists — skipping insert.`)
            process.exit(0)
        }

        // ── Step 3: Hash the password with bcrypt ─────────────────────────────────
        // bcrypt.hash() automatically generates and embeds a random salt.
        // The resulting string looks like: $2b$12$<22-char-salt><31-char-hash>
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS)
        console.log('✅ Password hashed')

        // ── Step 4: Insert the admin row ──────────────────────────────────────────
        await pool.query(
            'INSERT INTO admins (username, password) VALUES ($1, $2)',
            [ADMIN_USERNAME, hashedPassword]
        )
        console.log(`✅ Admin user "${ADMIN_USERNAME}" created successfully`)
        console.log('   You can now delete the plaintext password from this script.')

    } catch (err) {
        console.error('❌ Seed failed:', err.message)
        process.exit(1)
    } finally {
        // Always close the pool so the Node process exits cleanly
        await pool.end()
    }
}

seed()