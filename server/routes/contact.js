// server/routes/contact.js
// CHANGE: POST handler now calls sendContactNotification after DB insert.
// If email fails, the insert still succeeds and 201 is still returned.

const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const verifyToken = require('../middleware/auth')
const { sendContactNotification } = require('../utils/sendMail')  // ── NEW ──

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact — PUBLIC
// Validates, inserts, then fires email notification (non-blocking).
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required: name, email, message' })
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' })
        }
        if (message.trim().length < 10) {
            return res.status(400).json({ error: 'Message must be at least 10 characters' })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' })
        }

        // ── Insert into PostgreSQL ────────────────────────────────────────
        const result = await pool.query(
            `INSERT INTO contacts (name, email, message)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, message, created_at`,
            [name.trim(), email.trim().toLowerCase(), message.trim()]
        )

        const contact = result.rows[0]

        // ── Fire email notification — intentionally not awaited inline ──
        // sendContactNotification swallows its own errors, so this is safe.
        sendContactNotification(contact)

        // ── Respond immediately — don't wait for email ────────────────────
        res.status(201).json({
            message: 'Message received! I will get back to you soon.',
            contact: {
                id: contact.id,
                name: contact.name,
                email: contact.email,
                created_at: contact.created_at,
            },
        })
    } catch (err) {
        console.error('POST /api/contact error:', err.message)
        res.status(500).json({ error: 'Failed to send message. Please try again.' })
    }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact — PROTECTED
// Returns all messages newest-first.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC'
        )
        res.json(result.rows)
    } catch (err) {
        console.error('GET /api/contact error:', err.message)
        res.status(500).json({ error: 'Failed to fetch messages' })
    }
})

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/contact/:id — PROTECTED
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            'DELETE FROM contacts WHERE id = $1 RETURNING id',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' })
        }
        res.json({ message: `Contact message ${id} deleted` })
    } catch (err) {
        console.error('DELETE /api/contact/:id error:', err.message)
        res.status(500).json({ error: 'Failed to delete message' })
    }
})

module.exports = router