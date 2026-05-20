// server/routes/contact.js
// Handles contact form submissions and admin message management.
// Mounted in server.js at /api/contact
//
// POST   /api/contact       — public  — submit contact form
// GET    /api/contact       — protected — admin fetches all messages
// DELETE /api/contact/:id   — protected — admin deletes a message

const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const verifyToken = require('../middleware/auth')

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact — PUBLIC
// Validates and inserts a new contact message.
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

        const result = await pool.query(
            `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
            [name.trim(), email.trim().toLowerCase(), message.trim()]
        )

        res.status(201).json({
            message: 'Message received! I will get back to you soon.',
            contact: result.rows[0],
        })
    } catch (err) {
        console.error('POST /api/contact error:', err.message)
        res.status(500).json({ error: 'Failed to send message. Please try again.' })
    }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact — PROTECTED
// Returns all contact messages, newest first.
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
// Permanently removes a contact message by id.
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