// server/middleware/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// JWT authentication middleware.
//
// Usage — add to any route you want to protect:
//   const verifyToken = require('../middleware/auth')
//   router.post('/',     verifyToken, handler)
//   router.put('/:id',   verifyToken, handler)
//   router.delete('/:id',verifyToken, handler)
//
// What it does:
//   1. Reads the Authorization header: "Bearer <token>"
//   2. Verifies the token signature using JWT_SECRET from .env
//   3. If valid   → attaches decoded payload to req.admin, calls next()
//   4. If invalid → responds immediately with 401 JSON, route never runs
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    // ── Step 1: Read the Authorization header ─────────────────────────────────
    // Expected format: "Bearer eyJhbGci..."
    // If the header is missing entirely, authHeader will be undefined.
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // ── Step 2: Extract the token from "Bearer <token>" ───────────────────────
    // .split(' ') → ["Bearer", "eyJhbGci..."]
    // [1]         → "eyJhbGci..."
    const token = authHeader.split(' ')[1]

    if (!token) {
        // Header was present but malformed (e.g. just "Bearer" with nothing after)
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // ── Step 3: Verify the token ──────────────────────────────────────────────
    // jwt.verify() checks:
    //   • Signature matches JWT_SECRET  (token wasn't tampered with)
    //   • Token hasn't expired          (we set 8h in auth.js)
    // If either check fails it throws an error, caught below.
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach the decoded payload (id, username) to the request object.
        // Route handlers can read req.admin if they ever need to know who called.
        req.admin = decoded

        // ── Step 4: Hand off to the actual route handler ──────────────────────
        next()

    } catch (err) {
        // Covers: JsonWebTokenError (bad signature), TokenExpiredError, etc.
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

module.exports = verifyToken