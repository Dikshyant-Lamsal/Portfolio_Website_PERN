// server/routes/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// Authentication routes.
// Currently: one endpoint only — POST /api/auth/login
//
// Mounted in server.js at /api/auth  (you'll add one line there in a moment)
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
//
// Body:   { username: string, password: string }
// Success 200: { token: "<JWT>" }
// Failure 401: { error: "Invalid credentials" }
//
// The client should store the returned token in localStorage under the key
// "adminToken". The frontend will check for this token before showing the
// Admin dashboard (that's a later step).
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        // ── Basic input guard ────────────────────────────────────────────────────
        // Return early if either field is missing — this also prevents a DB lookup
        // with undefined values.
        if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required' })
        }

        // ── Look up the admin by username ────────────────────────────────────────
        // Only one admin row exists, but we still query by username so the code
        // would naturally extend if you ever needed multiple admins.
        const result = await pool.query(
            'SELECT * FROM admins WHERE username = $1',
            [username]
        )

        const admin = result.rows[0]

        // ── Constant-time check: user not found ──────────────────────────────────
        // Using the SAME error message for "user not found" and "wrong password"
        // prevents an attacker from enumerating valid usernames via different
        // error responses.
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // ── Compare the submitted password against the stored bcrypt hash ─────────
        // bcrypt.compare() is timing-safe — it won't short-circuit on mismatch.
        const passwordMatch = await bcrypt.compare(password, admin.password)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // ── Sign a JWT ────────────────────────────────────────────────────────────
        // Payload: minimal — just the admin's id and username.
        // The token expires in 8 hours. Adjust to taste (e.g. '1d', '2h').
        // JWT_SECRET must be set in server/.env — see instructions below.
        const token = jwt.sign(
            { id: admin.id, username: admin.username },  // payload (public-ish)
            process.env.JWT_SECRET,                       // secret (keep private!)
            { expiresIn: '8h' }
        )

        // ── Return the token ──────────────────────────────────────────────────────
        // The frontend will store this in localStorage and attach it to future
        // requests via an Authorization header (wired up in Step 3).
        res.json({ token })

    } catch (err) {
        console.error('POST /api/auth/login error:', err.message)
        res.status(500).json({ error: 'Login failed' })
    }
})

module.exports = router