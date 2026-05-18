// server/routes/contact.js
// Handles contact form submissions.
// Mounted in server.js at /api/contact

const express = require('express')
const router = express.Router()
const pool = require('../config/db')

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact
// Validates the request body, then inserts a row into the contacts table.
// Body: { name, email, message }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body

        // ── Field presence validation ──
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'All fields are required: name, email, message',
            })
        }

        // ── Basic length guards ──
        if (name.trim().length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' })
        }

        if (message.trim().length < 10) {
            return res.status(400).json({ error: 'Message must be at least 10 characters' })
        }

        // ── Simple email format check ──
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' })
        }

        // ── Insert into PostgreSQL ──
        // $1, $2, $3 are parameterised placeholders — safe from SQL injection
        const result = await pool.query(
            `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
            [name.trim(), email.trim().toLowerCase(), message.trim()]
        )

        // Return 201 Created with the new row (minus the message for brevity)
        res.status(201).json({
            message: 'Message received! I will get back to you soon.',
            contact: result.rows[0],
        })

    } catch (err) {
        console.error('POST /api/contact error:', err.message)
        res.status(500).json({ error: 'Failed to send message. Please try again.' })
    }
})

module.exports = router