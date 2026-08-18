// server/config/cloudinary.js
// ─────────────────────────────────────────────────────────────────────────────
// Initialises the Cloudinary SDK with credentials from environment variables.
// Imported by the upload middleware — nowhere else needs to touch this.
//
// Required entries in server/.env:
//   CLOUDINARY_CLOUD_NAME=your_cloud_name
//   CLOUDINARY_API_KEY=your_api_key
//   CLOUDINARY_API_SECRET=your_api_secret
//
// Find these in your Cloudinary dashboard → Settings → API Keys.
// ─────────────────────────────────────────────────────────────────────────────

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary