// server/routes/upload.js
// ─────────────────────────────────────────────────────────────────────────────
// Image upload route.
// Mounted in server.js at /api/upload
//
// POST /api/upload
//   • JWT protected (verifyToken runs first)
//   • Accepts multipart/form-data with a single field named "image"
//   • Streams the file to Cloudinary via multer-storage-cloudinary
//   • Returns { imageUrl: "https://res.cloudinary.com/..." }
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const upload = require('../middleware/upload')

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload
//
// Middleware chain:
//   verifyToken       — rejects unauthenticated requests with 401
//   upload.single()   — multer parses the file and uploads it to Cloudinary
//   route handler     — returns the Cloudinary URL
//
// The field name "image" must match the FormData key the frontend sends.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
    '/',
    verifyToken,                  // 1. check JWT
    upload.single('image'),       // 2. parse + upload to Cloudinary
    (req, res) => {
        // If we reach here, multer succeeded and req.file is populated.
        // req.file.path is the Cloudinary secure URL set by multer-storage-cloudinary.
        if (!req.file) {
            return res.status(400).json({ error: 'No file received' })
        }

        res.json({ imageUrl: req.file.path })
    }
)

// ── Multer / Cloudinary error handler ────────────────────────────────────────
// Multer throws synchronously for file-filter rejections and size limit errors.
// This 4-argument Express error handler catches them and returns clean JSON
// instead of a 500 HTML page.
router.use((err, _req, res, _next) => {
    console.error('Upload error:', err.message)

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5 MB.' })
    }

    // Covers fileFilter rejections and Cloudinary SDK errors
    res.status(400).json({ error: err.message || 'Upload failed' })
})

module.exports = router