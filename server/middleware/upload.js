// server/middleware/upload.js
// ─────────────────────────────────────────────────────────────────────────────
// Multer middleware configured to stream uploads directly to Cloudinary.
// No files are ever written to the local filesystem.
//
// multer-storage-cloudinary connects multer and the Cloudinary SDK so the
// file goes:  browser → Express (memory) → Cloudinary  in one step.
// ─────────────────────────────────────────────────────────────────────────────

const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// ── Configure Cloudinary as the multer storage engine ────────────────────────
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        // All project images land in this folder inside your Cloudinary account
        folder: 'portfolio/projects',

        // Allow jpg, png, webp, gif — Cloudinary will reject anything else
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],

        // Cloudinary will auto-generate a unique public_id, so filenames
        // won't collide even if two admins upload "screenshot.png" at the same time.
        // The transformation here is optional — it constrains images to a sensible
        // max width so you're not storing 8000px originals.
        transformation: [{ width: 1200, crop: 'limit' }],
    },
})

// ── Build the multer instance ─────────────────────────────────────────────────
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5 MB max — reject larger files early
    },
    fileFilter: (_req, file, cb) => {
        // Double-check MIME type on the server side (browser can lie about extension)
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (allowed.includes(file.mimetype)) {
            cb(null, true)   // accept
        } else {
            cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false)
        }
    },
})

module.exports = upload