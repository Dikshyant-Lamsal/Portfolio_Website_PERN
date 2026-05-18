// client/src/pages/Login.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin login page — shown at /#/login (and when /#/admin is visited without
// a valid token). On successful login the JWT is stored in localStorage and
// the user is redirected to /#/admin.
//
// Props:
//   onLoginSuccess — called by App.jsx after token is saved; triggers re-render
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import './Login.css'

export default function Login({ onLoginSuccess }) {
    // ── Form field state ───────────────────────────────────────────────────
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // ── UI feedback state ──────────────────────────────────────────────────
    const [error, setError] = useState('')    // error message to display
    const [loading, setLoading] = useState(false) // disables button during fetch

    // ── Submit handler ─────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()       // prevent browser page reload
        setError('')             // clear any previous error
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                // Server returned 400 or 401 — show the error message
                setError(data.error || 'Login failed')
                return
            }

            // ── Success path ───────────────────────────────────────────────────
            // 1. Persist the JWT so it survives page refreshes
            localStorage.setItem('adminToken', data.token)

            // 2. Tell App.jsx the token is ready — it will re-render and show Admin
            onLoginSuccess()

            // 3. Switch the URL hash so the back-button works correctly
            window.location.hash = '/admin'

        } catch (err) {
            // Network error — server unreachable
            setError('Could not reach the server. Is it running?')
        } finally {
            setLoading(false)
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="login-shell">
            <div className="login-card">

                {/* ── Header ── */}
                <div className="login-header">
                    <h1 className="login-heading">
                        <span className="login-bracket">&lt;</span>
                        Admin
                        <span className="login-bracket">/&gt;</span>
                    </h1>
                    <p className="login-subheading">Sign in to continue</p>
                </div>

                {/* ── Form ── */}
                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="login-field">
                        <label className="login-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            className="login-input"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            className="login-input"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* ── Error message ── */}
                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    {/* ── Submit ── */}
                    <button
                        className="login-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            // Inline spinner reuses the global .spinner class from index.css
                            <><span className="spinner" /> Signing in…</>
                        ) : (
                            'Sign in'
                        )}
                    </button>

                </form>
            </div>
        </div>
    )
}