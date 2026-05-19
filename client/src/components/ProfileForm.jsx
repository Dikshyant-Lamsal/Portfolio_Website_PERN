// client/src/components/ProfileForm.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin dashboard section — fetches the profile on mount, lets the admin
// edit all fields, and saves via PUT /api/profile.
//
// This is a self-contained panel: it owns its own fetch + submit logic.
// It does NOT need props from Admin.jsx except nothing — it's standalone.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import './ProfileForm.css'

const EMPTY = {
    full_name: '',
    role_title: '',
    hero_subtitle: '',
    about_text: '',
    github_url: '',
    linkedin_url: '',
    leetcode_url: '',
    email: '',
    resume_url: '',
    profile_image_url: '',
    location: '',
    availability_status: '',
}

export default function ProfileForm() {
    const [form, setForm] = useState(EMPTY)
    const [fetchStatus, setFetchStatus] = useState('loading') // loading | ready | error
    const [saveStatus, setSaveStatus] = useState('idle')    // idle | saving | saved | error
    const [saveError, setSaveError] = useState('')

    // ── Fetch current profile on mount ───────────────────────────────────────
    useEffect(() => {
        fetch('/api/profile')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => {
                // Fill every field — replace null/undefined with empty string
                setForm({
                    full_name: data.full_name || '',
                    role_title: data.role_title || '',
                    hero_subtitle: data.hero_subtitle || '',
                    about_text: data.about_text || '',
                    github_url: data.github_url || '',
                    linkedin_url: data.linkedin_url || '',
                    leetcode_url: data.leetcode_url || '',
                    email: data.email || '',
                    resume_url: data.resume_url || '',
                    profile_image_url: data.profile_image_url || '',
                    location: data.location || '',
                    availability_status: data.availability_status || '',
                })
                setFetchStatus('ready')
            })
            .catch(() => setFetchStatus('error'))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        // Clear saved banner when the admin starts typing again
        if (saveStatus === 'saved') setSaveStatus('idle')
    }

    // ── Save handler ─────────────────────────────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault()
        setSaveStatus('saving')
        setSaveError('')

        const token = localStorage.getItem('adminToken')

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })

            const text = await res.text()
            const data = text ? JSON.parse(text) : {}

            if (!res.ok) {
                setSaveError(data.error || 'Failed to save profile.')
                setSaveStatus('error')
                return
            }

            setSaveStatus('saved')
        } catch {
            setSaveError('Could not reach the server.')
            setSaveStatus('error')
        }
    }

    // ── Loading / error states ────────────────────────────────────────────────
    if (fetchStatus === 'loading') {
        return (
            <div className="prf-loading">
                <span className="spinner" /> Loading profile…
            </div>
        )
    }

    if (fetchStatus === 'error') {
        return (
            <div className="prf-fetch-error">
                ✗ Could not load profile data. Is the server running?
            </div>
        )
    }

    const saving = saveStatus === 'saving'

    return (
        <div className="prf-wrap">

            {/* ── Section header ── */}
            <div className="prf-header">
                <h2 className="prf-title">Profile Settings</h2>
                <span className="prf-hint">
                    Changes here update your live portfolio instantly
                </span>
            </div>

            <form className="prf-form" onSubmit={handleSave}>

                {/* ── Row 1: Name + Role ── */}
                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-full_name">Full Name *</label>
                        <input
                            id="prf-full_name" className="prf-input"
                            name="full_name" value={form.full_name}
                            onChange={handleChange} disabled={saving}
                            placeholder="Dikshyant Lamsal" required
                        />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-role_title">Role Title</label>
                        <input
                            id="prf-role_title" className="prf-input"
                            name="role_title" value={form.role_title}
                            onChange={handleChange} disabled={saving}
                            placeholder="Full-Stack Developer"
                        />
                    </div>
                </div>

                {/* ── Hero subtitle ── */}
                <div className="prf-field">
                    <label className="prf-label" htmlFor="prf-hero_subtitle">Hero Subtitle</label>
                    <textarea
                        id="prf-hero_subtitle" className="prf-input prf-textarea prf-textarea--sm"
                        name="hero_subtitle" value={form.hero_subtitle}
                        onChange={handleChange} disabled={saving} rows={3}
                        placeholder="Short bio shown below your name on the hero section"
                    />
                </div>

                {/* ── About text ── */}
                <div className="prf-field">
                    <label className="prf-label" htmlFor="prf-about_text">
                        About Text
                        <span className="prf-label-hint"> — separate paragraphs with a blank line</span>
                    </label>
                    <textarea
                        id="prf-about_text" className="prf-input prf-textarea"
                        name="about_text" value={form.about_text}
                        onChange={handleChange} disabled={saving} rows={8}
                        placeholder={"Hi, I'm Jane — a developer based in...\n\nMy focus is..."}
                    />
                </div>

                {/* ── Row 2: Email + Location ── */}
                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-email">Email *</label>
                        <input
                            id="prf-email" className="prf-input"
                            name="email" type="email" value={form.email}
                            onChange={handleChange} disabled={saving}
                            placeholder="you@example.com" required
                        />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-location">Location</label>
                        <input
                            id="prf-location" className="prf-input"
                            name="location" value={form.location}
                            onChange={handleChange} disabled={saving}
                            placeholder="India"
                        />
                    </div>
                </div>

                {/* ── Availability ── */}
                <div className="prf-field prf-field--half">
                    <label className="prf-label" htmlFor="prf-availability_status">
                        Availability Status
                    </label>
                    <input
                        id="prf-availability_status" className="prf-input"
                        name="availability_status" value={form.availability_status}
                        onChange={handleChange} disabled={saving}
                        placeholder="Open to opportunities"
                    />
                </div>

                {/* ── Divider ── */}
                <div className="prf-divider">
                    <span className="prf-divider-label">Links</span>
                </div>

                {/* ── Row 3: GitHub + LinkedIn ── */}
                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-github_url">GitHub URL</label>
                        <input
                            id="prf-github_url" className="prf-input"
                            name="github_url" value={form.github_url}
                            onChange={handleChange} disabled={saving}
                            placeholder="https://github.com/username"
                        />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-linkedin_url">LinkedIn URL</label>
                        <input
                            id="prf-linkedin_url" className="prf-input"
                            name="linkedin_url" value={form.linkedin_url}
                            onChange={handleChange} disabled={saving}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                </div>

                {/* ── Row 4: LeetCode + Resume ── */}
                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-leetcode_url">LeetCode URL</label>
                        <input
                            id="prf-leetcode_url" className="prf-input"
                            name="leetcode_url" value={form.leetcode_url}
                            onChange={handleChange} disabled={saving}
                            placeholder="https://leetcode.com/username"
                        />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-resume_url">Resume URL</label>
                        <input
                            id="prf-resume_url" className="prf-input"
                            name="resume_url" value={form.resume_url}
                            onChange={handleChange} disabled={saving}
                            placeholder="https://drive.google.com/..."
                        />
                    </div>
                </div>

                {/* ── Profile image ── */}
                <div className="prf-field">
                    <label className="prf-label" htmlFor="prf-profile_image_url">
                        Profile Image URL
                    </label>
                    <input
                        id="prf-profile_image_url" className="prf-input"
                        name="profile_image_url" value={form.profile_image_url}
                        onChange={handleChange} disabled={saving}
                        placeholder="https://..."
                    />
                </div>

                {/* ── Save error ── */}
                {saveStatus === 'error' && saveError && (
                    <div className="prf-error" role="alert">{saveError}</div>
                )}

                {/* ── Actions ── */}
                <div className="prf-actions">
                    <button type="submit" className="prf-btn prf-btn--save" disabled={saving}>
                        {saving
                            ? <><span className="spinner" aria-hidden="true" /> Saving…</>
                            : 'Save Profile'
                        }
                    </button>
                    {saveStatus === 'saved' && (
                        <span className="prf-saved-badge" role="status">✓ Saved</span>
                    )}
                </div>

            </form>
        </div>
    )
}