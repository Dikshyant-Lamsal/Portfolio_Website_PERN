// client/src/components/ProfileForm.jsx
// CHANGE: added PDF resume upload UI directly above the resume_url input.
// All other fields and save logic unchanged.

import { useState, useEffect } from 'react'
import API_URL from '../config/api'
import './ProfileForm.css'

const EMPTY = {
    full_name: '', role_title: '', hero_subtitle: '', about_text: '',
    github_url: '', linkedin_url: '', leetcode_url: '', email: '',
    resume_url: '', profile_image_url: '', location: '', availability_status: '',
}

export default function ProfileForm() {
    const [form, setForm] = useState(EMPTY)
    const [fetchStatus, setFetchStatus] = useState('loading')
    const [saveStatus, setSaveStatus] = useState('idle')
    const [saveError, setSaveError] = useState('')

    // ── Resume upload state ───────────────────────────────────────────────
    const [resumeFile, setResumeFile] = useState(null)
    const [resumeUploadStatus, setResumeUploadStatus] = useState('idle') // idle | uploading | done | error
    const [resumeUploadError, setResumeUploadError] = useState('')

    useEffect(() => {
        fetch(`${API_URL}/api/profile`)
            .then(res => { if (!res.ok) throw new Error(); return res.json() })
            .then(data => {
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
        if (saveStatus === 'saved') setSaveStatus('idle')
    }

    // ── Handle PDF file selection ─────────────────────────────────────────
    const handleResumeFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setResumeUploadError('')
        setResumeUploadStatus('idle')
        if (file.type !== 'application/pdf') {
            setResumeUploadError('Only PDF files are allowed.')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            setResumeUploadError('File too large. Maximum size is 10 MB.')
            return
        }
        setResumeFile(file)
    }

    // ── Upload PDF to Cloudinary via /api/upload/resume ───────────────────
    const handleResumeUpload = async () => {
        if (!resumeFile) return
        setResumeUploadStatus('uploading')
        setResumeUploadError('')

        const token = localStorage.getItem('adminToken')
        const formData = new FormData()
        formData.append('resume', resumeFile)

        try {
            const res = await fetch(`${API_URL}/api/upload/resume`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (!res.ok) {
                setResumeUploadError(data.error || 'Upload failed.')
                setResumeUploadStatus('error')
                return
            }
            // Auto-fill the resume_url field with the Cloudinary URL
            setForm(prev => ({ ...prev, resume_url: data.resumeUrl }))
            setResumeFile(null)
            setResumeUploadStatus('done')
        } catch {
            setResumeUploadError('Could not reach the server.')
            setResumeUploadStatus('error')
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaveStatus('saving')
        setSaveError('')
        const token = localStorage.getItem('adminToken')
        try {
            const res = await fetch(`${API_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            })
            const text = await res.text()
            const data = text ? JSON.parse(text) : {}
            if (!res.ok) { setSaveError(data.error || 'Failed to save.'); setSaveStatus('error'); return }
            setSaveStatus('saved')
        } catch {
            setSaveError('Could not reach the server.')
            setSaveStatus('error')
        }
    }

    if (fetchStatus === 'loading') return <div className="prf-loading"><span className="spinner" /> Loading profile…</div>
    if (fetchStatus === 'error') return <div className="prf-fetch-error">✗ Could not load profile data.</div>

    const saving = saveStatus === 'saving'
    const uploading = resumeUploadStatus === 'uploading'

    return (
        <div className="prf-wrap">
            <div className="prf-header">
                <h2 className="prf-title">Profile Settings</h2>
                <span className="prf-hint">Changes here update your live portfolio instantly</span>
            </div>

            <form className="prf-form" onSubmit={handleSave}>

                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-full_name">Full Name *</label>
                        <input id="prf-full_name" className="prf-input" name="full_name"
                            value={form.full_name} onChange={handleChange}
                            disabled={saving} placeholder="Dikshyant Lamsal" required />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-role_title">Role Title</label>
                        <input id="prf-role_title" className="prf-input" name="role_title"
                            value={form.role_title} onChange={handleChange}
                            disabled={saving} placeholder="Full-Stack Developer" />
                    </div>
                </div>

                <div className="prf-field">
                    <label className="prf-label" htmlFor="prf-hero_subtitle">Hero Subtitle</label>
                    <textarea id="prf-hero_subtitle" className="prf-input prf-textarea prf-textarea--sm"
                        name="hero_subtitle" value={form.hero_subtitle}
                        onChange={handleChange} disabled={saving} rows={3}
                        placeholder="Short bio shown below your name on the hero section" />
                </div>

                <div className="prf-field">
                    <label className="prf-label" htmlFor="prf-about_text">
                        About Text
                        <span className="prf-label-hint"> — separate paragraphs with a blank line</span>
                    </label>
                    <textarea id="prf-about_text" className="prf-input prf-textarea"
                        name="about_text" value={form.about_text}
                        onChange={handleChange} disabled={saving} rows={8}
                        placeholder={"Hi, I'm Jane — a developer based in...\n\nMy focus is..."} />
                </div>

                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-email">Email *</label>
                        <input id="prf-email" className="prf-input" name="email" type="email"
                            value={form.email} onChange={handleChange}
                            disabled={saving} placeholder="you@example.com" required />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-location">Location</label>
                        <input id="prf-location" className="prf-input" name="location"
                            value={form.location} onChange={handleChange}
                            disabled={saving} placeholder="India" />
                    </div>
                </div>

                <div className="prf-field prf-field--half">
                    <label className="prf-label" htmlFor="prf-availability_status">Availability Status</label>
                    <input id="prf-availability_status" className="prf-input" name="availability_status"
                        value={form.availability_status} onChange={handleChange}
                        disabled={saving} placeholder="Open to opportunities" />
                </div>

                <div className="prf-divider"><span className="prf-divider-label">Links</span></div>

                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-github_url">GitHub URL</label>
                        <input id="prf-github_url" className="prf-input" name="github_url"
                            value={form.github_url} onChange={handleChange}
                            disabled={saving} placeholder="https://github.com/username" />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-linkedin_url">LinkedIn URL</label>
                        <input id="prf-linkedin_url" className="prf-input" name="linkedin_url"
                            value={form.linkedin_url} onChange={handleChange}
                            disabled={saving} placeholder="https://linkedin.com/in/username" />
                    </div>
                </div>

                <div className="prf-row">
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-leetcode_url">LeetCode URL</label>
                        <input id="prf-leetcode_url" className="prf-input" name="leetcode_url"
                            value={form.leetcode_url} onChange={handleChange}
                            disabled={saving} placeholder="https://leetcode.com/username" />
                    </div>
                    <div className="prf-field">
                        <label className="prf-label" htmlFor="prf-resume_url">Resume URL</label>
                        <input id="prf-resume_url" className="prf-input" name="resume_url"
                            value={form.resume_url} onChange={handleChange}
                            disabled={saving} placeholder="https://drive.google.com/..." />
                    </div>
                </div>

                {/* ── Resume PDF Upload ── */}
                <div className="prf-field">
                    <label className="prf-label">Upload Resume PDF</label>
                    <div className="prf-resume-upload">
                        <div className="prf-upload-row">
                            <label className="prf-file-label" aria-label="Choose PDF file">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="prf-file-input"
                                    onChange={handleResumeFileChange}
                                    disabled={saving || uploading}
                                />
                                <span className="prf-file-btn">
                                    {resumeFile ? resumeFile.name : 'Choose PDF…'}
                                </span>
                            </label>

                            {resumeFile && (
                                <button
                                    type="button"
                                    className="prf-upload-btn"
                                    onClick={handleResumeUpload}
                                    disabled={uploading}
                                >
                                    {uploading
                                        ? <><span className="spinner" aria-hidden="true" /> Uploading…</>
                                        : 'Upload'
                                    }
                                </button>
                            )}

                            {resumeUploadStatus === 'done' && (
                                <span className="prf-upload-success">✓ Uploaded — URL auto-filled below</span>
                            )}
                        </div>

                        {resumeUploadError && (
                            <span className="prf-upload-error" role="alert">{resumeUploadError}</span>
                        )}

                        <p className="prf-upload-hint">
                            Upload a PDF to Cloudinary, or paste a URL directly in the field above.
                        </p>
                    </div>
                </div>

                <div className="prf-field">
                    <label className="prf-label" htmlFor="prf-profile_image_url">Profile Image URL</label>
                    <input id="prf-profile_image_url" className="prf-input" name="profile_image_url"
                        value={form.profile_image_url} onChange={handleChange}
                        disabled={saving} placeholder="https://..." />
                </div>

                {saveStatus === 'error' && saveError && (
                    <div className="prf-error" role="alert">{saveError}</div>
                )}

                <div className="prf-actions">
                    <button type="submit" className="prf-btn prf-btn--save" disabled={saving}>
                        {saving ? <><span className="spinner" aria-hidden="true" /> Saving…</> : 'Save Profile'}
                    </button>
                    {saveStatus === 'saved' && <span className="prf-saved-badge" role="status">✓ Saved</span>}
                </div>

            </form>
        </div>
    )
}