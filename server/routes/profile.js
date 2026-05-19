// server/routes/profile.js
// ─────────────────────────────────────────────────────────────────────────────
// Profile routes — single row read/update.
// Mounted in server.js at /api/profile
//
// GET  /api/profile   — public   — portfolio components fetch this
// PUT  /api/profile   — protected — admin dashboard updates this
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const verifyToken = require('../middleware/auth')

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/profile — PUBLIC
// Returns the single profile row.
// Portfolio pages (Hero, About, Contact) call this on mount.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profile LIMIT 1')

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error('GET /api/profile error:', err.message)
        res.status(500).json({ error: 'Failed to fetch profile' })
    }
})

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/profile — PROTECTED (requires JWT)
// Replaces all profile fields and updates the updated_at timestamp.
// Admin dashboard ProfileForm calls this on save.
// ─────────────────────────────────────────────────────────────────────────────
router.put('/', verifyToken, async (req, res) => {
    try {
        const {
            full_name,
            role_title,
            hero_subtitle,
            about_text,
            github_url,
            linkedin_url,
            leetcode_url,
            email,
            resume_url,
            profile_image_url,
            location,
            availability_status,
        } = req.body

        // Basic validation — at minimum a name and email should be present
        if (!full_name || !email) {
            return res.status(400).json({ error: 'full_name and email are required' })
        }

        const result = await pool.query(`
      UPDATE profile
      SET
        full_name           = $1,
        role_title          = $2,
        hero_subtitle       = $3,
        about_text          = $4,
        github_url          = $5,
        linkedin_url        = $6,
        leetcode_url        = $7,
        email               = $8,
        resume_url          = $9,
        profile_image_url   = $10,
        location            = $11,
        availability_status = $12,
        updated_at          = NOW()
      WHERE id = (SELECT id FROM profile LIMIT 1)
      RETURNING *
    `, [
            full_name,
            role_title,
            hero_subtitle,
            about_text,
            github_url,
            linkedin_url,
            leetcode_url,
            email,
            resume_url,
            profile_image_url,
            location,
            availability_status,
        ])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error('PUT /api/profile error:', err.message)
        res.status(500).json({ error: 'Failed to update profile' })
    }
})

module.exports = router