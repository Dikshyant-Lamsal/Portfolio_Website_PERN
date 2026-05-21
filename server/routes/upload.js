// server/routes/upload.js
// CHANGE: destructure { upload, resumeUpload } from updated middleware.
//         Added POST /api/upload/resume for PDF resume uploads.
//         Original POST /api/upload (images) is unchanged.

const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const { upload, resumeUpload } = require('../middleware/upload')

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload
// Image upload for project cards — unchanged.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
    '/',
    verifyToken,
    upload.single('image'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'No file received' })
        res.json({ imageUrl: req.file.path })
    }
)

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload/resume
// PDF resume upload — returns { resumeUrl } to be saved in profile.resume_url.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
    '/resume',
    verifyToken,
    resumeUpload.single('resume'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'No file received' })
        res.json({ resumeUrl: req.file.path })
    }
)

// ── Error handler (covers both routes) ───────────────────────────────────────
router.use((err, _req, res, _next) => {
    console.error('Upload error:', err.message)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10 MB.' })
    }
    res.status(400).json({ error: err.message || 'Upload failed' })
})

module.exports = router