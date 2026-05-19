// client/src/config/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the backend API base URL.
//
// Development:  VITE_API_URL is not set → falls back to empty string ''
//               so fetch(`${API_URL}/api/profile`) becomes fetch('/api/profile')
//               which Vite proxies to http://localhost:5000 as before.
//
// Production:   Set VITE_API_URL in Vercel environment variables:
//               VITE_API_URL=https://your-backend.onrender.com
//               so fetch(`${API_URL}/api/profile`) becomes the full Render URL.
//
// Usage in any file:
//   import API_URL from '../config/api'
//   fetch(`${API_URL}/api/profile`)
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || ''

export default API_URL