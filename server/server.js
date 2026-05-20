// server/server.js
// Main Express server — loads env vars, wires up middleware, mounts routes.

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

// ── CORS ──────────────────────────────────────────────────────────────────
// Explicitly allow the local Vite dev server and the production Vercel domain.
// credentials: true is required if you ever send cookies (not used yet, but
// safe to include for future-proofing).
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://portfolio-website-pern.vercel.app',
  ],
  credentials: true,
}))

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running' })
})

const projectsRouter = require('./routes/projects')
app.use('/api/projects', projectsRouter)

const contactRouter = require('./routes/contact')
app.use('/api/contact', contactRouter)

const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)

const profileRouter = require('./routes/profile')
app.use('/api/profile', profileRouter)

const uploadRouter = require('./routes/upload')
app.use('/api/upload', uploadRouter)

app.get('/api/debug-env', (req, res) => {
  res.json({
    EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'MISSING',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
  })
})

// ── 404 catch-all ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Start server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})