// client/src/pages/Login.jsx
// Admin login page — shown at /#/login
// CHANGE: fetch path now uses API_URL from config/api.js

import { useState } from 'react'
import API_URL from '../config/api'
import './Login.css'

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed')
                return
            }

            localStorage.setItem('adminToken', data.token)
            onLoginSuccess()
            window.location.hash = '/admin'

        } catch (err) {
            setError('Could not reach the server. Is it running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-shell">
            <div className="login-card">

                <div className="login-header">
                    <h1 className="login-heading">
                        <span className="login-bracket">&lt;</span>
                        Admin
                        <span className="login-bracket">/&gt;</span>
                    </h1>
                    <p className="login-subheading">Sign in to continue</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="login-field">
                        <label className="login-label" htmlFor="username">Username</label>
                        <input
                            id="username" className="login-input" type="text"
                            autoComplete="username" value={username}
                            onChange={e => setUsername(e.target.value)}
                            disabled={loading} required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label" htmlFor="password">Password</label>
                        <input
                            id="password" className="login-input" type="password"
                            autoComplete="current-password" value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={loading} required
                        />
                    </div>

                    {error && (
                        <p className="login-error" role="alert">{error}</p>
                    )}

                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading
                            ? <><span className="spinner" /> Signing in…</>
                            : 'Sign in'
                        }
                    </button>

                </form>
            </div>
        </div>
    )
}