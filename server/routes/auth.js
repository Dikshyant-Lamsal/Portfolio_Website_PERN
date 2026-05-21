// server/routes/auth.js
// CHANGE: added PUT /api/auth/change-password (JWT protected).
// POST /api/auth/login is unchanged.

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const verifyToken = require('../middleware/auth')

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login — unchanged
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password)
            return res.status(400).json({ error: 'username and password are required' })

        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username])
        const admin = result.rows[0]
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

        const passwordMatch = await bcrypt.compare(password, admin.password)
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' })

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({ token })
    } catch (err) {
        console.error('POST /api/auth/login error:', err.message)
        res.status(500).json({ error: 'Login failed' })
    }
})

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/change-password — PROTECTED
//
// Body: { currentPassword, newPassword, confirmPassword }
// Validates current password, then replaces with bcrypt hash of new password.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body

        // ── Input validation ──────────────────────────────────────────────
        if (!currentPassword || !newPassword || !confirmPassword)
            return res.status(400).json({ error: 'All three password fields are required' })

        if (newPassword.length < 8)
            return res.status(400).json({ error: 'New password must be at least 8 characters' })

        if (newPassword !== confirmPassword)
            return res.status(400).json({ error: 'New password and confirmation do not match' })

        // ── Fetch admin row ───────────────────────────────────────────────
        // req.admin.id is set by verifyToken after decoding the JWT
        const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.admin.id])
        const admin = result.rows[0]
        if (!admin) return res.status(404).json({ error: 'Admin not found' })

        // ── Verify current password ───────────────────────────────────────
        const currentMatch = await bcrypt.compare(currentPassword, admin.password)
        if (!currentMatch)
            return res.status(401).json({ error: 'Current password is incorrect' })

        // ── Hash and save new password ────────────────────────────────────
        const newHash = await bcrypt.hash(newPassword, 12)
        await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [newHash, admin.id])

        res.json({ message: 'Password changed successfully' })
    } catch (err) {
        console.error('PUT /api/auth/change-password error:', err.message)
        res.status(500).json({ error: 'Failed to change password' })
    }
})

module.exports = router