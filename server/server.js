// server/server.js
// Main Express server — loads env vars, wires up middleware, mounts routes.

// ── Load environment variables first (before anything else reads process.env)
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db') // establishes DB connection on import

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────

// Allow cross-origin requests from the Vite dev server (localhost:5173)
// and your production Vercel domain. Update CORS_ORIGIN in .env for production.
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}))

// Parse incoming JSON request bodies (makes req.body available)
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────

// Health-check / smoke-test route
// GET /api/test → { message: "Backend running" }
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running' })
})

// Projects CRUD routes — all paths under /api/projects
const projectsRouter = require('./routes/projects')
app.use('/api/projects', projectsRouter)

// Contact form route — POST /api/contact
const contactRouter = require('./routes/contact')
app.use('/api/contact', contactRouter)

const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)

const profileRouter = require('./routes/profile')
app.use('/api/profile', profileRouter)

const uploadRouter = require('./routes/upload')    // ← ADD
app.use('/api/upload', uploadRouter)
// ── 404 catch-all ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Start server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})