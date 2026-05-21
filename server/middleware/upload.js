// server/middleware/upload.js
// FIX: added type: 'upload' and access_mode: 'public' to resumeStorage
// so Cloudinary serves the PDF publicly without requiring authentication.

const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// ── Image upload — unchanged ──────────────────────────────────────────────
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'portfolio/projects',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1200, crop: 'limit' }],
    },
})

const upload = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false)
    },
})

// ── PDF resume upload ─────────────────────────────────────────────────────
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
        const originalName = file.originalname
            .replace(/\.pdf$/i, '')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .toLowerCase()

        return {
            folder: 'portfolio/resumes',
            resource_type: 'raw',
            type: 'upload',        // ← ensures public upload (not authenticated)
            access_mode: 'public',        // ← explicitly marks asset as publicly accessible
            format: 'pdf',
            public_id: `${originalName}_${Date.now()}`,
        }
    },
})

const resumeUpload = multer({
    storage: resumeStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        file.mimetype === 'application/pdf'
            ? cb(null, true)
            : cb(new Error('Only PDF files are allowed for resume upload'), false)
    },
})

module.exports = { upload, resumeUpload }