// server/scripts/resetAdminPassword.js
// ─────────────────────────────────────────────────────────────────────────────
// Emergency script — run this if you forget the admin password.
// Sets the admin password directly in the database via bcrypt.
//
// Usage:
//   cd server
//   node scripts/resetAdminPassword.js
//
// Then log in at /#/login with the new password you set below.
// CHANGE THE PASSWORD BEFORE RUNNING — do not leave it as the default.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config()
const bcrypt = require('bcrypt')
const pool = require('../config/db')

// ── SET YOUR NEW PASSWORD HERE ────────────────────────────────────────────
const NEW_PASSWORD = process.env.ADMIN_PASSWORD   // ← change this before running
const USERNAME = 'admin'          // ← your admin username
// ─────────────────────────────────────────────────────────────────────────

async function resetPassword() {
    if (NEW_PASSWORD === 'ChangeMe123!') {
        console.error('❌ Please change NEW_PASSWORD in the script before running.')
        process.exit(1)
    }

    if (NEW_PASSWORD.length < 8) {
        console.error('❌ Password must be at least 8 characters.')
        process.exit(1)
    }

    try {
        const hash = await bcrypt.hash(NEW_PASSWORD, 12)
        const result = await pool.query(
            'UPDATE admins SET password = $1 WHERE username = $2 RETURNING id, username',
            [hash, USERNAME]
        )

        if (result.rows.length === 0) {
            console.error(`❌ No admin found with username "${USERNAME}".`)
            console.log('Run: SELECT username FROM admins; in Neon to check existing usernames.')
        } else {
            console.log(`✅ Password reset for admin: ${result.rows[0].username}`)
            console.log('   Log in at /#/login with your new password.')
        }
    } catch (err) {
        console.error('❌ Reset error:', err.message)
    } finally {
        await pool.end()
    }
}

resetPassword()