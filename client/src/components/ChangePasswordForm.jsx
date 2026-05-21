// client/src/components/ChangePasswordForm.jsx
// Renders a password-change form in the admin dashboard.
// Calls PUT /api/auth/change-password (JWT protected).

import { useState } from 'react'
import API_URL from '../config/api'
import './ChangePasswordForm.css'

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function ChangePasswordForm() {
    const [form, setForm] = useState(EMPTY)
    const [status, setStatus] = useState('idle')  // idle | saving | saved | error
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (status !== 'idle') { setStatus('idle'); setError('') }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // ── Client-side validation ────────────────────────────────────────
        if (form.newPassword.length < 8) {
            setError('New password must be at least 8 characters.')
            return
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('New password and confirmation do not match.')
            return
        }

        setStatus('saving')
        const token = localStorage.getItem('adminToken')

        try {
            const res = await fetch(`${API_URL}/api/auth/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Failed to change password.')
                setStatus('error')
                return
            }

            setStatus('saved')
            setForm(EMPTY)   // clear all fields on success
        } catch {
            setError('Could not reach the server.')
            setStatus('error')
        }
    }

    const saving = status === 'saving'

    return (
        <div className="cpf-wrap">
            <div className="cpf-header">
                <h2 className="cpf-title">Change Password</h2>
                <span className="cpf-hint">Your current login password is required</span>
            </div>

            <form className="cpf-form" onSubmit={handleSubmit} autoComplete="off">

                <div className="cpf-field">
                    <label className="cpf-label" htmlFor="cpf-current">Current Password</label>
                    <input
                        id="cpf-current"
                        className="cpf-input"
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        disabled={saving}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <div className="cpf-row">
                    <div className="cpf-field">
                        <label className="cpf-label" htmlFor="cpf-new">New Password</label>
                        <input
                            id="cpf-new"
                            className="cpf-input"
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            disabled={saving}
                            autoComplete="new-password"
                            placeholder="Minimum 8 characters"
                            required
                        />
                    </div>
                    <div className="cpf-field">
                        <label className="cpf-label" htmlFor="cpf-confirm">Confirm New Password</label>
                        <input
                            id="cpf-confirm"
                            className="cpf-input"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            disabled={saving}
                            autoComplete="new-password"
                            placeholder="Repeat new password"
                            required
                        />
                    </div>
                </div>

                {status === 'error' && error && (
                    <div className="cpf-error" role="alert">✗ {error}</div>
                )}

                {status === 'saved' && (
                    <div className="cpf-success" role="status">✓ Password changed successfully.</div>
                )}

                <div className="cpf-actions">
                    <button type="submit" className="cpf-btn cpf-btn--save" disabled={saving}>
                        {saving
                            ? <><span className="spinner" aria-hidden="true" /> Changing…</>
                            : 'Change Password'
                        }
                    </button>
                </div>

            </form>
        </div>
    )
}